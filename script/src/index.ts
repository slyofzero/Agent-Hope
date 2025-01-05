import OpenAI from "openai";
import { BEARER_TOKEN, OPEN_AI_KEY, PORT } from "./utils/env";
import express from "express";
import { log } from "./utils/handlers";
import cors from "cors";
import { tokenInfoPath } from "./paths/tokenInfo";
import { getJobStatus } from "./paths/job";
import Client from "twitter-api-sdk";
import { rpcConfig } from "./rpc/config";

export const openai = new OpenAI({
  apiKey: OPEN_AI_KEY,
});

export const twitter = new Client(BEARER_TOKEN as string);

const app = express();
app.use(express.json());
app.use(cors());

(async function () {
  rpcConfig();

  // @ts-expect-error weird
  app.get("/token/:address", tokenInfoPath);
  // @ts-expect-error weird
  app.get("/job/:jobId", getJobStatus);

  app.listen(PORT, () => {
    log(`Server is running on http://localhost:${PORT}`);
  });
})();
