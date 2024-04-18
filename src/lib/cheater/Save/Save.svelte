<script lang="ts">
	import MV from '../../../core/mv';
	import Evaluate from '../Evaluate/Evaluate.svelte';

	export let slotIndex: number = 1;

	const handleEvaluate = () => {
		MV.getDataManager().saveGame(slotIndex);
		MV.playSound(true);
	};
</script>
<Evaluate func={handleEvaluate} disabled={$$props.editing} title={$$props.title}>
	<slot>Save</slot>
</Evaluate>
