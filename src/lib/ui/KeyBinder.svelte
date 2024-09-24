<script lang="ts">
	export let key: string = '';

	let binding: boolean = false;

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

<button class="wrapper" class:binding={binding} on:click={handleClick} on:pointerleave={handleCancel}
				on:blur={handleCancel}>
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
