<script lang="ts">
	import MV from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';

	export let id: string = '';
	export let value: string = '2';

	export function handleEval() {
		if (value) {
			MV.getDataManager().saveGame(parseInt(value));
			MV.playSound(true);
		} else {
			MV.playSound(false);
		}
	}
</script>

<DeepTrigger {id} func={handleEval} />

<FormItemWithButton on:click={handleEval}>
	<input placeholder="Slot index" type="number" bind:value={value}>
	<span slot="button">Save Now</span>
</FormItemWithButton>
