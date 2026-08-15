# Security Integration for Auth Endpoints

## Quick Start - Add to Signin Endpoint

Update `/app/api/auth/signin/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  checkRateLimit, 
  rateLimitConfigs, 
  getClientIP 
} from '@/lib/rateLimit';
import { 
  getAccountLockStatus, 
  recordFailedAttempt, 
  clearFailedAttempts,
  getLockoutMessage 
} from '@/lib/accountLockout';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const clientIP = getClientIP(request);

    // Step 1: Rate limit check
    if (!checkRateLimit(clientIP, rateLimitConfigs.signin)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in a few minutes.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Step 2: Get user and check account lockout
    // (First, get userId from email lookup)
    // const user = await getUserByEmail(email);
    // if (user) {
    //   const lockStatus = await getAccountLockStatus(user.id);
    //   if (lockStatus.isLocked) {
    //     return NextResponse.json(
    //       { error: getLockoutMessage(lockStatus) },
    //       { status: 429 }
    //     );
    //   }
    // }

    // Step 3: Attempt authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Step 4: On success, clear failed attempts
      // await clearFailedAttempts(userCredential.user.uid);
      
      return NextResponse.json({
        success: true,
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
        },
      });
    } catch (authError: any) {
      // Step 5: On failure, record attempt
      // If user exists, record failed attempt
      // const user = await getUserByEmail(email);
      // if (user) {
      //   await recordFailedAttempt(user.id);
      // }

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Add to Signup Endpoint

Update `/app/api/auth/signup/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  checkRateLimit,
  rateLimitConfigs,
  getClientIP,
} from '@/lib/rateLimit';
import { verifyCaptcha, isSuspiciousScore } from '@/lib/captcha';

export async function POST(request: NextRequest) {
  try {
    const { email, password, captchaToken } = await request.json();
    const clientIP = getClientIP(request);

    // Step 1: Rate limit check
    if (!checkRateLimit(clientIP, rateLimitConfigs.signup)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Try again in 1 hour.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    // Step 2: Verify CAPTCHA
    const captchaResult = await verifyCaptcha(captchaToken, clientIP);
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Step 3: Check risk score
    if (isSuspiciousScore(captchaResult.score)) {
      console.warn(`Suspicious signup attempt from ${clientIP}, score: ${captchaResult.score}`);
      // Could add additional verification or blocking here
    }

    // Step 4: Create account
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Step 5: Send verification email
      // await sendVerificationEmail(userCredential.user.uid, email);

      return NextResponse.json({
        success: true,
        message: 'Account created. Please verify your email.',
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email,
        },
      }, { status: 201 });
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }
      if (authError.code === 'auth/weak-password') {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      throw authError;
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Add to Password Reset Endpoint

Update `/app/api/auth/password-reset/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  checkRateLimit,
  rateLimitConfigs,
  getClientIP,
} from '@/lib/rateLimit';
import { verifyCaptcha } from '@/lib/captcha';

export async function POST(request: NextRequest) {
  try {
    const { email, captchaToken } = await request.json();
    const clientIP = getClientIP(request);

    // Step 1: Rate limit check (per email)
    const emailKey = `password-reset-${email}`;
    if (!checkRateLimit(emailKey, rateLimitConfigs.passwordReset)) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Try again in 1 hour.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    // Step 2: Verify CAPTCHA
    const captchaResult = await verifyCaptcha(captchaToken, clientIP);
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Step 3: Send reset email (don't reveal if email exists)
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      // Don't reveal whether email exists
      console.error('Password reset error:', error);
    }

    // Always return success message for security
    return NextResponse.json({
      success: true,
      message: 'Password reset email sent if account exists',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Frontend: Add CAPTCHA to Forms

Add to signup/password-reset components:

```typescript
import { useEffect } from 'react';

export default function SignupForm() {
  useEffect(() => {
    // Load Cloudflare Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    document.head.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get CAPTCHA token
    const captchaResponse = (window as any).turnstile.getResponse();
    if (!captchaResponse) {
      alert('Please complete CAPTCHA');
      return;
    }

    // Submit form with CAPTCHA token
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        captchaToken: captchaResponse,
      }),
    });

    // Handle response...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      {/* Turnstile CAPTCHA */}
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
        data-theme="light"
      ></div>

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

---

## Environment Variables Required

Add to `.env.local`:

```bash
# Cloudflare Turnstile (for CAPTCHA)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_site_key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your_secret_key

# Security Settings
SECURITY_MAX_LOGIN_ATTEMPTS=5
SECURITY_LOGIN_LOCKOUT_MINUTES=15
SECURITY_MAX_SIGNUP_ATTEMPTS_PER_HOUR=3
ENABLE_BOT_PROTECTION=true
ENABLE_RATE_LIMITING=true
```

---

## Testing Integration

### Test Rate Limiting
```bash
# Run 6 login attempts from same IP
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.100" \
  -d '{"email":"test@example.com","password":"wrong"}'
# Should return 429 after 5 attempts
```

### Test Account Lockout
```bash
# After 5 failed logins, check lockout
# Account should be locked for 15 minutes
# Subsequent attempts return "Account locked" message
```

### Test CAPTCHA
```bash
# Try signup without CAPTCHA token
# Should return 400 "CAPTCHA verification failed"
# Try with invalid token - same response
# Try with valid token - should proceed
```

---

## Deployment

### Cloudflare Setup
```bash
# Install wrangler
npm install -g @cloudflare/wrangler

# Login to Cloudflare
wrangler login

# Deploy security configuration
wrangler publish
```

### Vercel Deployment
```bash
# Add environment variables in Vercel dashboard:
# Settings → Environment Variables

# Add:
- NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
- CLOUDFLARE_TURNSTILE_SECRET_KEY
- All SECURITY_* variables
```

---

## Monitoring

### Key Metrics
- Failed login attempts per user
- Rate limit hits per endpoint
- Account lockouts
- CAPTCHA fail rate
- Suspicious IP addresses

### Alerts to Set Up
1. >10 failed logins in 1 hour → email admin
2. CAPTCHA fail rate >20% → check for bot attacks
3. IP with >50 failed attempts → consider blocking
4. Multiple account lockouts same IP → alert security team
