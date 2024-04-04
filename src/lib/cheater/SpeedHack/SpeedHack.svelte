<script lang="ts">
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
			SceneManager.updateScene();
			handleEvaluate();
		}, 1000 / frameCount);
	};
</script>

<Evaluate func={handleEvaluate} disabled={editing}>
	<slot>
		Speed
		<br />
		Hack
	</slot>
</Evaluate>
