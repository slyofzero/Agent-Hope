import { RPC_ENDPOINT } from "../utils/env";
import { log } from "../utils/handlers";
import { Connection } from "@solana/web3.js";

export let solanaConnection: Connection = null as unknown as Connection;

let initialized = false;

export function rpcConfig() {
  if (initialized) return;

  if (!RPC_ENDPOINT) {
    throw new Error("RPC endpoint is undefined");
  }

  solanaConnection = new Connection(RPC_ENDPOINT);
  initialized = true;

  log("RPC configured");
}
