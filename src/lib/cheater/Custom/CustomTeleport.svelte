<script lang="ts">
	import MV from '../../../core/mv';
	import FlatRow from '../../ui/FlatRow.svelte';
	import Custom from './Custom.svelte';

	type MapIndex = number;
	type X = number;
	type Y = number;

	export let name: string = 'Move <br /> to p1';
	export let value: [MapIndex, X, Y] = [-1, 0, 0];

	$: mapId = value?.[0] === undefined ? -1 : value[0];
	$: x = value?.[1] || 0;
	$: y = value?.[2] || 0;

	$: {
		if (mapId === -1) {
			mapId = MV.get$gameMap()?.mapId() || 0;
			x = MV.get$gamePlayer()?.x || 0;
			y = MV.get$gamePlayer()?.y || 0;
		}
	}

	let maps = MV.get$dataMapInfos() || [];

	const handleEval = () => {
		const gamePlayer = MV.get$gamePlayer();
		gamePlayer.reserveTransfer(mapId, x, y, gamePlayer.direction(), 0);
		gamePlayer.setPosition(x, y);
	};
</script>

<Custom func={handleEval} editing={$$props.editing} bind:name={name}>
	<select bind:value={mapId}>
		{#each maps as map, index}
			<option value={index}>{index}: {map?.name || '-'}</option>
		{/each}
	</select>
	<FlatRow>
		<input placeholder="X" type="number" min="0" step="1" bind:value={x} />
		<input placeholder="Y" type="number" min="0" step="1" bind:value={y} />
	</FlatRow>
</Custom>
