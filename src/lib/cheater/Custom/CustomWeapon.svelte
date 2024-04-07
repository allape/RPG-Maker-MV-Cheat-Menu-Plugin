<script lang="ts">
	import CustomItem from './CustomItem.svelte';

	export let name: string = 'Weap';
</script>

<CustomItem title="Weapon" bind:name={name} {...$$props} />
