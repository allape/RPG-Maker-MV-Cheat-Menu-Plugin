
<script lang="ts">
	import Gold from './Gold.svelte';
</script>

<Gold amount={-1_000} title="Giveaway 1K" {...$$props}>
	Gold
	<br>
	<span style:color="red">-1K</span>
</Gold>
