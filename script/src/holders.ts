import { PublicKey } from "@solana/web3.js";
import { solanaConnection } from "./rpc/config";
import { apiFetcher } from "./utils/api";
import { PairData } from "./types";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { errorHandler } from "./utils/handlers";

const excludeAddresses = [
  "E7fyKjYFsS3GpBpb3mSKovBeT661V7FUUREwmXe3c2oW",
  "JAkKaAewS4H3DtuzJTw5ByXePLwM9rLsxyyLeijHPj2S",
  "7wpMByCzm2yuUUHKx7U82onAJ19zEAhBgdZSdKXwDbmz",
  "7XQTjoWYofESnmVdqBiUdEiFFKrKF8ocnT5o61jVY64Y",
  "H6H4RUWge2zoHUDdSn9v7HtBWxaLTa47wCPkfL2tnfJs",
  "4PcijK8MX36XNgJfKkVa1XCYH5awtoHs9QQVVu6agSNu",
  "5m8jdViuDt18PD9RdCj3e2brSTgzTFyhNdyaRrmxJhLW",
  "3RDaDhepvfiARbYEQ9nUMQNdjVYVDNbohZsWokh9ZRGu",
  "2TDyKyovE4TNtdQvWJQ3RjU6aYFZudyrSUq3CBbErALm",
  "9zoBhKzqLkmEqjP3qHKBZYp1rKNdCL4wkrDEnoaVZB9f",
  "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
];

export async function getTopHolders(tokenMintAddress: string) {
  try {
    const mintPublicKey = new PublicKey(tokenMintAddress);

    // Get all token accounts for the specified mint address
    const tokenAccounts = await solanaConnection.getTokenLargestAccounts(
      mintPublicKey
    );

    // The `value` array contains the largest accounts holding the token
    const largestAccounts = tokenAccounts.value;

    const holderInfo = await Promise.all(
      largestAccounts.map(async (account, index) => {
        const accountInfo = await solanaConnection.getParsedAccountInfo(
          account.address
        );

        // @ts-expect-error weird
        const owner = accountInfo.value?.data.parsed.info.owner as string;
        // const portfolioValue = await getAddressPortfolio(owner);
        return {
          rank: index + 1,
          owner,
          amount: account.amount,
          portfolioValue: 0,
        };
      })
    );

    return holderInfo;
  } catch (error) {
    errorHandler(error);
  }
}

export async function getAddressPortfolio(address: string) {
  const tokenAccounts = await solanaConnection.getParsedTokenAccountsByOwner(
    new PublicKey(address),
    { programId: TOKEN_PROGRAM_ID }
  );

  const tokens = tokenAccounts.value.map(({ pubkey, account }) => {
    const info = account.data.parsed.info;
    const tokenAddress = pubkey.toBase58();
    const mint = info.mint;
    const amount = info.tokenAmount.uiAmount;
    const decimals = info.tokenAmount.decimals;

    return { tokenAddress, mint, amount, decimals };
  });

  let portfolioValue = 0;
  await Promise.all(
    tokens.map(async (token) => {
      if (token.amount <= 0) return;

      const tokenData = await apiFetcher<PairData>(
        `https://api.dexscreener.com/latest/dex/tokens/${token.mint}`
      );

      const price = Number(tokenData?.data.pairs?.at(0)?.priceUsd || 0);
      const valueUsd = token.amount * price;
      portfolioValue += valueUsd;
    })
  );

  return portfolioValue;
}
