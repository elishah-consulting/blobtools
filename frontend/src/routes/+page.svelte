<script lang="ts">
  /**
   * This is the splash page for the application.
   * It is the first page that users see when they visit the site.
   */

  import Typewriter from 'typewriter-effect/dist/core';
  import { PUBLIC_PRODUCT_NAME } from '$env/static/public';
  import { onMount } from 'svelte';
  import { ZksyncService } from '$lib/services/zksync_service.js';
  import type { Batch } from '../types/Batch.js';
  import D2FieldDisplay from '$lib/components/D2FieldDisplay.svelte';
  import { formatDateTime, hexToBase64 } from '$lib/utils.js';
  import { EthscanService } from '$lib/services/ethscan_service.js';
  import type { EthTransaction } from '../types/EthTransaction.js';
  import type { Blob } from '../types/Blob.js';
  import { BlobService } from '$lib/services/blob_service.js';
  import { CelestiaService } from '$lib/services/celestia_service.js';
  import { twMerge } from 'tailwind-merge';

  export let data;
  const { is_splash } = data;

  const ethApiKey = 'KUKPK5GCU87CGBY7K6VK9S4TS4675JA49J';
  const zksyncService = new ZksyncService();
  const ethscanService = new EthscanService(ethApiKey);
  const blobService = new BlobService();
  const celestiaService = new CelestiaService(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJwdWJsaWMiLCJyZWFkIiwid3JpdGUiLCJhZG1pbiJdfQ.UTrjfJnlVahLF6BYLjqk9hmPWwDta8oJLtMzEPrfQsA',
  );

  let batchId = data?.b || '';
  let batch: Batch;
  let ethtransaction: EthTransaction;
  let blobs: Blob[] = [];

  let uploadState: string = 'idle';

  $: {
    batch;
    ethtransaction;
    blobs;
    uploadState;
  }

  onMount(async () => {
    const { batch: currBatch, error } = await zksyncService.getOneBatch(batchId);
    if (error) {
      console.error(error);
    }

    batch = currBatch;
    const { transaction: ethTransaction, error: getEthTransactionErr } =
      await ethscanService.getTransactionByHash(batch?.commitTxHash);
    if (getEthTransactionErr) {
      console.error(getEthTransactionErr);
    }

    console.log('----------------');
    console.log('calling');
    console.log(ethTransaction);
    console.log('----------------');

    blobs = await Promise.all(
      ethTransaction?.result?.blobVersionedHashes.map(async (blobHash) => {
        const { blob, error: getBlobErr } = await blobService.getBlobByHash(blobHash);
        if (getBlobErr) {
          console.error(getBlobErr);
        }

        return blob;
      }) || [],
    );
  });

  const uploadBlobs = async () => {
    uploadState = 'uploading';
    const namespace = 'AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM=';
    for (const blob of blobs) {
      if (blob?.data) {
        const blobDataB64 = hexToBase64(blob?.data);
        const { response, error } = await celestiaService.uploadData(namespace, blobDataB64);
        if (error) {
          console.error(error);
        }
        console.log(response);
      }
    }
    uploadState = 'uploaded';
  };
</script>

<svelte:head>
  <title>{PUBLIC_PRODUCT_NAME} - Get your app up on the second day.</title>
</svelte:head>

<!-- Splash section -->
<section class="bg-base-200 min-h-screen w-full p-4 pt-24 flex justify-center">
  <div class="flex-1 w-full max-w-5xl flex flex-col gap-10">
    <section class="w-full flex flex-col gap-4">
      <h3>Batch details</h3>

      <div class="w-full grid lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-md w-full bg-base-100">
          <h5>Overview</h5>
          <div class="h-fit w-full grid gap-4 grid-cols-2">
            <D2FieldDisplay title="Batch number" value={batch?.number} class="col-span-2" />
            <D2FieldDisplay title="Commit Txn hash" value={batch?.commitTxHash} />
            <D2FieldDisplay title="Committed at" value={formatDateTime(batch?.committedAt)} />
          </div>
        </div>

        <div class="p-4 rounded-md w-full bg-base-100">
          <h5>Price</h5>
          <div class="h-fit w-full grid gap-4 grid-cols-2">
            <D2FieldDisplay title="L1 Txn count" value={batch?.l1TxCount} />
            <D2FieldDisplay title="L1 Gas price" value={batch?.l1GasPrice} />
            <D2FieldDisplay title="L2 Txn count" value={batch?.l2TxCount} />
            <D2FieldDisplay title="L2 Gas price" value={batch?.l2FairGasPrice} />
          </div>
        </div>

        <div class="p-4 rounded-md w-full bg-base-100">
          <h5>Other details</h5>
          <div class="h-fit w-full grid gap-4 grid-cols-2">
            <D2FieldDisplay title="Proof hash" value={batch?.proveTxHash} />
            <D2FieldDisplay title="Proven at" value={formatDateTime(batch?.provenAt)} />
            <D2FieldDisplay title="Execute Txn hash" value={batch?.provenAt} />
            <D2FieldDisplay title="Size" value={`${batch?.size}`} />
          </div>
        </div>
      </div>
    </section>

    <section class="w-full">
      <h3>Blobs</h3>

      <div class="grid lg:grid-cols-2 gap-4">
        <section class="w-full flex flex-col gap-4 h-full">
          <div class="w-full gap-4 h-full">
            <div class="p-4 rounded-md w-full bg-base-100 h-full">
              <h5>Overview</h5>
              <div class="h-fit w-full">
                <table class="table table-xs">
                  <thead>
                    <tr>
                      <th class="max-w-24 overflow-clip truncate ...">Proof</th>
                      <th>Size</th>
                      <th>Num. Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each blobs as blob, i}
                      <tr>
                        <td class="max-w-20 overflow-clip truncate ...">{blob?.proof}</td>
                        <td>{blob?.size}</td>
                        <td>{blob?.transactions?.length}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section class="w-full flex flex-col gap-4 p-4 rounded-md bg-base-100">
          <D2FieldDisplay title="Number of blobs" value={blobs?.length || 0} />
          <D2FieldDisplay title="Namespace" value={'AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM'} />
          <button
            class={twMerge('btn', uploadState === 'uploaded' ? 'btn-success' : 'btn-primary')}
            disabled={!blobs?.length}
            on:click={() => uploadBlobs()}
          >
            {uploadState === 'uploading'
              ? 'Uploading blobs...'
              : uploadState === 'uploaded'
                ? 'Blobs uploaded successfully!'
                : 'Upload blobs to Celestia'}
          </button>
        </section>
      </div>
    </section>
  </div>
</section>
