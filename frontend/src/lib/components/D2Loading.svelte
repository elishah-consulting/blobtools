<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  const dispatch = createEventDispatcher();

  export let lines: number = 1;

  let combinedClass: string = '';
  $: combinedClass = twMerge(
    'w-full bg-gray-200 h-2 my-2 rounded-full animate-pulse animate-duration-300',
    $$restProps?.class,
  );
</script>

{#each { length: lines } as _, i}
  <div class={combinedClass} />
{/each}
