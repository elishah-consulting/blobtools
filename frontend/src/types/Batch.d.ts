export type Batch = {
  number: number;
  timestamp: string;
  rootHash: string;
  executedAt: string;
  l1TxCount: number;
  l2TxCount: number;
  commitTxHash: string;
  committedAt: string;
  proveTxHash: string;
  provenAt: string;
  executeTxHash: string;
  l1GasPrice: string;
  l2FairGasPrice: string;
  size: number;
  status: string;
};
