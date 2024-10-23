<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		title?: string;
		timeout?: number;
		children?: import('svelte').Snippet;
		ontimeout?: () => void;
	}

	let { title = $bindable(''), timeout = 3000, children, ontimeout, ...rest }: Props = $props();

	$effect(() => {
		title = `Hover for ${timeout / 1000}s or click this to trigger`;
	});

	let triggered: boolean = false;
	let timer: number;

	let countdown: number = $state(0);

	function trigger() {
		triggered = true;
		ontimeout?.();
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

<div role="none" class="wrapper" {title} onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}
		 onclick={trigger}
		 {...rest}>
	{@render children?.()}
	{#if countdown > 0}
		<div class="countdown">{(countdown / 1000).toFixed(0)}</div>
	{/if}
</div>
