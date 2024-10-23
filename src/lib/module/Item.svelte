<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { IItem, ItemType, Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import SearchableSelect from '../ui/SearchableSelect.svelte';

	interface IValue {
		type: ItemType;
		item: string;
		amount: number;
	}

	interface Props {
		value?: IValue;
		script?: Script;
	}

	let {
		value = $bindable({
			type: 'item',
			item: '',
			amount: 1
		}),
		script = $bindable('')
	}: Props = $props();

	const maker = getRPGMaker();

	function itemList2StringList(items: IItem[]) {
		return items.map(i => `${i.id}: ${i.name}`);
	}

	let itemList: IItem[] = $state([]);
	let list: string[] = $state([]);

	function renderItemList() {
		itemList = maker.getItemList(value.type);
		list = itemList2StringList(itemList);
	}

	function make(): Script {
		const item = itemList[list.indexOf(value.item)];
		if (!item) {
			return '';
		}
		script = maker.getScriptGenerator().gainItem(value.type, item, value.amount);
		return script;
	}

	function run(): void {
		maker.evaluate(make());
		renderItemList();
	}

	$effect(() => {
		itemList = maker.getItemList(value.type);
		list = itemList2StringList(itemList);
	});

	function getter(value: string): string {
		return `${itemList[list.indexOf(value)]?.amount || 0}`;
	}

	function handleSearch(keyword: string, value: string): boolean {
		return getter(value).includes(keyword);
	}

	onMount(() => {
		window.addEventListener(MakeScriptEventName, make);
		return () => {
			window.removeEventListener(MakeScriptEventName, make);
			make();
		};
	});
</script>

<select bind:value={value.type}>
	<option value="item">Item</option>
	<option value="weapon">Weapon</option>
	<option value="armor">Armor</option>
</select>
<SearchableSelect {list} {getter} filter={handleSearch}
									placeholder="Search for name or value"
									displayValuePlaceholder="amount"
									bind:value={value.item} />
<FormItemWithButton onclick={run}>
	<input placeholder="Target value" type="text" bind:value={value.amount}>
	{#snippet button()}
		<span>Set</span>
	{/snippet}
</FormItemWithButton>
