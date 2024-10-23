<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { ISwitch, Script } from '../../rpgmaker/declare';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import SearchableSelect from '../ui/SearchableSelect.svelte';

	interface IValue {
		index: string;
		value: boolean;
	}

	interface Props {
		value?: IValue;
		script?: Script;
	}

	let {
		value = $bindable({
			index: '',
			value: false
		}),
		script = $bindable('')
	}: Props = $props();

	const maker = getRPGMaker();

	let switchList: ISwitch[] = maker.getSwitchList();
	let list: string[] = switchList.map((i) => `${i.id}: ${i.name}`);

	function make(): Script {
		const swi = switchList[list.indexOf(value.index)];
		if (!swi) {
			return '';
		}
		script = maker.getScriptGenerator().setSwitch(swi, value.value);
		return script;
	}

	function getter(value: string): string {
		return switchList[list.indexOf(value)]?.state ? 'On' : 'Off';
	}

	function run(): void {
		maker.evaluate(make());
	}

	onMount(() => {
		window.addEventListener(MakeScriptEventName, make);
		return () => {
			window.removeEventListener(MakeScriptEventName, make);
			make();
		};
	});
</script>

<SearchableSelect {list} {getter}
									placeholder="Search for name"
									displayValuePlaceholder="On or off"
									bind:value={value.index} />
<FormItemWithButton onclick={run}>
	<input type="checkbox" bind:checked={value.value}>
	{#snippet button()}
		<span>Set</span>
	{/snippet}
</FormItemWithButton>
