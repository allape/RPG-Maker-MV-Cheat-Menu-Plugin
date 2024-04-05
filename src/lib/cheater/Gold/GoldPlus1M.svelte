<script lang="ts">
	import Gold from './Gold.svelte';
</script>

<Gold amount={1_000_000} title="Gain one million" {...$$props}>
	Gold
	<br>
	+1M
</Gold>
