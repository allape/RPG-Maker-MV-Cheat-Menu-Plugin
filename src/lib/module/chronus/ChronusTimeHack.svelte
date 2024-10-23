<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../../config/event';
	import { getRPGMaker } from '../../../rpgmaker';
	import type { Script } from '../../../rpgmaker/declare';
	import FormItemWithButton from '../../ui/FormItemWithButton.svelte';
	import { DefaultValue, type IChronusTimeHackValue } from '../DefaultValue';

	interface Props {
		value?: ReturnType<IChronusTimeHackValue['ChronusTimeHack']>;
		script?: Script;
	}

	let { value = $bindable(DefaultValue.ChronusTimeHack()), script = $bindable('') }: Props = $props();

	const maker = getRPGMaker();

	function make() {
		script = `$gameSystem.chronus().addTime(${value});`;
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
	<input placeholder="In minutes" type="number" step="60" bind:value={value}>
	{#snippet button()}
		<span>{value < 0 ? '-' : '+'}</span>
	{/snippet}
</FormItemWithButton>
