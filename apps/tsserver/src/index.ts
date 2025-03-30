import http from "http";
import { createClient, RedisClientType } from "redis";
import { getDataFromRedisQueue } from "./lib/redis";

const server = http.createServer();

export const redisClient: RedisClientType = createClient({
  url: "redis://localhost:6379",
});

async function StartServer() {
  try {
    await redisClient.connect();
    console.log("Time series server Connected successfully to the redis queue");
  } catch (error) {
    console.error(
      "Error in connecting the Time series server to the redis queue"
    );
  }

  server.listen(3001, () => {
    console.log("Time series server running on port 3001");
  });
  getDataFromRedisQueue();
}

StartServer();
