<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';

	export let value: number = 0;
	export let script: Script = '';

	const maker = getRPGMaker();

	function make(): Script {
		script = maker.getScriptGenerator().speedHack(value * 60);
		return script;
	}

	function run(): void {
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
	<input type="range" min="0" max="3" step="1" bind:value={value}>
	<span slot="button">Hack</span>
</FormItemWithButton>
