# Security Implementation Guide - Vibe Travel

## Overview
Complete security stack to protect authentication endpoints from bots, hackers, and abuse.

## Security Layers

### Layer 1: Cloudflare Protection (Edge)
**What it does:**
- DDoS mitigation (automatic)
- WAF (Web Application Firewall)
- Bot Management
- Rate limiting at edge

**Setup:**
```bash
# Install Cloudflare CLI
npm install -g @cloudflare/wrangler

# Configure (update account_id in wrangler.toml)
wrangler publish
```

**Cloudflare Dashboard:**
1. Go to `vibetravel.fun` zone
2. Navigate to **Security → WAF**
3. Enable "Cloudflare Bot Management"
4. Set up rate limiting rules (see wrangler.toml)

---

### Layer 2: Rate Limiting (Application Level)
**Configured in:** `lib/rateLimit.ts`

**Rate Limits:**
- **Signin:** 5 attempts per minute, 50 per hour per IP
- **Signup:** 3 attempts per hour per IP
- **Password Reset:** 3 per hour per email
- **Email Verification:** 10 per hour per email

**How it works:**
```typescript
import { checkRateLimit, rateLimitConfigs, getClientIP } from '@/lib/rateLimit';

const clientIP = getClientIP(request);
if (!checkRateLimit(clientIP, rateLimitConfigs.signin)) {
  return NextResponse.json(
    { error: 'Too many login attempts. Try again later.' },
    { status: 429 }
  );
}
```

---

### Layer 3: Account Lockout (After Failed Attempts)
**Configured in:** `lib/accountLockout.ts`

**Lockout Rules:**
- Lock after 5 failed login attempts
- Lock duration: 15 minutes
- Failed attempts reset after 24 hours

**How it works:**
```typescript
import { getAccountLockStatus, recordFailedAttempt, clearFailedAttempts } from '@/lib/accountLockout';

// Check if account is locked
const lockStatus = await getAccountLockStatus(userId);
if (lockStatus.isLocked) {
  return NextResponse.json(
    { error: getLockoutMessage(lockStatus) },
    { status: 429 }
  );
}

// On failed login
await recordFailedAttempt(userId);

// On successful login
await clearFailedAttempts(userId);
```

---

### Layer 4: CAPTCHA (Bot Detection)
**Configured in:** `lib/captcha.ts`

**Options:**
1. **Cloudflare Turnstile** (Recommended)
   - Faster, no manual solving required
   - Risk score 0.0-1.0 (0 = bot, 1 = human)
   - Free up to certain limits

2. **hCaptcha** (Alternative)
   - More privacy-friendly
   - Manual puzzle solving
   - Supports different difficulty levels

**Implementation:**
```typescript
import { verifyCaptcha } from '@/lib/captcha';

// In signup/password reset endpoints
const captchaResult = await verifyCaptcha(token, clientIP);
if (!captchaResult.success) {
  return NextResponse.json(
    { error: 'CAPTCHA verification failed' },
    { status: 400 }
  );
}

// Check risk score if available
if (captchaResult.score && isSuspiciousScore(captchaResult.score)) {
  // Additional verification or blocking
}
```

---

### Layer 5: Email Verification
Already implemented - confirms user owns the email address before account activation.

---

## Setup Instructions

### 1. Get Cloudflare Turnstile Keys
```
1. Log in to https://dash.cloudflare.com/
2. Navigate to Turnstile (left sidebar)
3. Create a Site Key and Secret Key
4. Add to .env.local:
   - NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=xxx
   - CLOUDFLARE_TURNSTILE_SECRET_KEY=xxx
```

### 2. Configure Cloudflare WAF
```
1. Go to Security → WAF Rules
2. Create custom rules for /api/auth/* endpoints
3. Enable rate limiting rules from wrangler.toml
4. Publish wrangler configuration
```

### 3. Update Auth Endpoints
Add rate limiting and account lockout to:
- `/app/api/auth/signin/route.ts`
- `/app/api/auth/signup/route.ts`
- `/app/api/auth/password-reset/route.ts`

### 4. Add CAPTCHA to Frontend
```typescript
// In signup/password-reset components
const response = await fetch('/api/turnstile-token');
const { token } = await response.json();

// Include in form submission
const formData = {
  email,
  password,
  captchaToken: token,
};
```

---

## Monitoring & Alerts

### Key Metrics to Monitor
- Failed login attempts per user
- Login attempts from unique IPs
- Account lockout events
- CAPTCHA fail rates
- Cloudflare bot scores

### Set Up Alerts
1. **Firebase:** Monitor login failures
2. **Cloudflare:** Bot Management alerts
3. **Email:** Alert on multiple lockouts same day

---

## Testing Security

### Test Rate Limiting
```bash
# Simulate 6 login attempts in 1 minute
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}' \
    -H "X-Forwarded-For: 192.168.1.1"
done
# 6th request should return 429 Too Many Requests
```

### Test Account Lockout
```bash
# Trigger 5 failed login attempts
# 6th attempt should say account is locked
# Wait 15 minutes or modify lockout duration in env
```

### Test CAPTCHA
```bash
# Manually test in browser dev tools
const response = await fetch('/.../turnstile-token');
console.log(response);
```

---

## Production Checklist

- [ ] Cloudflare WAF rules configured
- [ ] Turnstile or hCaptcha keys added to .env
- [ ] Rate limiting implemented on all auth endpoints
- [ ] Account lockout logic tested
- [ ] CAPTCHA integrated in signup/password-reset
- [ ] Email alerts configured for suspicious activity
- [ ] Monitoring dashboard set up
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] CORS properly configured
- [ ] SSL/TLS enforced

---

## API Response Examples

### Rate Limited (429)
```json
{
  "error": "Too many attempts. Please try again in 1 minute.",
  "retryAfter": 60
}
```

### Account Locked (429)
```json
{
  "error": "Account temporarily locked. Try again in 12 minutes.",
  "lockedUntil": 1692096000000
}
```

### CAPTCHA Failed (400)
```json
{
  "error": "CAPTCHA verification failed. Please try again.",
  "success": false
}
```

---

## Security Best Practices

1. **Never log passwords** - Only log hashed values
2. **Use HTTPS only** - All auth endpoints must use HTTPS
3. **Secure cookies** - Set httpOnly, secure, sameSite flags
4. **CORS** - Restrict to your domain only
5. **CSP Headers** - Prevent XSS attacks
6. **Rate limit APIs** - All endpoints, not just auth
7. **Monitor anomalies** - Detect unusual patterns
8. **Keep secrets safe** - Never commit keys to git
9. **Rotate keys** - Quarterly rotation recommended
10. **Incident response** - Have a plan for breaches

---

## Troubleshooting

### CAPTCHA not verifying
- Check keys are correct in .env.local
- Verify secret key matches site key
- Check IP blocklist on Cloudflare
- Test with curl to isolate frontend vs backend

### Rate limiting too strict
- Adjust limits in `rateLimitConfigs` in lib/rateLimit.ts
- Increase windowMs for longer cooldowns
- Decrease maxAttempts for stricter limits

### Account locked users can't login
- Wait 15 minutes for auto-unlock
- Or manually clear in Firestore: `db/account_lockouts/{userId}`
- Send "unlock" email to user

---

## References
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [hCaptcha](https://www.hcaptcha.com/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
