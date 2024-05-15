<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  export let title: string;
  export let value: string | number;

  const dispatch = createEventDispatcher();

  let combinedClass: string = '';
  $: combinedClass = twMerge('', $$restProps?.class);
</script>

<div class={combinedClass}>
  <div class="text-gray-400 uppercase text-xs">{title}</div>
  <div class="truncate ...">
    {value}
  </div>
</div>
