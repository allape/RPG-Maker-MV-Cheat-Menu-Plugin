<script lang="ts">
	import { onMount } from 'svelte';
	import { getRPGMaker } from '../../rpgmaker';
	import type { IActor } from '../../rpgmaker/declare';

	export let type: 'alias' | 'enemy' = 'alias';

	export let all: boolean = false;
	export let alive: boolean = false;

	export let value: number = 0;
	export let actors: IActor[] = [];

	let label: string = '';

	$: {
		label = type === 'alias' ? 'Alias' : 'Enemy';
	}

	onMount(() => {
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
		<slot name="alive">
			<option value={-2}>Alive {label}s</option>
		</slot>
	{/if}
	{#if all}
		<slot name="all">
			<option value={-1}>All {label}s</option>
		</slot>
	{/if}
	{#each actors as actor (actor.id)}
		<option value={actor.id}>{actor.id}: {actor.name || '-'}</option>
	{/each}
</select>
