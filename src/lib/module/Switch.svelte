<script lang="ts">
	import { onMount } from 'svelte';
	import { getRPGMaker } from '../../rpgmaker';
	import type { ISwitch, Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import SearchableSelect from '../ui/SearchableSelect.svelte';

	interface IValue {
		index: string;
		value: boolean;
	}

	export let value: IValue = {
		index: '',
		value: false
	};
	export let script: Script = '';

	const maker = getRPGMaker();

	let switchList: ISwitch[] = maker.getSwitchList();
	let list: string[] = switchList.map((i) => `${i.id}: ${i.name}`);

	function make(): Script {
		const swi = switchList[list.indexOf(value.index)];
		if (!swi) {
			return '';
		}
		return maker.getScriptGenerator().setSwitch(swi, value.value);
	}

	function getter(value: string): string {
		return switchList[list.indexOf(value)]?.state ? 'On' : 'Off';
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

<SearchableSelect {list} {getter}
									placeholder="Search for name"
									displayValuePlaceholder="On or off"
									bind:value={value.index} />
<FormItemWithButton on:click={run}>
	<input type="checkbox" bind:value={value.value}>
	<span slot="button">Set</span>
</FormItemWithButton>
