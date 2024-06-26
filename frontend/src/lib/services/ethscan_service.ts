import {
  wrappedAuthFetch,
  wrappedFetch,
  type WrappedFetchRequest,
  type WrappedFetchResponse,
} from './fetch_helper';
import type { Nullable } from '../../types/Nullable';
import type { User } from '../../types/User';
import type { ServerErrorV2 } from '../../types/ServerErrorV2';
import type { EthTransaction } from '../../types/EthTransaction';

export class EthscanService {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async getTransactionByHash(
    hash: string,
  ): Promise<{ transaction: EthTransaction; error: Nullable<ServerErrorV2> }> {
    const request: WrappedFetchRequest = {
      method: 'GET',
      baseURL: 'https://api.etherscan.io',
      endpoint: `/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${this.apiKey}`,
    };

    // Execute fetch
    const { body, error } = await wrappedFetch(request);

    // Return response
    return { transaction: body, error };
  }
}
