export enum EventType {
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
}

export enum AccountType {
  STANDARD = "standard",
  PRO = "pro",
  RAW_SPREAD = "raw_spread",
  ZERO = "zero",
  STANDARD_CENT = "standard_cent",
}

export interface Stock_Data_Type {
  symbol: string;
  buyPrice: number;
  sellPrice: number;
  timeStamp: number;
  eventTimeStamp: number;
  account_Type: AccountType;
}

export interface BinanceApiData {
  e: string;
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  T: number;
}
export interface BinanceApiResponse {
  stream: string;
  data: BinanceApiData;
}
