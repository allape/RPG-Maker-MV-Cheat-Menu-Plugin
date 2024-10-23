<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		button?: Snippet;
		onclick?: HTMLButtonElement['onclick'];
	}

	let { children, button, onclick }: Props = $props();
</script>

<style>
    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        width: 100%;

        & > :global(input), & > :global(select) {
            width: 100%;
            align-self: stretch;
        }
    }
</style>

<div class="wrapper">
	{@render children?.()}
	<button onclick={onclick}>
		{#if button}{@render button()}{:else}Click{/if}
	</button>
</div>
