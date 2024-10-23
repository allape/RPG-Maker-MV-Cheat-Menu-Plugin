<script lang="ts">
	import type { IPreset, ITrigger } from './app';
	import Button from './lib/ui/Button.svelte';

	interface Props {
		selectedPreset: IPreset | undefined;
		onedit: () => void;
		onrun: (trigger: ITrigger) => void;
	}

	let { selectedPreset, onedit, onrun, ...rest }: Props = $props();

	function handleRun(trigger: ITrigger) {
		onrun?.(trigger);
	}
</script>

<style lang="scss">
  .wrapper {

    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: column;
    text-align: center;
    width: 60px;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;

    .triggers {
      display: flex;
      justify-content: center;
      align-items: stretch;
      flex-direction: column;

      .trigger {
        cursor: pointer;
        border: 1px solid white;
        opacity: 0.5;
        overflow: hidden;
        white-space: pre-wrap;
        user-select: none;
        text-align: center;
        padding: 3px;

        &:hover {
          opacity: 0.8;
        }

        &:active {
          opacity: 1;
        }
      }
    }
  }
</style>

<div class="wrapper" {...rest}>
	<Button onclick={onedit}>Edit</Button>
	<div class="triggers">
		{#if selectedPreset}
			{#each selectedPreset.triggers as trigger (trigger.id)}
				<div role="none" class="trigger" id={trigger.id} onclick={() => handleRun(trigger)}
						 title={trigger.hotKey ? `Press [${trigger.hotKey}] to trigger` : undefined}>
					{#if trigger.hotKey}
						<span>[{trigger.hotKey}]</span>
					{/if}
					<span contenteditable="false" bind:innerHTML={trigger.name}></span>
				</div>
			{/each}
		{/if}
	</div>
</div>
