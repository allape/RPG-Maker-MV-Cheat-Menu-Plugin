<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="party" type="tp" to="half" title="Make all teammates TP half" {...$$props}>
	Team
	<br>
	<span style:color="orange">TP / 2</span>
</HMTP>
