<script lang="ts">
	import MV from '../../../core/mv';
	import Evaluate from '../Evaluate/Evaluate.svelte';

	export let flush: boolean = false;
	export let amount: number = 0;

	const handleEval = () => {
		MV.gainGold(flush ? MV.getGold() : amount);
	};
</script>

<Evaluate title={$$props.title} func={handleEval}><slot>Gold</slot></Evaluate>
