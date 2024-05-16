import { wrappedAuthFetch, type WrappedFetchRequest } from './fetch_helper';
import type { Nullable } from '../../types/Nullable';
import type { ServerErrorV2 } from '../../types/ServerErrorV2';

export class CelestiaService {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async uploadData(
    namespace: string,
    data: string,
  ): Promise<{ response: any; error: Nullable<ServerErrorV2> }> {
    const request: WrappedFetchRequest = {
      method: 'POST',
      baseURL: 'http://167.99.49.178/client',
      endpoint: ``,
      body: {
        jsonrpc: '2.0',
        method: 'blob.Submit',
        id: 1,
        params: [
          [
            {
              namespace,
              data,
              share_version: 0,
              index: -1,
            },
          ],
          0.003,
        ],
      },
    };

    // Execute fetch
    const { body, error } = await wrappedAuthFetch(request, this.apiKey);

    // Return response
    return { response: body, error };
  }
}
