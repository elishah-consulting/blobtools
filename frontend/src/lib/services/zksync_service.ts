import {
  wrappedAuthFetch,
  wrappedFetch,
  type WrappedFetchRequest,
  type WrappedFetchResponse,
} from './fetch_helper';
import type { Nullable } from '../../types/Nullable';
import type { User } from '../../types/User';
import type { ServerErrorV2 } from '../../types/ServerErrorV2';
import type { Batch } from '../../types/Batch';

export class ZksyncService {
  private auth_token?: string;

  async getOneBatch(batchId: string): Promise<{ batch: Batch; error: Nullable<ServerErrorV2> }> {
    const request: WrappedFetchRequest = {
      method: 'GET',
      baseURL: 'https://block-explorer-api.mainnet.zksync.io',
      endpoint: `/batches/${batchId}`,
    };

    // Execute fetch
    const { body, error } = await wrappedFetch(request);

    // Return response
    return { batch: body, error };
  }
}
