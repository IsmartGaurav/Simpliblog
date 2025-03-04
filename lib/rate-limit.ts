import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a conditional rate limiter
let ratelimit: Ratelimit | null = null;

// Only initialize if environment variables are available
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Create a new ratelimiter that allows 3 requests per day
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 d"),
    analytics: true,
  });
} else {
  console.warn("Rate limiting is disabled. UPSTASH_REDIS environment variables not set.");
}

export async function rateLimit(identifier: string) {
  // If rate limiter is not initialized, allow all requests
  if (!ratelimit) {
    return { success: true };
  }

  return await ratelimit.limit(identifier);
}

export const emailRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 d"),
  analytics: true,
  prefix: "ratelimit:email",
});