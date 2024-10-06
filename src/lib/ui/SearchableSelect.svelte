<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let list: string[] = [];
	export let value: string | undefined = undefined;
	export let keyword: string = '';
	export let placeholder: string | undefined = undefined;

	export let filter: ((keyword: string, val: string) => boolean) | undefined = undefined;

	export let getter: ((val: string) => string) | undefined = undefined;
	export let displayedValue = '';
	export let displayValuePlaceholder: string = '';

	let renderedList: string[] = [];

	$: {
		const lowedKeyword = keyword.toLowerCase();
		renderedList = list.filter(item => item?.toLowerCase().includes(lowedKeyword) || filter?.(lowedKeyword, item));
		if (getter && value) {
			displayedValue = getter(value);
		}
	}

	const handleChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const v = target?.value;
		dispatch('change', v);
		if (getter) {
			displayedValue = getter(v);
		}
	};
</script>

<input placeholder={placeholder} type="text" bind:value={keyword} />
<select bind:value={value} on:change={handleChange}>
	{#each renderedList as item}
		<option value={item}>{item}</option>
	{/each}
</select>
{#if getter}
	<input placeholder={displayValuePlaceholder} readonly type="text" value={displayedValue} />
{/if}
