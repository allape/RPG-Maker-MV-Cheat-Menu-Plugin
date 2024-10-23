<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import { DefaultValue, type ISpeedHackValue } from './DefaultValue';

	interface Props {
		value?: ReturnType<ISpeedHackValue['SpeedHack']>;
		script?: Script;
	}

	let {
		value = $bindable(DefaultValue.SpeedHack()),
		script = $bindable('')
	}: Props = $props();

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


<FormItemWithButton onclick={run}>
	<input type="range" min="0" max="3" step="1" bind:value={value}>
	{#snippet button()}
		<span>Hack</span>
	{/snippet}
</FormItemWithButton>
