<script lang="ts">
	import MV from '../../../core/mv';
	import Evaluate from '../Evaluate/Evaluate.svelte';
	import { TimerRef } from './timer';

	export let editing: boolean = false;
	export let frameCount: number = 0;

	const handleEvaluate = () => {
		clearTimeout(TimerRef.current);
		if (!frameCount) {
			return;
		}
		TimerRef.current = setTimeout(() => {
			MV.getSceneManager().updateScene();
			handleEvaluate();
		}, 1000 / frameCount);
	};
</script>

<Evaluate func={handleEvaluate} disabled={editing} title={$$props.title}>
	<slot>
		Speed
		<br />
		Hack
	</slot>
</Evaluate>
