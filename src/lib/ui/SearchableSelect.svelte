<script lang="ts">
	interface Props {
		list?: string[];
		value?: string | undefined;
		keyword?: string;
		placeholder?: string | undefined;
		filter?: ((keyword: string, val: string) => boolean) | undefined;
		getter?: ((val: string) => string) | undefined;
		displayedValue?: string;
		displayValuePlaceholder?: string;
		onchange?: (v?: string) => void;
	}

	let {
		list = [],
		value = $bindable(undefined),
		keyword = $bindable(''),
		placeholder = undefined,
		filter = undefined,
		getter = undefined,
		displayedValue = $bindable(''),
		displayValuePlaceholder = '',
		onchange
	}: Props = $props();

	let renderedList: string[] = $state([]);

	$effect(() => {
		const lowedKeyword = keyword.toLowerCase();
		renderedList = list.filter(item => item?.toLowerCase().includes(lowedKeyword) || filter?.(lowedKeyword, item));
		if (getter && value) {
			displayedValue = getter(value);
		}
	});

	function handleChange() {
		onchange?.(value);
	}
</script>

<input placeholder={placeholder} type="text" bind:value={keyword} />
<select bind:value={value} onchange={handleChange}>
	{#each renderedList as item}
		<option value={item}>{item}</option>
	{/each}
</select>
{#if getter}
	<input placeholder={displayValuePlaceholder} readonly type="text" value={displayedValue} />
{/if}
