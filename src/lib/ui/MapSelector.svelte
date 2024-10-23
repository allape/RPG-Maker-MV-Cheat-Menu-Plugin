<script lang="ts">
	import { getRPGMaker } from '../../rpgmaker';
	import type { IMap } from '../../rpgmaker/declare';

	interface Props {
		value?: IMap['id'];
		readonly?: boolean;
		maps?: IMap[];
	}

	let { value = $bindable(-1), readonly = false, maps = getRPGMaker().getMapList() }: Props = $props();
</script>

<select bind:value={value} disabled={readonly}>
	{#each maps as map (map.id)}
		<option value={map.id}>{map.id}: {map.name || '-'}</option>
	{/each}
</select>
