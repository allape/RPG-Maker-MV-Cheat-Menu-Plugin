<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface $$Props extends Partial<SvelteHTMLElements['button']> {
	}
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

<div role="none" class="button" on:click {...$$restProps}>
	<slot></slot>
</div>
