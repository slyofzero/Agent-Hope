import OpenAI from "openai";
import { OPEN_AI_KEY, PORT } from "./utils/env";
import express from "express";
import { log } from "./utils/handlers";
import { getAITokenInfo, TokenInfo } from "./utils/audit";
import cors from "cors";

export const openai = new OpenAI({
  apiKey: OPEN_AI_KEY,
});

const app = express();
app.use(express.json());
app.use(cors());

(async function () {
  app.get("/token/:address", async (req, res) => {
    const address = req.params.address;
    let info = await getAITokenInfo(address);

    if (!info) {
      res.json({ error: "No info found" });
      return;
    }

    info = info.replace(/```json/, "").replace(/```/, "");
    const jsonData = JSON.parse(info) as TokenInfo;
    res.json({ data: jsonData, response: 200 });
    return;
  });

  app.listen(PORT, () => {
    log(`Server is running on http://localhost:${PORT}`);
  });
})();
