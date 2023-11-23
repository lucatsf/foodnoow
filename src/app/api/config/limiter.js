import { RateLimiter } from 'limiter';
import { NextResponse } from 'next/server';

export const limiter = new RateLimiter({
  tokensPerInterval: 50,
  interval: 'min',
  fireImmediately: true,
})

export const checkLimiter = async (req) => {
  const origin = req.headers.get('origin');
  const remaning = await limiter.removeTokens(1);
  if (remaning < 0) {
    throw new Error('Too many requests');
  }
  return true;
}