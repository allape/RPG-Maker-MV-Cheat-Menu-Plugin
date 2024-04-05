<script lang="ts">
	import { onMount } from 'svelte';

	export let disabled: boolean = false;
	export let title: string | undefined = undefined;
	export let func: (() => void) | undefined = undefined;

	let thiz: HTMLDivElement | undefined;

	onMount(() => {
		const handleClick = () => {
			if (disabled) {
				return;
			}
			try {
				func?.();
			} catch (e) {
				console.error('eval error:', e);
				alert((e as Error)?.message || e);
			}
		};

		let guarantee = setInterval(() => {
			if (thiz && thiz.parentElement) {
				clearInterval(guarantee);
				thiz.parentElement.addEventListener('click', handleClick, { capture: true });
			}
		}, 100);
		return () => {
			clearInterval(guarantee);
			thiz?.parentElement?.removeEventListener('click', handleClick, { capture: true });
		};
	});
</script>

<style lang="scss">
  .wrapper {
    height: 100%;
    width: 100%;
  }
</style>

<div class="wrapper" bind:this={thiz} role="none" title={title}>
	<slot>Eval</slot>
</div>
