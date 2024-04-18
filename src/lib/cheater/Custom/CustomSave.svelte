<script lang="ts">
	import MV from '../../../core/mv';
	import Custom from './Custom.svelte';

	export let name: string = 'Save';
	export let value: string = '';

	export const handleEval = () => {
		if (value) {
			MV.getDataManager().saveGame(parseInt(value));
			MV.playSound(true);
		} else {
			MV.playSound(false);
		}
	};
</script>

<Custom func={handleEval} bind:name={name} editing={$$props.editing} title={$$props.title}>
	<input placeholder="Save slot index" type="number" bind:value={value}>
</Custom>
