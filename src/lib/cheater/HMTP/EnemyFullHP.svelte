<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="enemy" type="hp" to="full" title="Make all enemis HP full" {...$$props}>
	<span style:color="red">Enemy</span>
	<br>
	HP MAX
</HMTP>
