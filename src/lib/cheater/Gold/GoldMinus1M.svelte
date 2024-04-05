<script lang="ts">
	import Gold from './Gold.svelte';
</script>

<Gold amount={-1_000_000} title="Giveaway one million" {...$$props}>
	Gold
	<br>
	<span style:color="red">-1M</span>
</Gold>
