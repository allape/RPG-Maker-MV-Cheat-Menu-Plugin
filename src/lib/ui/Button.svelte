<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<style lang="scss">
  .button {
    cursor: pointer;
    opacity: 0.7;
    text-align: center;
    border: 1px solid white;
    user-select: none;

    &:hover {
      opacity: 1;
    }
  }
</style>

<div role="none" class="button" {...rest}>
	{@render children?.()}
</div>
