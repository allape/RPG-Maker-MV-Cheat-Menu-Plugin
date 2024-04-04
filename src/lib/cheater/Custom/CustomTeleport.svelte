<script lang="ts">
	import MV from '../../../core/mv';
	import Evaluate from '../Evaluate/Evaluate.svelte';

	type MapIndex = number;
	type X = number;
	type Y = number;

	export let editing: boolean = false;

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

	const handleEvaluate = () => {
		const gamePlayer = MV.get$gamePlayer();
		gamePlayer.reserveTransfer(mapId, x, y, gamePlayer.direction(), 0);
		gamePlayer.setPosition(x, y);
	};
</script>

<style lang="scss">
  .wrapper {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    flex-direction: column;
    min-width: 300px;

    .xy {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;

      input {
        flex: 1;
      }
    }
  }
</style>

<Evaluate func={handleEvaluate} disabled={editing}>
	{#if editing}
		<div class="wrapper">
			<input placeholder="name" type="text" bind:value={name}>
			<select bind:value={mapId}>
				{#each maps as map, index}
					<option value={index}>{index}: {map?.name || '-'}</option>
				{/each}
			</select>
			<div class="xy">
				<input placeholder="X" type="number" min="0" step="1" bind:value={x} />
				<input placeholder="Y" type="number" min="0" step="1" bind:value={y} />
			</div>
		</div>
	{:else}
		<span contenteditable="false" bind:innerHTML={name} />
	{/if}
</Evaluate>
