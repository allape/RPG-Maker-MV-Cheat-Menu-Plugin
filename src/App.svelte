<script lang="ts">
  import Dragger from './lib/Dragger.svelte';

	let MovableElement: HTMLDivElement;
</script>

<style lang="scss">
  .wrapper {
		position: fixed;
		top: 20px;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		width: 60px;
	}
</style>

<div class="wrapper" bind:this={MovableElement}>
	<Dragger MovableElement={MovableElement} />
</div>
