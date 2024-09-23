<script lang="ts">
	import { onMount } from 'svelte';
	import { EvalEvent, EvalEventName } from '../../config/event';

	interface Window {
		addEventListener(type: typeof EvalEventName, listener: (e: EvalEvent) => void): void;

		removeEventListener(type: typeof EvalEventName, listener: (e: EvalEvent) => void): void;
	}

	export let id: string;
	export let func: () => void;

	function handle(e: EvalEvent) {
		if (e.id === id) {
			func();
		}
	}

	onMount(() => {
		(window as Window).addEventListener(EvalEventName, handle);
		return () => {
			(window as Window).removeEventListener(EvalEventName, handle);
		};
	});
</script>

<slot></slot>
