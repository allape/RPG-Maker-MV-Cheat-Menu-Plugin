
<script lang="ts">
	import Gold from './Gold.svelte';
</script>

<Gold amount={-10_000} title="Giveaway 10K" {...$$props}>
	Gold
	<br>
	<span style:color="red">-10K</span>
</Gold>
