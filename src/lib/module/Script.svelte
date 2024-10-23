<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { Script } from '../../rpgmaker/declare';

	interface Props {
		value?: string;
		script?: Script;
	}

	let { value = $bindable(`alert('Hello World!');`), script = $bindable('') }: Props = $props();

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

    button {
      flex: 1;
    }
  }
</style>

<div class="wrapper">
	<textarea placeholder="Put code here" rows="5" bind:value={value}></textarea>
	<button onclick={run}>Run</button>
</div>

