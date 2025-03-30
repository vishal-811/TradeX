import { redisClient } from "..";

export async function getDataFromRedisQueue() {
  while (true) {
    const data = await redisClient.brPop("stock_data", 0);

    const stock_data = JSON.parse(data!.element);
    console.log("the tradex server stock_data looks like", stock_data);
  }
}
