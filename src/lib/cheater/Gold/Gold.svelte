<script lang="ts">
	import MV from '../../../core/mv';
	import Evaluate from '../Evaluate/Evaluate.svelte';

	export let flush: boolean = false;
	export let amount: number = 0;

	let color: 'gold' | 'red' = 'gold';
	if (flush) {
		color = 'red';
	}

	const handleEval = () => {
		MV.gainGold(flush ? MV.getGold() : amount);
		MV.playSound(flush || amount <= 0);
	};
</script>

<Evaluate title={$$props.title} func={handleEval} disabled={$$props.editing}>
	<span style:color={color}>
		<slot>Gold</slot>
	</span>
</Evaluate>
