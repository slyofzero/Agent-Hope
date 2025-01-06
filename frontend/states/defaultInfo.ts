import { ITokenInfo } from "@/types/info";
import { Pair } from "@/types/pair";
import { atom, useAtom } from "jotai";

export interface ITokenInfoAtom {
  tokenData: Pair;
  tokenInfo: ITokenInfo;
}

// const defaultInfo: ITokenInfoAtom = {
//   tokenData: {
//     chainId: "solana",
//     dexId: "raydium",
//     url: "https://dexscreener.com/solana/3vgitgsfn35h7hzatxde71tp9mvrxjbdgltp4tsmnwm6",
//     pairAddress: "3vgitGsFN35H7hzaTxdE71TP9mvrxjBdgLtp4TsmNWm6",
//     baseToken: {
//       address: "7rJp1KhptfCXd6K46bQzaGRYYUboyPE1u6fzEYBKffZB",
//       name: "arXiv",
//       symbol: "arXiv",
//     },
//     quoteToken: {
//       address: "So11111111111111111111111111111111111111112",
//       name: "Wrapped SOL",
//       symbol: "SOL",
//     },
//     priceNative: "0.00005063",
//     priceUsd: "0.01091",
//     txns: {
//       m5: { buys: 9, sells: 32 },
//       h1: { buys: 284, sells: 330 },
//       h6: { buys: 1988, sells: 1988 },
//       h24: { buys: 7935, sells: 7879 },
//     },
//     volume: { h24: 6551022.49, h6: 1388928.67, h1: 169150.8, m5: 12281.26 },
//     priceChange: { m5: 3.26, h1: 8.33, h6: 7.21, h24: -24.96 },
//     liquidity: { usd: 642634.63, base: 29423916, quote: 1490.9382 },
//     fdv: 10915239,
//     marketCap: 10915239,
//     pairCreatedAt: 1731857522000,
//     info: {
//       imageUrl:
//         "https://dd.dexscreener.com/ds-data/tokens/solana/7rJp1KhptfCXd6K46bQzaGRYYUboyPE1u6fzEYBKffZB.png?key=dc41b4",
//       header:
//         "https://dd.dexscreener.com/ds-data/tokens/solana/7rJp1KhptfCXd6K46bQzaGRYYUboyPE1u6fzEYBKffZB/header.png?key=dc41b4",
//       openGraph:
//         "https://cdn.dexscreener.com/token-images/og/solana/7rJp1KhptfCXd6K46bQzaGRYYUboyPE1u6fzEYBKffZB?timestamp=1736151600000",
//       websites: [
//         { label: "Website", url: "https://www.arxiv.sh/" },
//         { label: "Docs", url: "https://arxiv.org/" },
//       ],
//       socials: [
//         { type: "twitter", url: "https://x.com/arxiv_sh" },
//         { type: "telegram", url: "https://t.me/arxiv_terminal" },
//       ],
//     },
//   },
//   tokenInfo: {
//     tokenData: {
//       title: "Token Data",
//       paragraphs: [
//         "The arXiv token appears to be an innovative product-based token, described as a cornerstone for open knowledge and aiming to realize the vision of decentralized science (DeSci). The connection to the famous arXiv repository suggests a focus on scholarly communication and the promotion of accessible scientific research.",
//         "The token's website, as mentioned, corresponds to arXiv.org, an extensive archive for research papers in physics, mathematics, computer science, quantitative biology, quantitative finance, statistics, electrical engineering and systems science, and economics.",
//       ],
//     },
//     marketData: {
//       title: "Market Data",
//       paragraphs: [
//         " ____             _            _  \n/  __|_ _  _ _  _| |_ ___ _ __/ \\\n\\__ \\ '_|| ' \\|  _| -_| '_ \\ \\ /\n|___/_|  |_|_|\\__|___|_|_|_\\_\\_/\n",
//         "arXiv, trading under the symbol 'arXiv' on the solana blockchain, is paired with Wrapped SOL (SOL) in its top pool on the Raydium decentralized exchange. Its current price is approximately $0.01097, with a fully diluted valuation of $10,967,532. Notably, the token has a 24-hour price change of -24.2%, reflecting recent volatility in the market. Additionally, the pool shows a hefty reserve of $644,426.33 USD, ensuring liquidity for potential large transactions.",
//         "Given the significant volume of transactions, both buying and selling, coupled with the volatility in price, the arXiv token seems to be of considerable interest to traders, possibly for short-term speculative activities.",
//       ],
//     },
//     auditData: {
//       title: "Audit Data",
//       paragraphs: [
//         "The audit data for arXiv provides reassuring indicators of its security and integrity. Crucially, the contract has been verified and is noted to be a standard non-honeypot token with no signs of airdrop phishing scams. The lack of delegated ownership and immutable status enhance trust in its governance framework.",
//         "An interesting aspect is the complete burning of the liquidity pair supply which is reflected as 100% burned. This action indicates mechanisms taken to potentially stabilize the token and secure its market.",
//         "   _   _   \n  | |_| | \n  |  _/ _|\n  |_| |_|\n",
//       ],
//       bulletPoints: [
//         "Token supply of 1 billion units.",
//         "Contract verified and standard type.",
//         "Immutability and no honeypot existence.",
//         "100% LP supply burned indicating stability.",
//       ],
//     },
//     chartData: {
//       title: "Chart Data",
//       paragraphs: [
//         "Recent data for arXiv reveals oscillations in the token's price with open and close values varying notably between time intervals. Significant spikes in volume, such as the 201,827 at timestamp 1736109000, suggest periods of intense trading activity.",
//         "The chart pattern reveals a potential head and shoulders formation, indicating a likelihood of a reversal pattern. In this case, it could signal a drop following the right shoulder completion.",
//         "Key resistance levels appear around 0.0165 and support zones at approximately 0.0100, which could indicate where bullish or bearish moves become evident.",
//         "A basic trading strategy might involve reading short-term momentum and looking for breakout signals above the resistance or below the support, adjusting positions based on the overall market sentiment.",
//       ],
//       bulletPoints: [
//         "Head and shoulders pattern detected",
//         "Resistance solidifying near 0.0165",
//         "Support noticeable around 0.0100",
//         "Large volumes observed indicate potential entry/exit points",
//       ],
//     },
//     engagementData: {},
//   },
// };

const defaultTokenInfoAtom = atom<ITokenInfoAtom | null>(null);

export function useDefaultTokenInfoAtom() {
  const [defaultTokenInfo, setDefaultTokenInfo] = useAtom(defaultTokenInfoAtom);
  return { defaultTokenInfo, setDefaultTokenInfo };
}
