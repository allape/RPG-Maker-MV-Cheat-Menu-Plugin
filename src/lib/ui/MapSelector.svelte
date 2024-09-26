<script lang="ts">
	import { getRPGMaker } from '../../rpgmaker';
	import type { IMap } from '../../rpgmaker/declare';

	export let value: IMap['id'] = -1;
	export let readonly: boolean = false;

	export let maps = getRPGMaker().getMapList();
</script>

<select bind:value={value} disabled={readonly}>
	{#each maps as map (map.id)}
		<option value={map.id}>{map.id}: {map?.name || '-'}</option>
	{/each}
</select>
