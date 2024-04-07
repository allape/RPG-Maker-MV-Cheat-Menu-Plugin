<script lang="ts">
	import CustomItem from './CustomItem.svelte';

	export let name: string = 'Armo';
</script>

<CustomItem title="Armor" bind:name={name} {...$$props} />
