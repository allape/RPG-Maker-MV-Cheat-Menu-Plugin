<script lang="ts">
	import Evaluate from './Evaluate.svelte';

	export let editing: boolean = false;

	export let name: string = '';
	export let funcString: string = '';
</script>

<style lang="scss">
  .wrapper {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    flex-direction: column;
    min-width: 300px;
  }
</style>

<Evaluate funcString={funcString} disabled={editing}>
	{#if editing}
		<div class="wrapper">
			<input placeholder="name" type="text" bind:value={name}>
			<textarea rows="10" bind:value={funcString} placeholder="callable script" />
		</div>
	{:else}
		<span contenteditable="false" bind:innerHTML={name} />
	{/if}
</Evaluate>
