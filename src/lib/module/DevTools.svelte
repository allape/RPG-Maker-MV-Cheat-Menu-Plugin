<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';
	import { DefaultValue, type IDevToolsValue } from './DefaultValue';

	interface Props {
		value: ReturnType<IDevToolsValue['DevTools']>;
		script?: Script;
	}

	let { value = $bindable(DefaultValue.DevTools()), script = $bindable('') }: Props = $props();

	const maker = getRPGMaker();

	function make(): Script {
		script = maker.getScriptGenerator().openDevTools();
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

<button onclick={run}>Open Dev Tools</button>
