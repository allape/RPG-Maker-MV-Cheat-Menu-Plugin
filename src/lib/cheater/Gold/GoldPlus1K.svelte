<script lang="ts">
	import Gold from './Gold.svelte';
</script>

<Gold amount={1000} title="Gain 1K; {$$props.title}" {...$$props}>
	Gold
	<br>
	+1K
</Gold>
