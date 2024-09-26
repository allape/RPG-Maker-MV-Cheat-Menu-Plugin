<script lang="ts">
	import { onMount } from 'svelte';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';

	// export let value: string = '';
	export let script: Script = '';

	const maker = getRPGMaker();

	function make(): Script {
		return maker.getScriptGenerator().openDevTools();
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

<button on:click={run}>Open Dev Tools</button>
