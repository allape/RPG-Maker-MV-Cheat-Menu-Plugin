<script lang="ts">
	import DeepTrigger from '../ui/DeepTrigger.svelte';

	export let id: string = '';
	export let value: string = `alert('Hello World!');`;

	export function handleEval() {
		new Function(`${value || 'return undefined;'}`)();
	}
</script>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;

    button, textarea {
      flex: 1;
    }
  }
</style>

<DeepTrigger {id} func={handleEval} />

<div class="wrapper">
	<textarea placeholder="Put code here" rows="5" bind:value={value}></textarea>
	<button on:click={handleEval}>Run</button>
</div>

