import { Request, Response } from "express";
import { getAddressTxns, getSwapData } from "./utils/web3";
import { SwapTxnData } from "./types";
import { userTxns } from "./vars/txns";
import { errorHandler } from "./utils/handlers";

export async function getProfileTxns(req: Request, res: Response) {
  const { username } = req.params;
  const { page = 1, size = 10 } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Missing username" });
  }

  const txns = userTxns[username] || [];
  const totalTxns = txns.length;
  const totalPages = Math.ceil(totalTxns / Number(size));
  const currentPage = Number(page);
  const startIndex = (currentPage - 1) * Number(size);
  const endIndex = startIndex + Number(size);
  const paginatedTxns = txns.slice(startIndex, endIndex);

  res.status(200).json({
    transactions: paginatedTxns,
    currentPage,
    totalPages,
  });
}

export async function addNewWallet(req: Request, res: Response) {
  const { wallet, username } = req.body;

  if (!wallet || !username) {
    return res.status(400).json({ message: "Missing wallet or username" });
  }

  try {
    (async () => {
      const txns = await getAddressTxns(wallet);
      const swaps = (
        await Promise.all(
          txns.map(async (tx) => {
            const swapData = await getSwapData(tx);
            if (swapData) {
              return { ...swapData, address: wallet };
            }
            return false;
          })
        )
      ).filter((tx): tx is SwapTxnData & { address: string } => Boolean(tx));

      if (!userTxns[username]) {
        userTxns[username] = [];
      }

      userTxns[username] = [...userTxns[username], ...swaps].sort(
        (a, b) => b.timestamp - a.timestamp
      );
    })();

    return res
      .status(200)
      .json({ message: "Wallet transactions added successfully" });
  } catch (error) {
    errorHandler(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
