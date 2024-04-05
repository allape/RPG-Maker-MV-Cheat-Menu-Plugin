<style>
    .flat {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        width: 100%;

        & > input, & > select {
            flex: 1;
        }
    }
</style>

<div class="flat">
	<slot></slot>
</div>
