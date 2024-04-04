<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="party" type="hp" to="half" title="Make all teammates HP half" {...$$props}>
	Team
	<br>
	<span style:color="orange">HP / 2</span>
</HMTP>
