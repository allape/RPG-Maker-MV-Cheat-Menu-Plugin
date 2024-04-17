<script>
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="enemy" type="hp" to="0" title="Make all enemys HP be 0" {...$$props}>
	Enemy
	<br>
	HP <span style:color="red">0</span>
</HMTP>
