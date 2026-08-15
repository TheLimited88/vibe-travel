/**
 * CAPTCHA verification using hCaptcha or Cloudflare Turnstile
 * Prevents bot account creation and abuse
 */

export interface CaptchaVerifyRequest {
  token: string;
  remoteIP?: string;
}

export interface CaptchaVerifyResponse {
  success: boolean;
  challengeTs?: string;
  hostname?: string;
  errorCodes?: string[];
  score?: number; // Cloudflare Turnstile score
}

/**
 * Verify hCaptcha token
 */
export async function verifyHCaptcha(token: string, remoteIP?: string): Promise<CaptchaVerifyResponse> {
  try {
    const secret = process.env.HCAPTCHA_SECRET_KEY;

    if (!secret) {
      console.error('HCAPTCHA_SECRET_KEY not configured');
      return { success: false, errorCodes: ['missing-secret'] };
    }

    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: remoteIP || '',
      }),
    });

    const data = (await response.json()) as any;

    return {
      success: data.success,
      challengeTs: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data['error-codes'],
    };
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return { success: false, errorCodes: ['verification-error'] };
  }
}

/**
 * Verify Cloudflare Turnstile token
 */
export async function verifyTurnstile(token: string, remoteIP?: string): Promise<CaptchaVerifyResponse> {
  try {
    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    if (!secret) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY not configured');
      return { success: false, errorCodes: ['missing-secret'] };
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteIP,
      }),
    });

    const data = (await response.json()) as any;

    return {
      success: data.success,
      challengeTs: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data['error-codes'],
      score: data.score, // Risk score 0.0-1.0
    };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, errorCodes: ['verification-error'] };
  }
}

/**
 * Main CAPTCHA verification function
 * Uses Cloudflare Turnstile if available, falls back to hCaptcha
 */
export async function verifyCaptcha(token: string, remoteIP?: string): Promise<CaptchaVerifyResponse> {
  // Try Turnstile first (Cloudflare's service)
  if (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
    return verifyTurnstile(token, remoteIP);
  }

  // Fall back to hCaptcha
  if (process.env.HCAPTCHA_SECRET_KEY) {
    return verifyHCaptcha(token, remoteIP);
  }

  console.error('No CAPTCHA provider configured');
  return { success: false, errorCodes: ['no-provider-configured'] };
}

/**
 * Check if CAPTCHA score indicates suspicious activity
 * Cloudflare Turnstile: 0.0 = bot, 1.0 = human
 */
export function isSuspiciousScore(score?: number): boolean {
  if (score === undefined) return false;
  return score < 0.5; // Flag if less than 50% confidence it's human
}
