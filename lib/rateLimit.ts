/**
 * Rate limiting and security utilities
 * Prevents brute force attacks on auth endpoints
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // milliseconds
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

/**
 * Check if an IP/email has exceeded rate limit
 */
export function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // No record or expired
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { attempts: 1, resetTime: now + config.windowMs });
    return true; // Allow
  }

  // Within rate limit
  if (record.attempts < config.maxAttempts) {
    record.attempts++;
    return true; // Allow
  }

  // Exceeded rate limit
  return false;
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Get remaining attempts for display/logging
 */
export function getRateLimitStatus(key: string, config: RateLimitConfig): {
  remaining: number;
  resetAt: number;
} {
  const record = rateLimitStore.get(key);

  if (!record) {
    return { remaining: config.maxAttempts, resetAt: Date.now() + config.windowMs };
  }

  return {
    remaining: Math.max(0, config.maxAttempts - record.attempts),
    resetAt: record.resetTime,
  };
}

/**
 * Rate limit configs for different endpoints
 */
export const rateLimitConfigs = {
  signin: {
    maxAttempts: 5,
    windowMs: 60 * 1000, // 1 minute
  },
  signup: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  emailVerification: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

/**
 * Extract IP from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}
