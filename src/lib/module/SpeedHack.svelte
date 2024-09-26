<script lang="ts">
	import { onMount } from 'svelte';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';

	export let value: number = 0;
	export let script: Script = '';

	const maker = getRPGMaker();

	function make(): Script {
		return maker.getScriptGenerator().speedHack(value * 60);
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
	<input type="range" min="0" max="3" step="1" bind:value={value}>
	<span slot="button">Hack</span>
</FormItemWithButton>
