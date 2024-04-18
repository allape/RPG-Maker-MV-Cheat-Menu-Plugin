<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="enemy" type="hp" to="full" title="Make all enemies HP full; {$$props.title}" {...$$props}>
	<span style:color="red">Enemy</span>
	<br>
	HP MAX
</HMTP>
