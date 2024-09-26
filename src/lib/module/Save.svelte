<script lang="ts">
	import { onMount } from 'svelte';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';

	export let value: number = 2;
	export let script: Script = '';

	const maker = getRPGMaker();

	function make(): Script {
		return maker.getScriptGenerator().saveGame(Number(value));
	}

	function run(): void {
		maker.evaluate(make());
	}

	onMount(() => {
		return () => {
			script = make();
		};
	});
</script>

<FormItemWithButton on:click={run}>
	<input placeholder="Slot index" min="1" max="99" type="number" bind:value={value}>
	<span slot="button">Save Now</span>
</FormItemWithButton>
