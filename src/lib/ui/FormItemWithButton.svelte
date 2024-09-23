<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}
</script>

<style>
    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        width: 100%;

        & > input, & > select {
            width: 100%;
            align-self: stretch;
        }
    }
</style>

<div class="wrapper">
	<slot></slot>
	<button on:click={handleClick}>
		<slot name="button">Button</slot>
	</button>
</div>
