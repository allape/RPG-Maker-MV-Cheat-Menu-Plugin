<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="enemy" type="hp" to="1" title="Make all enemis HP be 1" {...$$props}>
	Enemy
	<br>
	HP <span style:color="orangered">1</span>
</HMTP>
