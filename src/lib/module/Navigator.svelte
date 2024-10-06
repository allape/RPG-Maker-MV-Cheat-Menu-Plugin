<script lang="ts">
	import { onMount } from 'svelte';
	import { MakeScriptEventName } from '../../config/event';
	import { getRPGMaker } from '../../rpgmaker';
	import type { IMap, Script, X, Y } from '../../rpgmaker/declare';
	import FlatRow from '../ui/FlatRow.svelte';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import HoverCountdown from '../ui/HoverCountdown.svelte';
	import MapSelector from '../ui/MapSelector.svelte';

	interface IValue {
		mapId: IMap['id'];
		x: X;
		y: Y;
	}

	export let value: IValue = {
		mapId: -1,
		x: 0,
		y: 0
	};

	export let script: Script = '';

	const maker = getRPGMaker();

	function make(): Script {
		const map = maps.find(i => i.id === value.mapId);
		if (!map) {
			return '';
		}
		script = maker.getScriptGenerator().teleport(map, value.x, value.y);
		return script;
	}

	function run(): void {
		maker.evaluate(make());
	}

	export let current: IValue = value;

	export let maps = maker.getMapList();

	function handleReload() {
		const actor = maker.getHero();
		current = {
			mapId: maker.getCurrentMap()?.id || 0,
			x: actor.x || 0,
			y: actor.y || 0
		};
	}

	function handleApply() {
		value = current;
	}

	onMount(() => {
		handleReload();
	});

	onMount(() => {
		window.addEventListener(MakeScriptEventName, make);
		return () => {
			window.removeEventListener(MakeScriptEventName, make);
			make();
		};
	});
</script>

<FlatRow>
	<div style="flex: 1;">Current:</div>
	<HoverCountdown on:timeout={handleReload}>
		<button>🔄</button>
	</HoverCountdown>
</FlatRow>
<FlatRow>
	<input placeholder="X" type="number" readonly value={current.x} />
	<input placeholder="Y" type="number" readonly value={current.y} />
</FlatRow>
<input placeholder="Map ID" type="text" readonly value={maps.find(i=>i.id === current.mapId)?.name || '-'} />
<FlatRow>
	<div style="flex: 1;">Destination:</div>
	<button on:click={handleApply}>↓</button>
</FlatRow>
<FlatRow>
	<input placeholder="X" type="number" step="1" bind:value={value.x} />
	<input placeholder="Y" type="number" step="1" bind:value={value.y} />
</FlatRow>
<FormItemWithButton on:click={run}>
	<MapSelector bind:value={value.mapId} />
	<span slot="button">GO</span>
</FormItemWithButton>
