<script lang="ts">
	import Evaluate from '../Evaluate/Evaluate.svelte';

	export let editing: boolean = false;

	export let name: string = 'EVAL';
	export let value: string = 'alert(`hello world`);';
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

<Evaluate funcString={value} disabled={editing}>
	{#if editing}
		<div class="wrapper">
			<input placeholder="name" type="text" bind:value={name}>
			<textarea rows="10" bind:value={value} placeholder="callable script" />
		</div>
	{:else}
		<span contenteditable="false" bind:innerHTML={name} />
	{/if}
</Evaluate>
