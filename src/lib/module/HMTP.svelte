<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { HMTPValue, IActor, Script } from '../../rpgmaker/declare';
	import FlatRow from '../ui/FlatRow.svelte';
	import SpriteSelector from '../ui/SpriteSelector.svelte';
	import { DefaultValue, type IHMTPValue } from './DefaultValue';

	interface Props {
		value?: ReturnType<IHMTPValue['HP|MP|TP']>;
		script?: Script;
	}

	let {
		value = $bindable(DefaultValue['HP|MP|TP']()),
		script = $bindable('')
	}: Props = $props();

	const maker = getRPGMaker();

	function make(): Script {
		let hmtpType: HMTPValue = 'full';
		if (value.valueType === 'custom') {
			hmtpType = value.customValue;
		} else {
			hmtpType = value.valueType;
		}
		let aliveOrActorID: boolean | IActor;
		switch (value.actorId) {
			case -2:
				aliveOrActorID = true;
				break;
			case -1:
				aliveOrActorID = false;
				break;
			default:
				aliveOrActorID = maker.getAliasList().find(alias => alias.id === value.actorId)!;
				if (!aliveOrActorID) {
					return '';
				}
				break;
		}
		script = maker.getScriptGenerator().setHMTP(value.actorType, aliveOrActorID, value.type, hmtpType);
		return script;
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

<select bind:value={value.actorType}>
	<option value="alias">Alias</option>
	<option value="enemy">Enemy</option>
</select>
<SpriteSelector all alive type={value.actorType} bind:value={value.actorId} />
<FlatRow>
	<select bind:value={value.type}>
		<option value="hp">HP</option>
		<option value="mp">MP</option>
		<option value="tp">TP</option>
	</select>
	<select bind:value={value.valueType}>
		<option value="full">Full</option>
		<option value="half">Half</option>
		<option value="1">1</option>
		<option value="0">0</option>
		<option value="custom">Custom</option>
	</select>
</FlatRow>
{#if value.valueType === 'custom'}
	<input type="number" min="0" step="1" bind:value={value.customValue}>
{/if}
<button onclick={run}>Set Now</button>
