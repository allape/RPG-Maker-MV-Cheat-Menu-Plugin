<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children }: SvelteHTMLElements['div'] = $props();
</script>

<style>
    .flat {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        width: 100%;

        & > input, & > select {
            width: 100%;
        }
    }
</style>

<div class="flat">
	{@render children?.()}
</div>
