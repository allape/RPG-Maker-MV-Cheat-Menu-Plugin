<script lang="ts">
	import FlatRow from './FlatRow.svelte';

	export let list: string[] = [];
	export let value: string | undefined = undefined;
	export let keyword: string = '';
	export let placeholder: string | undefined = undefined;

	let renderedList: string[] = [];

	$: {
		const lowedKeyword = keyword.toLowerCase();
		renderedList = list.filter(item => item?.toLowerCase().includes(lowedKeyword));
	}
</script>

<input placeholder={placeholder} type="text" bind:value={keyword} />
<FlatRow>
	<select bind:value={value}>
		{#each renderedList as item}
			<option value={item}>{item}</option>
		{/each}
	</select>
	<slot></slot>
</FlatRow>
