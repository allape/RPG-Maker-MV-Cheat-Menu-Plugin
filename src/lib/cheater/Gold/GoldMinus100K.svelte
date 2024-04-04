<script lang="ts">
	import Gold from './Gold.svelte';
</script>

<Gold amount={-100_000} title="Giveaway 100K" {...$$props}>
	Gold
	<br>
	<span style:color="red">-100K</span>
</Gold>
