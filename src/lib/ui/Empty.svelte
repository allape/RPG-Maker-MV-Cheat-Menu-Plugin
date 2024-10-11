<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface $$Props extends Partial<SvelteHTMLElements['div']> {

	}
</script>

<style lang="scss">
  .wrapper {
    color: lightgray;
    text-align: center;
  }
</style>

<div class="wrapper" style="padding: 4px;" {...$$restProps}>
	<slot>Empty</slot>
</div>
