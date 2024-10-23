<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<style lang="scss">
  .wrapper {
    color: lightgray;
    text-align: center;
  }
</style>

<div class="wrapper" style="padding: 4px;" {...rest}>
	{#if children}{@render children()}{:else}Empty{/if}
</div>
