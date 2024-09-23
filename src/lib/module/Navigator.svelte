<script lang="ts">
	import { onMount } from 'svelte';
	import MV from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';
	import FlatRow from '../ui/FlatRow.svelte';
	import FormItemWithButton from '../ui/FormItemWithButton.svelte';
	import MapSelector from '../ui/MapSelector.svelte';

	type MapIndex = number;
	type X = number;
	type Y = number;

	interface IValue {
		mapId: MapIndex;
		x: X;
		y: Y;
	}

	export let id: string = '';
	export let value: IValue = {
		mapId: -1,
		x: 0,
		y: 0
	};

	export let current: IValue = value;

	export const handleEval = () => {
		const gamePlayer = MV.get$gamePlayer();
		gamePlayer.reserveTransfer(value.mapId, value.x, value.y, gamePlayer.direction(), 0);
		gamePlayer.setPosition(value.x, value.y);
	};

	function handleReload() {
		const actor = MV.get$gamePlayer();
		current = {
			mapId: MV.get$gameMap()?.mapId() || 0,
			x: actor?.x || 0,
			y: actor?.y || 0
		};
	}

	function handleApply() {
		value = current;
	}

	onMount(() => {
		handleReload();
	});
</script>

<DeepTrigger {id} func={handleEval} />

Current: <br>
<FlatRow>
	<input placeholder="X" type="number" readonly value={current.x} />
	<input placeholder="Y" type="number" readonly value={current.y} />
</FlatRow>
<FormItemWithButton on:click={handleReload}>
	<MapSelector value={current.mapId} readonly />
	<span slot="button">🔄</span>
</FormItemWithButton>
Destination:
<button on:click={handleApply}>↓</button> <br>
<FlatRow>
	<input placeholder="X" type="number" min="0" step="1" bind:value={value.x} />
	<input placeholder="Y" type="number" min="0" step="1" bind:value={value.y} />
</FlatRow>
<FormItemWithButton on:click={handleEval}>
	<MapSelector bind:value={value.mapId} />
	<span slot="button">GO</span>
</FormItemWithButton>
