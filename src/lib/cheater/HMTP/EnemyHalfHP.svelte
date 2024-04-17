<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="enemy" type="hp" to="half" title="Make all enemis HP half" {...$$props}>
	Enemy
	<br>
	<span style:color="orange">HP / 2</span>
</HMTP>
