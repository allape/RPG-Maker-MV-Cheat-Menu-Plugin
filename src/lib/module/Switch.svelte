<script lang="ts">
	import MV from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import SearchableSelect from '../ui/SearchableSelect.svelte';

	interface IValue {
		index: string;
		value: boolean;
	}

	export let id: string = '';
	export let value: IValue = {
		index: '',
		value: false
	};

	export let list: string[] = MV.get$dataSystem().switches.map((i, ii) => `${ii}: ${i}`);

	function getter(value: string): string {
		return `${MV.get$gameSwitches().value(list.indexOf(value))}`;
	}

	export function handleEval() {
		const index = list.indexOf(value.index);
		if (index === -1) {
			return;
		}
		MV.get$gameSwitches().setValue(index, value.value);
		MV.playSound(value.value);
	}
</script>

<DeepTrigger {id} func={handleEval} />

<SearchableSelect {list} {getter}
									placeholder="Search for name"
									displayValuePlaceholder="On or off"
									bind:value={value.index} />
<FormItemWithButton on:click={handleEval}>
	<input type="checkbox" bind:value={value.value}>
	<span slot="button">Set</span>
</FormItemWithButton>
