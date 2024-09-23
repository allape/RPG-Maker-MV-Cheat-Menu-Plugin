<script lang="ts">
	import MV from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import SearchableSelect from '../ui/SearchableSelect.svelte';

	interface IValue {
		index: string;
		value: string;
	}

	export let id: string = '';
	export let value: IValue = {
		index: '',
		value: ''
	};

	export let list: string[] = MV.get$dataSystem().variables.map((i, ii) => `${ii}: ${i}`);

	function getter(value: string): string {
		return `${MV.get$gameVariables().value(list.indexOf(value))}`;
	}

	function handleSearch(keyword: string, value: string): boolean {
		return getter(value).includes(keyword);
	}

	export function handleEval() {
		const index = list.indexOf(value.index);
		if (index === -1) {
			return;
		}
		const oldValue = MV.get$gameVariables().value(index);
		MV.setVariable(index, typeof oldValue === 'number' ? parseInt(value.value || '0') || 0 : value.value);
		MV.playSound(true);
	}
</script>

<DeepTrigger {id} func={handleEval} />

<SearchableSelect {list} {getter} filter={handleSearch}
									placeholder="Search for name or value"
									displayValuePlaceholder="Variable current value"
									bind:value={value.index} />
<FormItemWithButton on:click={handleEval}>
	<input placeholder="Target value" type="text" bind:value={value.value}>
	<span slot="button">Set</span>
</FormItemWithButton>
