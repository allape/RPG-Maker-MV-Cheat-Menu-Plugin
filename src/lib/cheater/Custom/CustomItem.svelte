<script lang="ts">
	import MV from '../../../core/mv';
	import SearchableSelect from '../../ui/SearchableSelect.svelte';
	import Custom from './Custom.svelte';

	export let name: string = 'Item';
	export let value: { name: string, amount: number } = { name: '', amount: 0 };
	export let itemType: 'Item' | 'Weapon' | 'Armor' = 'Item';

	let partyField: keyof Pick<ReturnType<typeof MV.get$gameParty>, '_items' | '_weapons' | '_armors'> = '_items';
	let listField: keyof Pick<typeof MV, 'get$dataItems' | 'get$dataWeapons' | 'get$dataArmors'> = 'get$dataItems';
	let list: string[] = MV[listField]().map((i, ii) => `${ii}: ${i?.name}`);

	$: {
		switch (itemType) {
			case 'Weapon':
				partyField = '_weapons';
				listField = 'get$dataWeapons';
				break;
			case 'Armor':
				partyField = '_armors';
				listField = 'get$dataArmors';
				break;
			default:
				partyField = '_items';
				listField = 'get$dataItems';
				break;
		}
		list = MV[listField]().map((i, ii) => `${ii}: ${i?.name}`);
	}

	let itemName: string = value.name;
	let amount: number = value.amount;

	const handleEval = () => {
		const index = list.indexOf(itemName);
		if (index === -1) {
			return;
		}
		const oldValue = MV.get$gameParty()[partyField][index] || 0;
		MV.get$gameParty().gainItem(MV[listField]()[index], amount - oldValue);
		MV.playSound(true);
	};

	const handleChange = (e: CustomEvent<string>) => {
		amount = MV.get$gameParty()[partyField][list.indexOf(e.detail)] || 0;
	};

	$: {
		value = {
			name: itemName,
			amount
		};
	}
</script>

<Custom func={handleEval} bind:name={name} editing={$$props.editing} title={$$props.title}>
	<SearchableSelect placeholder="Search for {itemType.toLowerCase()}" list={list} bind:value={itemName}
										on:change={handleChange} />
	<input bind:value={amount} type="number" placeholder="amount" />
</Custom>
