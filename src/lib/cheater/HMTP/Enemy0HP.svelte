<script>
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="enemy" type="hp" to="0" title="Make all enemies HP be 0; {$$props.title}" {...$$props}>
	<span style:color="red">Enemy</span>
	<br>
	HP <span style:color="red">0</span>
</HMTP>
