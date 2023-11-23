import { RateLimiter } from 'limiter';

export const limiter = new RateLimiter({
  tokensPerInterval: 50,
  interval: 'min',
  fireImmediately: true,
})

export const checkLimiter = async () => {
  const remaning = await limiter.removeTokens(1);
  if (remaning < 0) {
    throw new Error('Too many requests');
  }
  return true;
}