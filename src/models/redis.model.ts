import redis, { RedisClient } from "redis";
import { FEE_CONFIGURATION, FEE_CONFIGURATION_WITH_SPECIFICITY } from "../types";
import env from "../config/env.config";

const REDIS_URL = env.getValue("REDIS_URL");
const client = redis.createClient(REDIS_URL);
export default class RedisModel {
  client: RedisClient;
  constructor() {
    this.client = client;
    this.client.on("connect", this.onConnect);
  }

  private onConnect = () => {
    console.log("connected to redis-server on %s", REDIS_URL);
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
