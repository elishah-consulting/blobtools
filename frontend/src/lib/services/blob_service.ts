import {
  wrappedAuthFetch,
  wrappedFetch,
  type WrappedFetchRequest,
  type WrappedFetchResponse,
} from './fetch_helper';
import type { Nullable } from '../../types/Nullable';
import type { User } from '../../types/User';
import type { Blob } from '../../types/Blob';
import type { ServerErrorV2 } from '../../types/ServerErrorV2';
import type { EthTransaction } from '../../types/EthTransaction';
import type { BlobscanTransaction } from '../../types/BlobscanTransaction';

export class BlobService {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async getBlobByHash(hash: string): Promise<{ blob: Blob; error: Nullable<ServerErrorV2> }> {
    const request: WrappedFetchRequest = {
      method: 'GET',
      baseURL: 'https://api.blobscan.com',
      endpoint: `/blobs/${hash}`,
    };

    // Execute fetch
    const { body, error } = await wrappedFetch(request);

    // Return response
    return { blob: body, error };
  }

  async getTransactionByHash(
    hash: string,
  ): Promise<{ blobscanTransaction: BlobscanTransaction; error: Nullable<ServerErrorV2> }> {
    const request: WrappedFetchRequest = {
      method: 'GET',
      baseURL: 'https://api.blobscan.com',
      endpoint: `/transactions/${hash}`,
    };

    // Execute fetch
    const { body, error } = await wrappedFetch(request);

    // Return response
    return { blobscanTransaction: body, error };
  }
}
