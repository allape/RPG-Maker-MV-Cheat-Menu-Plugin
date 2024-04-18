<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="party" type="tp" to="1" title="Make all teammates TP be 1; {$$props.title}" {...$$props}>
	Team
	<br>
	TP <span style:color="orangered">1</span>
</HMTP>
