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

	export let value: IValue = {
		type: 'item',
		item: '',
		amount: 1
	};
	export let script: Script = '';

	const maker = getRPGMaker();

	function itemList2StringList(items: IItem[]) {
		return items.map(i => `${i.id}: ${i.name}`);
	}

	let itemList: IItem[] = maker.getItemList(value.type);
	let list: string[] = itemList2StringList(itemList);

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
	}

	$: {
		switch (value.type) {
			case 'weapon':
				itemList = maker.getItemList('weapon');
				break;
			case 'armor':
				itemList = maker.getItemList('armor');
				break;
			default:
				itemList = maker.getItemList('item');
		}
		list = itemList2StringList(itemList);
	}

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
<FormItemWithButton on:click={run}>
	<input placeholder="Target value" type="text" bind:value={value.amount}>
	<span slot="button">Set</span>
</FormItemWithButton>
