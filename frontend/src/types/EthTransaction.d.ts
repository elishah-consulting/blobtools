export interface EthTransaction {
  jsonrpc: string;
  id: number;
  result: {
    blockHash: string;
    blockNumber: string;
    from: string;
    gas: string;
    gasPrice: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    maxFeePerBlobGas: string;
    hash: string;
    input: string;
    nonce: string;
    to: string;
    transactionIndex: string;
    value: string;
    type: string;
    accessList: string[];
    chainId: string;
    blobVersionedHashes: string[];
    v: string;
    r: string;
    s: string;
    yParity: string;
  };
}
