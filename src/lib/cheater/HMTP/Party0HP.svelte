<script>
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="party" type="hp" to="0" title="Make all teammates HP be 0; {$$props.title}" {...$$props}>
	Team
	<br>
	HP <span style:color="red">0</span>
</HMTP>
