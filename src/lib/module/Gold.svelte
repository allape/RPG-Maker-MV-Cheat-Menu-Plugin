<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';

	export let value: number = 0;
	export let script: Script = '';

	const maker = getRPGMaker();

	function make() {
		script = maker.getScriptGenerator().gainGold(value);
		return script;
	}

	function run() {
		maker.evaluate(make());
	}

	onMount(() => {
		window.addEventListener(MakeScriptEventName, make);
		return () => {
			window.removeEventListener(MakeScriptEventName, make);
			make();
		};
	});
</script>


<FormItemWithButton on:click={run}>
	<input placeholder="Gold! The Gold!!!" type="number" step="1" bind:value={value}>
	<span slot="button">{value < 0 ? '-' : '+'}</span>
</FormItemWithButton>
