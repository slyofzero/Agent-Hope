import dotenv from "dotenv";

export const { NODE_ENV } = process.env;
dotenv.config({
  path: NODE_ENV === "development" ? ".env" : ".env",
});

export const { OPEN_AI_KEY, PORT, BEARER_TOKEN, RPC_ENDPOINT, API_URL } =
  process.env;
