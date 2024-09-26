<script lang="ts">
	import { onMount } from 'svelte';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';

	export let value: number = 0;
	export let script: Script = '';

	const maker = getRPGMaker();

	function make() {
		return maker.getScriptGenerator().gainGold(value);
	}

	function run() {
		maker.evaluate(make());
	}

	onMount(() => {
		return () => {
			script = make();
		};
	});
</script>


<FormItemWithButton on:click={run}>
	<input placeholder="Gold! The Gold!!!" type="number" step="1" bind:value={value}>
	<span slot="button">{value < 0 ? '-' : '+'}</span>
</FormItemWithButton>
