<script lang="ts">
	import { onMount } from 'svelte';
	import MV, { type GameActor } from '../../core/mv';

	export let type: 'party' | 'enemy' = 'party';

	export let all: boolean = false;
	export let alive: boolean = false;

	export let value: number = 0;
	export let actors: GameActor[] = [];

	let label: string = '';

	$: {
		label = type === 'party' ? 'Party' : 'Enemy';
	}

	onMount(() => {
		try {
			if (type === 'party') {
				actors = MV.get$gameParty().allMembers();
			} else {
				actors = MV.get$gameTroop().members();
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
	{#each actors as actor, index (index)}
		<option value={index}>{index}: {actor._name || '-'}</option>
	{/each}
</select>
