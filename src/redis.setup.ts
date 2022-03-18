import redis, { RedisClient } from "redis";
import { FEE_CONFIGURATION, FEE_CONFIGURATION_WITH_SPECIFICITY } from "./types";
import env from "./config/env.config";

const REDIS_HOST = env.getValue("REDIS_HOST");
const REDIS_PORT = env.getValue("REDIS_PORT") as unknown as number;
const client = redis.createClient(REDIS_PORT, REDIS_HOST);
export default class Redis {
  client: RedisClient;
  constructor() {
    this.client = client;
    this.client.on("connect", this.onConnect);
  }

  private onConnect = () => {
    console.log("connected to redis-server on port %s", REDIS_PORT);
  };

  public setData = async (
    key: string,
    data: FEE_CONFIGURATION[]
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.client.set(key, JSON.stringify(data), (err) => {
        if (err) {
          reject("an error occured");
        }
        resolve("set data successfully");
      });
    });
  };

  public getData = (
    key: string
  ): Promise<FEE_CONFIGURATION_WITH_SPECIFICITY[]> => {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err: Error | null, reply: string | null) => {
        if (reply) {
          resolve(JSON.parse(reply));
        }
        reject(err?.message);
      });
    });
  };
}
