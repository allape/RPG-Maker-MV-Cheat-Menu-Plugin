<script lang="ts">
	import Custom from './Custom.svelte';

	export let name: string = 'EVAL';
	export let value: string = 'alert(`hello world`);';

	export const handleEval = () => {
		new Function(`${value || 'return undefined;'}`)();
	};
</script>

<Custom func={handleEval} bind:name={name} editing={$$props.editing} title={$$props.title}>
	<textarea style:width="300px" rows="10" bind:value={value} placeholder="callable script" />
</Custom>
