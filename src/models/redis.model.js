import redis, { RedisClient } from "redis";
import env from "../config/env.config.js";

const REDIS_URL = env.getValue("REDIS_URL");
const client = redis.createClient(REDIS_URL);
export default class RedisModel {
  constructor() {
    this.client = client;
    this.client.on("connect", this.onConnect);
  }

  onConnect = () => {
    console.log("connected to redis-server on %s", REDIS_URL);
  };

  setData = async (
    key,
    data
  ) => {
    return new Promise((resolve, reject) => {
      this.client.set(key, JSON.stringify(data), (err) => {
        if (err) {
          reject("an error occured");
        }
        resolve("set data successfully");
      });
    });
  };

  getData = (
    key
  ) => {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (reply) {
          resolve(JSON.parse(reply));
        }
        reject(err.message);
      });
    });
  };
}
