import { errorHandler } from "./handlers";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { apiFetcher } from "./api";
import { TerminalPool } from "@/types/terminal";
import { openai } from "..";
puppeteerExtra.use(StealthPlugin());

export async function getTokenChart(token: string) {
  try {
    const poolsData = await apiFetcher<TerminalPool>(
      `https://api.geckoterminal.com/api/v2/networks/eth/tokens/${token}/pools?page=1`
    );
    const topPool = poolsData?.data.data.at(0);
    const pool = topPool?.attributes.address;
    const ohlcv_data = await apiFetcher(
      `https://api.geckoterminal.com/api/v2/networks/eth/pools/${pool}/ohlcv/minute?aggregate=15&currency=usd`
    );
    return { topPool, ohlcv_data };
  } catch (error) {
    errorHandler(error);
    return false;
  }
}

export async function getTokenAudit(token: string) {
  try {
    const requestBody = {
      chain: "eth",
      tier: "basic",
      tokenAddress: token,
    };

    const response = await fetch(
      "https://app.quickintel.io/api/quicki/getquickiauditfull",
      { method: "POST", body: JSON.stringify(requestBody) }
    );
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    errorHandler(error);
    return false;
  }
}

export const tokenInfoFormat = {
  marketData: {
    title: "Market Data",
    paragraphs: [
      "The market data includes the token name, token age, token price, market cap, liquidity, price deviation across a certain time interval, and all such basic info. Don't list all these things in the order mentioned here, instead just write a paragraph about the market data in general.",
      "Make an inference using the market data in this paragraph.",
    ],
  },
  auditData: {
    title: "Audit Data",
    paragraphs: [
      "Include the key points from the audit in this paragraph and word them nicely.",
      "Have another paragraph here about the audit (optional)",
    ],
  },
  chartData: {
    title: "Chart Data",
    paragraphs: [
      "The open, high, low, close, and volume data for the token over the past intervals",
      "Chart pattern and information about the pattern",
      "Resistance and support",
      "Basic trading strategy",
    ],
  },
};

export async function getAITokenInfo(token: string) {
  const [chart, audit] = await Promise.all([
    getTokenChart(token),
    getTokenAudit(token),
  ]);

  if (!chart || !audit) {
    return false;
  }

  const { ohlcv_data, topPool } = chart;

  const prompt = `Chart data - ${JSON.stringify(ohlcv_data)}
  Audit data - ${JSON.stringify(audit)}
  Market data - ${JSON.stringify(topPool)}
  
  Analyze the chart that is formed by the data below and identify the chart pattern, points of resistance and support and where to look for a breakout with a basic trading strategy. Include market info about the top pool and the token audit data in your analysis. Start off with the name of the token and current market data related to the pool, then move onto the audit, then finally the chart analysis.
  
  The output data shouold be in the following format: ${JSON.stringify(
    tokenInfoFormat
  )}`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
  });

  return chat.choices.at(0)?.message.content as string;
}

export interface TokenInfo {
  marketData: {
    title: string;
    paragraphs: string[];
  };
  auditData: {
    title: string;
    paragraphs: string[];
  };
  chartData: {
    title: string;
    paragraphs: string[];
  };
}
