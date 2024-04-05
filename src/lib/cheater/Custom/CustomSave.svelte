<script lang="ts">
	import MV from '../../../core/mv';
	import Custom from './Custom.svelte';

	export let name: string = 'Save';
	export let value: string = '';

	export const handleEval = () => {
		if (value) {
			DataManager.saveGame(parseInt(value));
			MV.playSound(true);
		} else {
			MV.playSound(false);
		}
	};
</script>

<Custom func={handleEval} editing={$$props.editing} bind:name={name}>
	<input placeholder="Save slot index" type="number" bind:value={value}>
</Custom>
