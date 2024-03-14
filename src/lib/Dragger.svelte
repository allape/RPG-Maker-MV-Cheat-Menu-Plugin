<script lang="ts">
	import DraggerIcon from '../assets/images/dragger.svg';

	export let MovableElement: HTMLDivElement;

	let dragger: HTMLDivElement;
	let moving = false;

	let x = 0;
	let y = 0;

	function handleMouseDown(e: MouseEvent) {
		moving = true;
		x = e.clientX;
		y = e.clientY;
	}

	function handleMouseUp() {
		moving = false;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!MovableElement || !moving || !dragger) return;

		const newX = MovableElement.offsetLeft + e.clientX - x;
		const newY = MovableElement.offsetTop + e.clientY - y;
		MovableElement.style.left = `${newX <= 0 ? 0 : newX}px`;
		MovableElement.style.top = `${newY <= 0 ? 0 : newY}px`;
		x = e.clientX;
		y = e.clientY;
	}
</script>

<style lang="scss">
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: nowrap;
		width: 100%;
    cursor: move;
		user-select: none;
		border: 1px dashed #fff;
		&:hover {
			border-style: solid;
		}
		.dragger {
			width: 40px;
			height: 40px;
			pointer-events: none;
			img {
				width: 100%;
				height: 100%;
        object-fit: contain;
			}
		}
	}
</style>

<svelte:window on:mouseup={handleMouseUp} />
<svelte:body on:mousemove={handleMouseMove} />

<div role="none" class="wrapper" on:mousedown={handleMouseDown} bind:this={dragger}>
	<div class="dragger">
		<img src={DraggerIcon} alt="Dragger" />
	</div>
</div>
