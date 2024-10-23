<script lang="ts">
	import { getRPGMaker } from '../../rpgmaker';
	import type { IActor } from '../../rpgmaker/declare';

	interface Props {
		type?: 'alias' | 'enemy';
		all?: boolean;
		alive?: boolean;
		value?: number;
		actors?: IActor[];
	}

	let {
		type = 'alias',
		all = false,
		alive = false,
		value = $bindable(0),
		actors = $bindable([])
	}: Props = $props();

	let label: string = $state('');

	$effect(() => {
		label = type === 'alias' ? 'Alias' : 'Enemy';
		try {
			if (type === 'alias') {
				actors = getRPGMaker().getAliasList();
			} else {
				actors = getRPGMaker().getEnemyList();
			}
		} catch (e) {
			console.error(e);
		}
	});
</script>

<select bind:value={value}>
	{#if alive}
		<option value={-2}>Alive {label}s</option>
	{/if}
	{#if all}
		<option value={-1}>All {label}s</option>
	{/if}
	{#each actors as actor (actor.id)}
		<option value={actor.id}>{actor.id}: {actor.name || '-'}</option>
	{/each}
</select>
