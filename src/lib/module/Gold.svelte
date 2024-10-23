<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';

	interface Props {
		value?: number;
		script?: Script;
	}

	let { value = $bindable(0), script = $bindable('') }: Props = $props();

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


<FormItemWithButton onclick={run}>
	<input placeholder="Gold! The Gold!!!" type="number" step="1" bind:value={value}>
	{#snippet button()}
		<span>{value < 0 ? '-' : '+'}</span>
	{/snippet}
</FormItemWithButton>
