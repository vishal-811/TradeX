import { subscribedUsers } from "..";
import WebSocket from "ws";
import { SendMsg } from "./utils";
import { AccountType } from "./type";

export function handleSubscribeEvent(
  ws: WebSocket,
  userAccountType: AccountType
) {
  if (!subscribedUsers.has(userAccountType)) {
    subscribedUsers.set(userAccountType, []);
  }
  const users = subscribedUsers.get(userAccountType);
  users?.push(ws);
  SendMsg(ws, { msg: "Subscribed Sucessfully" });
}

export function handleUnSubscribeEvent(
  ws: WebSocket,
  userAccountType: AccountType
) {
  let users = subscribedUsers.get(userAccountType);
  if (!users) {
    SendMsg(ws, { msg: "No user exist with this account type" });
    return;
  }

  users = users.filter((user) => {
    if (user !== ws) {
      return user;
    }
  });
  SendMsg(ws, { msg: "Unsubscribe Successfully" });
}
