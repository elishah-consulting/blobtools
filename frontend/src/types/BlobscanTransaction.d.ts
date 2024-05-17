export interface BlobscanTransaction {
  hash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string;
  maxFeePerBlobGas: string;
  blobAsCalldataGasUsed: string;
  rollup: string;
  blobs: {
    versionedHash: string;
    index: number;
  }[];
  block: {
    blobGasPrice: string;
  };
  blobAsCalldataGasFee: string;
  blobGasBaseFee: string;
  blobGasMaxFee: string;
  blobGasUsed: string;
}
