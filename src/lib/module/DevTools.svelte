<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';

	interface Props {
		script?: Script;
	}

	let { script = $bindable('') }: Props = $props();

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
