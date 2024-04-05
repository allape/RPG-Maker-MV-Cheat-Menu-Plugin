<script lang="ts">
	import MV from '../../../core/mv';
	import SearchableSelect from '../../ui/SearchableSelect.svelte';
	import Custom from './Custom.svelte';

	export let name: string = 'Item';
	export let value: string = '';
	export let list: string[] = MV.get$dataItems().map((i, ii) => `${ii}: ${i?.name}`);

	let amount: number = 0;

	const handleEval = () => {
		const index = list.indexOf(value);
		if (index === -1) {
			return;
		}
		const oldValue = MV.get$gameParty()._items[index] || 0;
		MV.get$gameParty().gainItem(MV.get$dataItems()[index], amount - oldValue);
		MV.playSound(true);
	};

	const handleChange = (e: CustomEvent<string>) => {
		amount = MV.get$gameParty()._items[list.indexOf(e.detail)] || 0;
	};
</script>

<Custom func={handleEval} editing={$$props.editing} bind:name={name}>
	<SearchableSelect placeholder="Search for items" list={list} bind:value={value}
										on:change={handleChange} />
	<input bind:value={amount} type="number" placeholder="Item amount" />
</Custom>
