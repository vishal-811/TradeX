import { redisClient, subscribedUsers } from "..";
import WebSocket from "ws";
import { AccountType, BinanceApiData, Stock_Data_Type } from "./type";

export function SendMsg(ws: WebSocket, data: object) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ data: data }));
  }
}

export function BroadCastStockData(
  accountType: AccountType,
  data: Stock_Data_Type
) {
  const users = subscribedUsers.get(accountType);
  users?.map((user) => {
    if (user.readyState === WebSocket.OPEN) {
      user.send(JSON.stringify({ msg: "allStockData", data: data }));
    }
  });
}

// As of now i have a fixed spread.
const spreadConfig: Record<AccountType, number> = {
  [AccountType.STANDARD]: 0.003,
  [AccountType.PRO]: 0.002,
  [AccountType.RAW_SPREAD]: 0.0005,
  [AccountType.ZERO]: 0.0003,
  [AccountType.STANDARD_CENT]: 0.004,
};

function calculateSpread(marketPrice: number, spread: number) {
  const spreadFee = marketPrice * spread;
  const buyPrice = (marketPrice + spreadFee).toFixed(2);
  const sellPrice = (marketPrice - spreadFee).toFixed(2);
  return { buyPrice, sellPrice };
}

export function AdjustPrice(data: BinanceApiData) {
  /**
   * Binance api resposne.
   * E -> Event TimeStamps, s-> symbol, t-> orderID, p-> price, q-> qunatity, T-> TimeStamp
   */
  const { E, s, t, p, q, T } = data;
  const marketPrice = parseFloat(p);

  Object.entries(spreadConfig).forEach(async ([accountType, spread]) => {
    const { buyPrice, sellPrice } = calculateSpread(marketPrice, spread);
    const Stock_Data = {
      symbol: s,
      buyPrice: parseFloat(buyPrice),
      sellPrice: parseFloat(sellPrice),
      timeStamp: Date.now(),
      eventTimeStamp: E,
      account_Type: accountType as AccountType,
    };
    BroadCastStockData(accountType as AccountType, Stock_Data);
    await redisClient.lPush("stock_data", JSON.stringify(Stock_Data));
  });
}
