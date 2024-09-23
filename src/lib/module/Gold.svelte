<script lang="ts">
	import MV from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';

	export let id: string = '';
	export let value: number = 0;

	export function handleEval() {
		MV.gainGold(value);
		MV.playSound(value < 0);
	}
</script>

<DeepTrigger {id} func={handleEval} />

<FormItemWithButton on:click={handleEval}>
	<input placeholder="Gold! The Gold!!!" type="number" step="1" bind:value={value}>
	<span slot="button">{value < 0 ? '-' : '+'}</span>
</FormItemWithButton>
