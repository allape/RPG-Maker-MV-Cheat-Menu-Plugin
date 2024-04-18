<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="party" type="hp" to="full" title="Make all teammates HP full; {$$props.title}" {...$$props}>
	Team
	<br>
	HP MAX
</HMTP>
