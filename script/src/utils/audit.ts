import { errorHandler } from "./handlers";
import { apiFetcher } from "./api";
import { TerminalPool } from "@/types/terminal";
import { openai, twitter } from "..";
import { PairData } from "@/types";
import { solanaConnection } from "@/rpc/config";
3;
import { Metaplex, PublicKey } from "@metaplex-foundation/js";

export async function getTokenChart(token: string) {
  try {
    const poolsData = await apiFetcher<TerminalPool>(
      `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${token}/pools?page=1`
    );
    const topPool = poolsData?.data.data.at(0);
    const pool = topPool?.attributes.address;
    const ohlcv_data = await apiFetcher(
      `https://api.geckoterminal.com/api/v2/networks/solana/pools/${pool}/ohlcv/minute?aggregate=15&currency=usd`
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
      chain: "solana",
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

// const asciiArt = `░█░█░█▀█░▀█▀░░░█▀█░█▀▀░█▀█░█░█░█▀▄░▀█▀░█▀▀ ░█▄█░█▀█░░█░░░░█░█░█░█░█░█░█░█░█░█░░░▀▀█░█▀▀ ░█░█░▀░▀░░▀░░░░▀▀▀░▀▀▀░▀▀▀░▀▄▀░▀▀░░░░▀▀▀░▀▀▀`;

export const tokenInfoFormat = {
  tokenData: {
    title: "Token Data",
    paragraphs: [
      "Briefly explain the token, if it's a memecoin or an AI utility or some other product based coin",
      "What the website says if the token has any (optional)",
    ],
  },
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
    bulletPoints: ["Include 2-5 bullet points here related to token audit"],
  },
  chartData: {
    title: "Chart Data",
    paragraphs: [
      "The open, high, low, close, and volume data for the token over the past intervals",
      "Chart pattern and information about the pattern",
      "Resistance and support",
      "Basic trading strategy",
    ],
    bulletPoints: ["Include 2-5 bullet points here related to the chart"],
  },
  engagementData: {},
};

export async function getRecentTweets(token: string) {
  try {
    const data = await apiFetcher<PairData>(
      `https://api.dexscreener.com/latest/dex/tokens/${token}`
    );

    const socials = data?.data?.pairs?.find(
      (pair) => pair.info.socials.length > 0
    );

    const username = socials?.info.socials
      .find((social) => social.type === "twitter")
      ?.url.replace("https://x.com/", "");

    if (!username) {
      return { data: [] };
    }

    // Step 1: Get the user ID from the username
    const user = await twitter.users.findUserByUsername(username, {"tweet.fields": ["public_metrics"]}); //prettier-ignore
    const userId = user.data?.id;

    if (!userId) {
      return { data: [] };
    }
    const tweets = await twitter.tweets.usersIdTweets(userId, {"tweet.fields": ["public_metrics"]}); //prettier-ignore
    return { data: tweets.data, user: user.data };
  } catch (error) {
    errorHandler(error);
    return { data: [] };
  }
}

export async function getAITokenInfo(token: string) {
  const [metadata, chart, audit, tweets] = await Promise.all([
    getTokenMetadata(token),
    getTokenChart(token),
    getTokenAudit(token),
    getRecentTweets(token),
  ]);

  if (!chart || !audit) {
    return false;
  }

  const { ohlcv_data, topPool } = chart;

  let dataText = `Token Data - ${JSON.stringify(metadata)}
  Chart data - ${JSON.stringify(ohlcv_data)}
  Audit data - ${JSON.stringify(audit)}
  Market data - ${JSON.stringify(topPool)}`;

  if (tweets.data?.length) {
    dataText += `Tweets by token account - ${JSON.stringify(tweets.data)}`;
  }

  let instructions = `\n\nAnalyze the chart that is formed by the data below and identify the chart pattern, points of resistance and support and where to look for a breakout with a basic trading strategy. Include market info about the top pool and the token audit data in your analysis. Start off with the name of the token and current market data related to the pool, then move onto the audit, then finally the chart analysis.`;

  if (tweets.data?.length) {
    instructions += `Also analyze the recent tweets along with how much engagement they got.`;
  }

  const structuredFormat = structuredClone(tokenInfoFormat);

  if (tweets.data?.length) {
    structuredFormat.engagementData = {
      title: "Engagement Data",
      paragraphs: [
        "Overall engagement over the last few tweets and compare with followers and following",
        "What the recent tweets have been about",
        "Anything extra you might wanna add (optional)",
      ],
    };
  }

  const structure = `\n\nThe output data shouold be in the following format: ${JSON.stringify(structuredFormat)}`; //prettier-ignore

  const prompt = `${dataText} ${instructions} ${structure}\n. The overall tone should be monotonous and something that'd fit a terminal vibe with monospace font. Try making long paragraphs while still keeping it relevant. The ascii art should a bunch of \\ | / () [] {} with max substring of 5-6 characters. ALWAYS HAVE THE JSON DATA BE RETURNED IN A JSON CODE CELL.`;

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

export async function getTokenMetadata(mintAddress: string) {
  const metaplex = Metaplex.make(solanaConnection);

  // Create PublicKey object for the mint address
  const mintPublicKey = new PublicKey(mintAddress);

  // Fetch the metadata
  const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });
  const output = { metadata: nft.json, website: "" };

  return output;
}
