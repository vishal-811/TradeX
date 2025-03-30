import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import { AccountType, BinanceApiResponse, EventType } from "./lib/type";
import { handleSubscribeEvent, handleUnSubscribeEvent } from "./lib/events";
import { AdjustPrice } from "./lib/utils";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer((req, res) => {
  res.end("hi");
});

const wss = new WebSocketServer({ server });

const symbols = [
  "btcusdt",
  "ethusdt",
  "bnbusdt",
  "xrpusdt",
  "solusdt",
  "adausdt",
  "dogeusdt",
];

let userAccountType: AccountType | null = null;
const binanceWs = new WebSocket(
  `${process.env.BINANCE_WS_URL}?streams=${symbols.map((s) => `${s}@trade`).join("/")}`
);

binanceWs.on("message", (data) => {
  const parsedData = JSON.parse(data.toString()) as BinanceApiResponse;
  AdjustPrice(parsedData.data);
});

export const subscribedUsers = new Map<string, WebSocket[]>(); // { userAccountType, [user1,user2] }

function handleWebsocketMessageEvent(message: any, ws: WebSocket) {
  const parsedMessage = JSON.parse(message.toString());

  const event = parsedMessage.event;

  // user send the profile id from the frontend.
  // make a db call get the user_account_type.
  userAccountType = AccountType.STANDARD; //Need to change later dynamically.

  switch (event) {
    case EventType.SUBSCRIBE:
      handleSubscribeEvent(ws, userAccountType);
      break;
    case EventType.UNSUBSCRIBE:
      handleUnSubscribeEvent(ws, userAccountType);
      break;
    default:
      console.log("Wrong Event");
  }
}

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    handleWebsocketMessageEvent(message, ws);
  });
  ws.on("error", (error) => {
    console.error("Something went wrong");
  });
  ws.on("close", () => {
    handleUnSubscribeEvent(ws, userAccountType!);
  });
});

server.listen(8080, () => {
  console.log("websocket server is listening on port 8080");
});
