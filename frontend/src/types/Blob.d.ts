export interface Blob {
  commitment: string;
  proof: string;
  size: number;
  versionedHash: string;
  data: string;
  dataStorageReferences: {
    blobStorage: string;
    dataReference: string;
  }[];
  transactions: {
    hash: string;
    index: number;
    block: {
      number: number;
    };
    rollup: string;
  }[];
}
