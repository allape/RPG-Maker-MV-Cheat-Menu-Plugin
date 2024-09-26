<script lang="ts">
	import { onMount } from 'svelte';
	import { getRPGMaker } from '../../rpgmaker';
	import type { IVariable, Script, VariableValue } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import SearchableSelect from '../ui/SearchableSelect.svelte';

	interface IValue {
		index: string;
		value: VariableValue;
	}

	export let value: IValue = {
		index: '',
		value: ''
	};
	export let script: Script = '';

	const maker = getRPGMaker();

	let variableList: IVariable[] = maker.getVariableList();
	let list: string[] = variableList.map(v => `${v.id}: ${v.name}`);

	function make(): Script {
		const v = variableList[list.indexOf(value.index)];
		if (!v) {
			return '';
		}
		return maker.getScriptGenerator().setVariable(v, value.value);
	}

	function getter(value: string): string {
		return `${variableList[list.indexOf(value)]?.value}`;
	}

	function handleSearch(keyword: string, value: string): boolean {
		return getter(value).includes(keyword);
	}

	function run(): void {
		maker.evaluate(make());
	}

	onMount(() => {
		return () => {
			script = make();
		};
	});
</script>

<SearchableSelect {list} {getter} filter={handleSearch}
									placeholder="Search for name or value"
									displayValuePlaceholder="Variable current value"
									bind:value={value.index} />
<FormItemWithButton on:click={run}>
	<input placeholder="Target value" type="text" bind:value={value.value}>
	<span slot="button">Set</span>
</FormItemWithButton>
