<script lang="ts">
	import MV from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';

	export let id: string = '';

	export function handleEval() {
		try {
			new Function('require(\'nw.gui\').Window.get().showDevTools()')();
			MV.playSound(true);
		} catch (e) {
			MV.playSound(false);
		}
	}
</script>

<DeepTrigger {id} func={handleEval} />

<button on:click={handleEval}>Open Dev Tools</button>
