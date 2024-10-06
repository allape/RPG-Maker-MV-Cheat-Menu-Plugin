<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	interface $$Props extends Partial<SvelteHTMLElements['div']> {
		title?: string;
		timeout?: number;
	}

	const dispatch = createEventDispatcher<Record<'timeout', void>>();

	export let title: Exclude<$$Props['title'], undefined> = '';
	export let timeout: Exclude<$$Props['timeout'], undefined> = 3000;

	$: {
		title = `Hover for ${timeout / 1000}s or click this to trigger`;
	}

	let triggered: boolean = false;
	let timer: number;

	let countdown: number = 0;

	function trigger() {
		triggered = true;
		dispatch('timeout');
		clearTimeout(timer);
		countdown = 0;
	}

	function tick() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			countdown -= 1000;
			if (countdown <= 0) {
				trigger();
			} else {
				tick();
			}
		}, 1000);
	}

	function handleMouseEnter() {
		if (triggered) {
			return;
		}
		countdown = timeout;
		tick();
	}

	function handleMouseLeave() {
		triggered = false;
		clearTimeout(timer);
		countdown = 0;
	}

	onMount(() => {
		return () => {
			clearTimeout(timer);
		};
	});
</script>

<style lang="scss">
  .wrapper {
    display: inline-block;
    position: relative;

    .countdown {
      user-select: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: progress;
    }
  }
</style>

<div role="none" class="wrapper" {title} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}
		 on:click={trigger}
		 {...$$restProps}>
	<slot></slot>
	{#if countdown > 0}
		<div class="countdown">{(countdown / 1000).toFixed(0)}</div>
	{/if}
</div>
