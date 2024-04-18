<script>
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="party" type="tp" to="0" title="Make all teammates TP be 0; {$$props.title}" {...$$props}>
	Team
	<br>
	TP <span style:color="red">0</span>
</HMTP>
