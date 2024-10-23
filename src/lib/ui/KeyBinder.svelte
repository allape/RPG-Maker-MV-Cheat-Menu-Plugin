<script lang="ts">
	interface Props {
		key?: string;
	}

	let { key = $bindable('') }: Props = $props();

	let binding: boolean = $state(false);

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			key = '';
		} else {
			key = e.key;
		}
		handleCancel();
	}

	function handleClick() {
		handleCancel();
		binding = true;
		window.addEventListener('keyup', handleKeyUp);
	}

	function handleCancel() {
		binding = false;
		window.removeEventListener('keyup', handleKeyUp);
	}

</script>

<style lang="scss">
  .wrapper {
    width: 100%;
    white-space: none;
    text-align: center;

    &.binding {
      cursor: wait;
    }
  }
</style>

<button class="wrapper" class:binding={binding} onclick={handleClick} onpointerleave={handleCancel}
				onblur={handleCancel}>
	{#if binding}
		[Esc] to clear, wait...
	{:else}
		{#if key}
			[{key}]
		{:else}
			Click to bind a key
		{/if}
	{/if}
</button>
