<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';

	export let value: string = `alert('Hello World!');`;
	export let script: Script = '';

	const maker = getRPGMaker();

	function make(): Script {
		script = value;
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

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;

    button, textarea {
      flex: 1;
    }
  }
</style>

<div class="wrapper">
	<textarea placeholder="Put code here" rows="5" bind:value={value}></textarea>
	<button on:click={run}>Run</button>
</div>

