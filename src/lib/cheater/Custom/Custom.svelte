<script lang="ts">
	import FlatRow from '../../ui/FlatRow.svelte';
	import Evaluate from '../Evaluate/Evaluate.svelte';

	export let editing: boolean = false;

	export let name: string = '';
	export let func: undefined | (() => void) = undefined;
</script>

<style lang="scss">
  .wrapper {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    flex-direction: column;
  }
</style>

<Evaluate func={func} disabled={editing}>
	{#if editing}
		<div class="wrapper">
			<FlatRow>
				<input placeholder="name" type="text" bind:value={name}>
				<button on:click={func}>eval</button>
			</FlatRow>
			<slot></slot>
		</div>
	{:else}
		<span contenteditable="false" bind:innerHTML={name} />
	{/if}
</Evaluate>
