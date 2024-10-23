<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { IVariable, Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import SearchableSelect from '../ui/SearchableSelect.svelte';
	import { DefaultValue, type IVariableValue } from './DefaultValue';

	interface Props {
		value?: ReturnType<IVariableValue['Variable']>;
		script?: Script;
	}

	let {
		value = $bindable(DefaultValue.Variable()),
		script = $bindable('')
	}: Props = $props();

	const maker = getRPGMaker();

	let variableList: IVariable[] = [];
	let list: string[] = $state([]);

	function renderVariableList() {
		variableList = maker.getVariableList();
		list = variableList.map(v => `${v.id}: ${v.name}`);
	}

	function make(): Script {
		const v = variableList[list.indexOf(value.index)];
		if (!v) {
			return '';
		}
		script = maker.getScriptGenerator().setVariable(v, value.value);
		return script;
	}

	function getter(value: string): string {
		return `${variableList[list.indexOf(value)]?.value}`;
	}

	function handleSearch(keyword: string, value: string): boolean {
		return getter(value).includes(keyword);
	}

	function run(): void {
		maker.evaluate(make());
		renderVariableList();
	}

	onMount(() => {
		renderVariableList();
		window.addEventListener(MakeScriptEventName, make);
		return () => {
			window.removeEventListener(MakeScriptEventName, make);
			make();
		};
	});
</script>

<SearchableSelect {list} {getter} filter={handleSearch}
									placeholder="Search for name or value"
									displayValuePlaceholder="Variable current value"
									bind:value={value.index} />
<FormItemWithButton onclick={run}>
	<input placeholder="Target value" type="text" bind:value={value.value}>
	{#snippet button()}
		<span>Set</span>
	{/snippet}
</FormItemWithButton>
