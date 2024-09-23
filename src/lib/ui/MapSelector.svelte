<script lang="ts">
	import MV from '../../core/mv';

	export let value: number = -1;
	export let readonly: boolean = false;

	export let maps = MV.get$dataMapInfos() || [];
</script>

<select bind:value={value} disabled={readonly}>
	{#each maps as map, index}
		<option value={index}>{index}: {map?.name || '-'}</option>
	{/each}
</select>
