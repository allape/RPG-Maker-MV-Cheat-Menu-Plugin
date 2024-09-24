<script lang="ts">
	import MV from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import { TimerRef } from './timer';

	export let id: string = '';
	export let value: number = 0;

	export function handleEval() {
		clearTimeout(TimerRef.current);
		let frameCount = value * 50;
		if (!frameCount) {
			return;
		}
		TimerRef.current = setTimeout(() => {
			MV.getSceneManager().updateScene();
			handleEval();
		}, 1000 / frameCount);
	}
</script>

<DeepTrigger {id} func={handleEval} />

<FormItemWithButton on:click={handleEval}>
	<input type="range" min="0" max="5" step="1" bind:value={value}>
	<span slot="button">Hack</span>
</FormItemWithButton>
