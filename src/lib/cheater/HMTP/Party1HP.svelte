<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="party" type="hp" to="1" title="Make all teammates HP be 1; {$$props.title}" {...$$props}>
	Team
	<br>
	HP <span style:color="orangered">1</span>
</HMTP>
