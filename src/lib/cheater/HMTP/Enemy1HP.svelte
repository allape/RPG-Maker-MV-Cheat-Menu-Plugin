<script lang="ts">
	import HMTP from './HMTP.svelte';
</script>

<HMTP target="enemy" type="hp" to="1" title="Make all enemies HP be 1; {$$props.title}" {...$$props}>
	<span style:color="red">Enemy</span>
	<br>
	HP <span style:color="orangered">1</span>
</HMTP>
