<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FlatRow from './FlatRow.svelte';

	const dispatch = createEventDispatcher();

	export let list: string[] = [];
	export let value: string | undefined = undefined;
	export let keyword: string = '';
	export let placeholder: string | undefined = undefined;

	let renderedList: string[] = [];

	$: {
		const lowedKeyword = keyword.toLowerCase();
		renderedList = list.filter(item => item?.toLowerCase().includes(lowedKeyword));
	}

	const handleChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		dispatch('change', target?.value);
	};
</script>

<input placeholder={placeholder} type="text" bind:value={keyword} />
<FlatRow>
	<select bind:value={value} on:change={handleChange}>
		{#each renderedList as item}
			<option value={item}>{item}</option>
		{/each}
	</select>
	<slot></slot>
</FlatRow>
