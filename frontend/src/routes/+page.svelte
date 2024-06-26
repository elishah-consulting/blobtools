<script lang="ts">
  /**
   * This is the splash page for the application.
   * It is the first page that users see when they visit the site.
   */

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
  import D2Loading from '$lib/components/D2Loading.svelte';
  import type { BlobscanTransaction } from '../types/BlobscanTransaction.js';
  import D2Hyperlink from '$lib/components/D2Hyperlink.svelte';

  // namespace
  // b64: AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM=
  // hex: 0000000000000000000000000000000000000042690c204d39600fddd3

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
  let blobscanTransaction: BlobscanTransaction;
  let blobs: Blob[] = [];
  let gasPrice = 0;
  let usdEthPrice: number;
  let usdTiaPrice: number;

  let uploadState: string = 'idle';

  $: {
    batch;
    ethtransaction;
    blobscanTransaction;
    blobs;
    uploadState;
    gasPrice;
    usdEthPrice = !gasPrice ? 0 : gasPrice * 3000;
    usdTiaPrice = 0.028 * 9;
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

    const { blobscanTransaction, error: getBlobscanTransactionErr } =
      await blobService.getTransactionByHash(batch?.commitTxHash);
    if (getBlobscanTransactionErr) {
      console.error(getBlobscanTransactionErr);
    }

    console.log(blobscanTransaction);

    gasPrice =
      (parseInt(blobscanTransaction?.blobGasUsed || '0') *
        parseInt(blobscanTransaction?.block?.blobGasPrice || '0')) /
      Math.pow(10, 18);

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
  <title>{PUBLIC_PRODUCT_NAME} - EIP-4844 Blob migrator</title>
</svelte:head>

<!-- Splash section -->
<section class="bg-base-200 min-h-screen w-full p-4 pt-24 flex justify-center">
  <div class="flex-1 w-full max-w-5xl flex flex-col gap-10">
    <section class="w-full">
      <div class="w-full grid gap-4">
        <div class="p-4 rounded-md w-full bg-base-100">
          <div class="text-gray-400 uppercase text-xs mb-2">
            About <span class="font-mono">Blob.tools</span>
          </div>
          <div class="text-sm">
            <p>
              Blob.Tools is the ultimate frictionless UI/UX application designed to streamline blob
              migration paths to Celestia and facilitate initial backup syncs with their original
              Data Availability solution. Leveraging EIP-4844, Blob.Tools targets ZKSync Era's
              Blobs, offering a seamless, user-friendly experience.
            </p>

            <p>
              Simply enter the batch number into the URL query, and you're set. For example,
              accessing batch #470000 is as easy as navigating to
              <D2Hyperlink href="https://blob.tools/?b=470000"
                >https://blob.tools/?b=470000</D2Hyperlink
              >. Our robust backend system automatically extracts the blob from ZKSync ERA's
              EIP-4844, submits it to Celestia, and calculates the price differences—effortlessly
              providing you with the data you need.
            </p>
          </div>
        </div>
      </div>
    </section>
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
                    {#if !blobs?.length}
                      {#each { length: 3 } as _, i}
                        <tr>
                          <td><D2Loading /></td>
                          <td><D2Loading /></td>
                          <td><D2Loading /></td>
                        </tr>
                      {/each}
                    {:else}
                      {#each blobs as blob, i}
                        <tr>
                          <td class="max-w-20 overflow-clip truncate ...">{blob?.proof}</td>
                          <td>{blob?.size}</td>
                          <td>{blob?.transactions?.length}</td>
                        </tr>
                      {/each}
                    {/if}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section class="w-full flex flex-col gap-4 p-4 rounded-md bg-base-100">
          <D2FieldDisplay title="Number of blobs" value={blobs?.length || 0} />
          <div class="grid lg:grid-cols-2 gap-4">
            <D2FieldDisplay title="Namespace" value={'AAAAAAAAAAAAAAAAAAAAAAAAAEJpDCBNOWAP3dM='} />
            <a
              class="btn btn-success"
              href="https://mocha-4.celenium.io/namespace/00000000000000000000000000000000000042690c204d39600fddd3?tab=Blobs"
            >
              View uploaded blobs</a
            >
          </div>
          <button
            class={twMerge('btn', uploadState === 'uploaded' ? 'btn-success' : 'btn-primary')}
            disabled={!blobs?.length}
            on:click={() => uploadBlobs()}
          >
            {uploadState === 'uploading'
              ? 'Uploading blobs...'
              : uploadState === 'uploaded'
                ? 'Blobs uploaded successfully!'
                : 'Upload blobs to Celestia to save cost'}
          </button>
        </section>
      </div>
    </section>

    <section class="w-full">
      <h3>Pricing</h3>

      <div class="w-full grid lg:grid-cols-2 gap-4">
        <div class="p-4 rounded-md w-full bg-base-100 col-span-2">
          Potential cost savings uploading blob to Celestia VS Ethereum: <span
            class="text-green-500">USD {usdEthPrice - usdTiaPrice}</span
          >
        </div>

        <div class="w-full grid gap-4 lg:grid-cols-2 col-span-2">
          <div class="w-full">
            <div class="p-4 rounded-md w-full bg-base-100">
              <progress
                class="progress progress-accent w-56"
                value={(usdTiaPrice / (usdEthPrice + 0.001)) * 100}
                max="100"
              ></progress>

              <D2FieldDisplay title="Gas utilised on Celestia (TIA)" value={`0.028 TIA`} />
              <D2FieldDisplay
                title="Gas utilised on Celestia (USD estimate)"
                value={`${usdTiaPrice} USD`}
              />
            </div>
          </div>

          <div class="w-full">
            <div class="p-4 rounded-md w-full bg-base-100">
              <progress class="progress progress-accent w-56" value="100" max="100"></progress>

              <D2FieldDisplay
                title="Gas utilised on Ethereum (ETH)"
                value={!gasPrice ? undefined : `${gasPrice} ETH`}
              />
              <D2FieldDisplay
                title="Gas utilised on Ethereum (USD estimate)"
                value={`${usdEthPrice} USD`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</section>
