export interface Tx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export interface EtherscanTx {
  status: "0" | "1";
  message: string;
  result: Tx[];
}

export interface SwapTxnData {
  txHash: string;
  tokenIn: any;
  tokenOut: any;
  amountIn: string;
  amountOut: string;
  action: string;
  timestamp: number;
}
