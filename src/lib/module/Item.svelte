<script lang="ts">
	import MV from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import SearchableSelect from '../ui/SearchableSelect.svelte';

	interface IValue {
		type: 'item' | 'weapon' | 'armor';
		index: string;
		value: string;
		amount: number;
	}

	export let id: string = '';
	export let value: IValue = {
		type: 'item',
		index: '',
		value: '',
		amount: 1
	};

	let partyField: keyof Pick<ReturnType<typeof MV.get$gameParty>, '_items' | '_weapons' | '_armors'> = '_items';
	let listField: keyof Pick<typeof MV, 'get$dataItems' | 'get$dataWeapons' | 'get$dataArmors'> = 'get$dataItems';
	let list: string[] = MV[listField]().map((i, ii) => `${ii}: ${i?.name}`);

	$: {
		switch (value.type) {
			case 'weapon':
				partyField = '_weapons';
				listField = 'get$dataWeapons';
				break;
			case 'armor':
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

	function getter(value: string): string {
		return `${MV.get$gameParty()[partyField][list.indexOf(value)] || 0}`;
	}

	function handleSearch(keyword: string, value: string): boolean {
		return getter(value).includes(keyword);
	}

	export function handleEval() {
		const index = list.indexOf(value.value);
		if (index === -1) {
			return;
		}
		const oldValue = MV.get$gameParty()[partyField][index] || 0;
		MV.get$gameParty().gainItem(MV[listField]()[index], value.amount - oldValue);
		MV.playSound(true);
	}
</script>

<DeepTrigger {id} func={handleEval} />

<select bind:value={value.type}>
	<option value="item">Item</option>
	<option value="weapon">Weapon</option>
	<option value="armor">Armor</option>
</select>
<SearchableSelect {list} {getter} filter={handleSearch}
									placeholder="Search for name or value"
									displayValuePlaceholder="amount"
									bind:value={value.value} />
<FormItemWithButton on:click={handleEval}>
	<input placeholder="Target value" type="text" bind:value={value.amount}>
	<span slot="button">Set</span>
</FormItemWithButton>
