import { SwapTxnData } from "@/types";

export const userTxns: {
  [key: string]: (SwapTxnData & { address: string })[];
} = {};
