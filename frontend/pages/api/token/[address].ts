import { NextApiRequest, NextApiResponse } from "next";
import { TokenInfoApiRes } from "@/types/info";
import { TerminalPool } from "@/types/terminal";
import { apiFetcher } from "@/utils/api";
import { SCRIPT_URL } from "@/utils/env";
import { errorHandler } from "@/utils/handlers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;

  if (typeof address !== "string") {
    res.status(400).json({ message: "Invalid token address" });
    return;
  }

  try {
    const tokenData = await apiFetcher<TerminalPool>(
      `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${address}/pools?page=1`
    );

    if (!tokenData || !tokenData.data.data.length) {
      res.status(404).json({ message: "No pools found for this token" });
      return;
    }

    const tokenInfo = await apiFetcher<TokenInfoApiRes>(
      `${SCRIPT_URL}/token/${address}`
    );
    if (!tokenInfo) {
      res.status(404).json({ message: "No info found for this token" });
      return;
    }

    res.status(200).json(tokenInfo.data);
  } catch (error) {
    errorHandler(error);
    res.status(500).json({ message: "Couldn't fetch data for this token" });
  }
}
