<script lang="ts">
	import Gold from './Gold.svelte';
</script>

<Gold amount={10_000} title="Gain 10K; {$$props.title}" {...$$props}>
	Gold
	<br>
	+10K
</Gold>
