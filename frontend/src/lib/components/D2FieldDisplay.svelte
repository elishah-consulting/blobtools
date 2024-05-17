<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import D2Loading from './D2Loading.svelte';

  export let title: string;
  export let value: string | number;

  const dispatch = createEventDispatcher();

  let combinedClass: string = '';
  $: combinedClass = twMerge('', $$restProps?.class);
</script>

<div class={combinedClass}>
  <div class="text-gray-400 uppercase text-xs">{title}</div>
  <div class="truncate ...">
    {#if !value}
      <D2Loading />
    {:else}
      {value}
    {/if}
  </div>
</div>
