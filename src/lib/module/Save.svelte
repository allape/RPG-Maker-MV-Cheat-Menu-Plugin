<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import { DefaultValue, type ISaveValue } from './DefaultValue';

	interface Props {
		value?: ReturnType<ISaveValue['Save']>;
		script?: Script;
	}

	let {
		value = $bindable(DefaultValue.Save()),
		script = $bindable('')
	}: Props = $props();

	const maker = getRPGMaker();

	function make(): Script {
		script = maker.getScriptGenerator().saveGame(Number(value));
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
	<input placeholder="Slot index" min="1" max="99" type="number" bind:value={value}>
	{#snippet button()}
		<span>Save Now</span>
	{/snippet}
</FormItemWithButton>
