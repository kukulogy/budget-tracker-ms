import { FastifyInstance } from "fastify";
import { FastifyRedis } from "@fastify/redis";

type GetOrSetOptions = {
  ttl?: number;
  lockTTL?: number;
  jitterRatio?: number;
  retryDelay?: number;
  maxRetries?: number;
};

export class RedisHelper {
  private redis: FastifyRedis;

  constructor(fastify: FastifyInstance) {
    this.redis = fastify.redis;
  }

  getOrSet = async (
    key: string,
    fetcher: () => Promise<string>,
    options: GetOrSetOptions = {},
  ): Promise<string> => {
    const { ttl = 3600, lockTTL = 10, jitterRatio = 0.2 } = options;
    const cached = await this.redis.get(key);
    console.log("RedisHelper.getOrSet: ", { key, cached });
    if (cached) return cached;

    const lockKey = `lock:${key}`;
    const lock = await this.redis.set(lockKey, "1", "EX", lockTTL, "NX");

    if (lock) {
      console.log("RedisHelper.getOrSet: Acquired lock for key: ", key);
      const value = await fetcher();
      const jitter = Math.floor((Math.random() - 0.5) * jitterRatio * ttl);
      await this.redis.set(key, value, "EX", ttl + jitter);
      await this.redis.del(lockKey);
      return value;
    }

    return await fetcher();
  };
}
