<script lang="ts">
	import { onMount } from 'svelte';
	import { AuthorPresets, FunctionKeys, Functions, type IConfig, type IPreset, type ITrigger } from './app';
	import { MakeScriptEvent } from './config/event';
	import Button from './lib/ui/Button.svelte';
	import Empty from './lib/ui/Empty.svelte';
	import KeyBinder from './lib/ui/KeyBinder.svelte';
	import Menu from './Menu.svelte';
	import { getRPGMaker } from './rpgmaker';
	import { id } from './utils/gen';
	import { getJSON } from './utils/store';

	const KEY_CONFIG = 'v2-ascheater-config';

	interface TriggerElement extends HTMLDivElement {
		__asCheaterAnimationTimer: number;
	}

	export let editing = false;

	export let config: IConfig = {
		appearance: {
			idlingOpacityLevel: 2,
			maxIdlingOpacityLevel: 5
		},
		presets: []
	};

	export let fileSelector: HTMLInputElement;

	let exportingDelayTimerId: number;

	let selectedPreset: IPreset | undefined;
	let selectedTrigger: ITrigger | undefined;

	function handleDone() {
		if (exportingDelayTimerId) {
			return;
		}

		exportingDelayTimerId = setTimeout(() => {
			exportingDelayTimerId = 0;
			localStorage.setItem(KEY_CONFIG, JSON.stringify(config));
			editing = false;
			selectedTrigger = undefined;
		}, 200);
	}

	function handleEdit() {
		editing = true;
		if (!selectedPreset || !config.presets.includes(selectedPreset)) {
			selectedPreset = config.presets[0];
		}
		selectedTrigger = selectedPreset?.triggers[0];
	}

	function handleAddPreset() {
		const preset: IPreset = { id: id(), name: 'Preset', triggers: [] };
		config.presets = [
			...config.presets,
			preset
		];
		handleSelectPreset(preset);
	}

	function handleRemovePreset(index: number) {
		const removed = config.presets.splice(index, 1);
		config.presets = [...config.presets];
		if (selectedPreset === removed[0]) {
			handleEdit();
		}
	}

	function handleSelectPreset(preset: IPreset) {
		selectedPreset = preset;
		selectedTrigger = preset.triggers[0];
	}

	function handleAddTrigger() {
		if (!selectedPreset) {
			return;
		}
		// let hotKey = '';
		// if (selectedPreset.triggers.length < 9) {
		// 	hotKey = `${selectedPreset.triggers.length + 1}`;
		// }
		selectedTrigger = { id: id(), name: 'Trigger', hotKey: '', actions: [] };
		selectedPreset.triggers.push(selectedTrigger);
		selectedPreset.triggers = [...selectedPreset.triggers];
	}

	function handleRemoveTrigger(index: number) {
		if (!selectedPreset) {
			return;
		}
		const removed = selectedPreset.triggers.splice(index, 1);
		selectedPreset.triggers = [...selectedPreset.triggers];
		if (selectedTrigger === removed[0]) {
			selectedTrigger = selectedPreset.triggers[0];
		}
	}

	function handleMoveTrigger(from: number, to: number) {
		if (!selectedPreset) {
			return;
		}
		if (to < 0 || to >= selectedPreset.triggers.length) {
			return;
		}
		const temp = selectedPreset.triggers[from];
		selectedPreset.triggers[from] = selectedPreset.triggers[to];
		selectedPreset.triggers[to] = temp;
		selectedPreset.triggers = [...selectedPreset.triggers];
	}

	function handleSelectTrigger(trigger: ITrigger) {
		selectedTrigger = trigger;
	}

	function handleAddAction(functionName: keyof typeof Functions) {
		if (!selectedTrigger) {
			return;
		}

		selectedTrigger.actions = [
			...selectedTrigger.actions,
			{
				id: id(),
				type: functionName,
				value: undefined
			}
		];
	}

	function handleRemoveAction(index: number) {
		if (!selectedTrigger) {
			return;
		}
		selectedTrigger.actions.splice(index, 1);
		selectedTrigger.actions = [...selectedTrigger.actions];
	}

	function handleRun(trigger: ITrigger) {
		trigger.actions.forEach(action => {
			if (!action.script) return;
			getRPGMaker().evaluate(action.script);
		});
	}

	function handleFlushPresetIDs(preset: IPreset): IPreset {
		preset.id = id();
		preset.triggers.forEach(trigger => {
			trigger.id = id();
			trigger.actions.forEach(action => {
				action.id = id();
			});
		});

		return preset;
	}

	function handleAuthorPreset(preset: IPreset) {
		const cloned: IPreset = JSON.parse(JSON.stringify(preset));
		handleFlushPresetIDs(cloned);
		config.presets = [
			...config.presets,
			cloned
		];
		handleSelectPreset(cloned);
	}

	function handleImport() {
		if (!fileSelector) {
			return;
		}
		fileSelector.click();
	}

	function handlePresetFileChange(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
		const file = e.currentTarget.files?.[0];
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const preset = JSON.parse(reader.result as string) as IPreset;
			handleFlushPresetIDs(preset);
			config.presets = [
				...config.presets,
				preset
			];
			handleSelectPreset(preset);
		};
		reader.readAsText(file);
	}

	function handleExport() {
		if (exportingDelayTimerId) {
			return;
		}
		window.dispatchEvent(new MakeScriptEvent());
		exportingDelayTimerId = setTimeout(() => {
			exportingDelayTimerId = 0;
			if (!selectedPreset) {
				return;
			}
			const preset = JSON.stringify(selectedPreset);
			const blob = new Blob([preset], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${selectedPreset.name}.json`;
			a.click();
			URL.revokeObjectURL(url);
		}, 300);
	}

	// region Hooks

	onMount(() => {
		const savedConfig = getJSON(KEY_CONFIG, config, val => typeof val === 'object');

		// essential value check
		if (!savedConfig.appearance) {
			savedConfig.appearance = config.appearance;
		}
		if (!savedConfig.presets) {
			savedConfig.presets = config.presets;
		}

		config = savedConfig;

		selectedPreset = config.presets[0];
	});

	onMount(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			if (!selectedPreset || editing) {
				return;
			}
			selectedPreset?.triggers.filter(t => t.hotKey === e.key).forEach(trigger => {
				handleRun(trigger);
				const triggerEle = document.getElementById(trigger.id) as TriggerElement;
				if (triggerEle) {
					clearTimeout(triggerEle.__asCheaterAnimationTimer);
					triggerEle.style.opacity = '1';
					triggerEle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
					triggerEle.__asCheaterAnimationTimer = setTimeout(() => {
						if (triggerEle) {
							triggerEle.removeAttribute('style');
						}
					}, 150);
				}
			});
		};

		window.addEventListener('keydown', handleKeyUp, true);
		return () => {
			window.removeEventListener('keydown', handleKeyUp, true);
		};
	});

	// endregion

	// region External Functions

	// noinspection JSUnusedGlobalSymbols
	export function getConfig(): IConfig {
		return config;
	}

	// endregion

</script>

<style lang="scss">
  .wrapper {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    //border: 1px solid white;
    color: white;

    &:hover {
      opacity: 1 !important;
    }

    .editPage {
      .table {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        border: 1px solid white;
        width: 800px;
        height: 400px;

        .section {
          flex: 1;
          border: 1px solid white;
          overflow-x: hidden;
          overflow-y: auto;

          .title {
            text-align: center;
            user-select: none;
            border-bottom: 1px solid white;
            display: flex;
            justify-content: center;
            align-items: center;

            .text {
              flex: 1;
            }
          }

          .list {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;

            .item {
              flex: 1;
              margin-bottom: 10px;
              display: flex;
              flex-direction: column;
            }
          }

          .none {
            color: lightgray;
            text-align: center;
          }

          &.presetSection {
            .authorPresets {
              .item {
                margin-bottom: 0;
              }
            }

            .savedPresetList {
              margin-top: 10px;

              .item {
                opacity: 0.5;

                &.selected {
                  opacity: 1;
                }

                .row {
                  display: flex;
                  flex-wrap: nowrap;

                  input {
                    width: 100%;
                  }

                  button {
                    flex: 1;
                  }
                }
              }
            }
          }

          &.triggerSection {
            .list {
              .item {
                opacity: 0.5;

                &.selected {
                  opacity: 1;
                }

                .row {
                  display: flex;
                  flex-wrap: nowrap;

                  input {
                    width: 100%;
                  }

                  button {
                    flex: 1;
                  }
                }
              }
            }
          }

          &.actionSection {
            .list {
              .item {
                .title {
                  border-top: 1px solid white;
                }
              }
            }
          }

          &.functionSection {
            .list {
              .item {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                border-bottom: 1px solid white;
                margin-bottom: 0;

                .name {
                  flex: 1;
                  padding: 0 5px;
                }
              }
            }
          }
        }
      }

      .otherSettings {
        padding: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .setting {
          flex: 1;
          display: flex;
          align-items: center;

          button:not(:first-child) {
            margin-left: 10px;
          }
        }
      }

      .versions {
        margin: -5px 0 10px;
        padding: 0 10px;
        text-align: right;
        user-select: text !important;
      }
    }
  }
</style>

<div class="wrapper" style:opacity="{config.appearance.idlingOpacityLevel / config.appearance.maxIdlingOpacityLevel}">
	{#if editing}
		<div class="editPage">
			<Button on:click={handleDone}>Done</Button>
			<div class="table">
				<div class="section presetSection">
					<div class="title">Formulas</div>
					<div class="list authorPresets">
						{#each AuthorPresets as preset, index (index)}
							<div class="item">
								<div class="title">
									<div class="text">{preset.name}</div>
									<button on:click={() => handleAuthorPreset(preset)}>↓</button>
								</div>
							</div>
						{/each}
					</div>
					<div class="list savedPresetList">
						{#each config.presets as preset, index (preset.id)}
							<div role="none" class="item" class:selected={preset === selectedPreset}
									 on:click={() => handleSelectPreset(preset)}>
								<div class="row">
									<input type="text" placeholder="Name" bind:value={preset.name}>
									<button on:click={() => handleRemovePreset(index)}>-</button>
								</div>
							</div>
						{:else}
							<Empty style="padding-bottom: 10px">Empty</Empty>
						{/each}
					</div>
					<Button on:click={handleAddPreset}>+</Button>
				</div>
				<div class="section triggerSection">
					<div class="title">Triggers</div>
					{#if selectedPreset}
						<div class="list">
							{#each selectedPreset.triggers as trigger, index (trigger.id)}
								<div role="none" class="item" class:selected={trigger === selectedTrigger}
										 on:click={() => handleSelectTrigger(trigger)}>
									<textarea rows="3" placeholder="HTML supported" bind:value={trigger.name}></textarea>
									<div class="row">
										<button disabled={index === 0} on:click={() => handleMoveTrigger(index, 0)}>⤒</button>
										<button disabled={index === 0} on:click={() => handleMoveTrigger(index, index-1)}>↑</button>
										<button on:click={() => handleRemoveTrigger(index)}>-</button>
										<button disabled={index === selectedPreset.triggers.length-1}
														on:click={() => handleMoveTrigger(index, index+1)}>↓
										</button>
										<button disabled={index === selectedPreset.triggers.length-1}
														on:click={() => handleMoveTrigger(index, (selectedPreset?.triggers.length||0)-1)}>⤓
										</button>
									</div>
									<KeyBinder bind:key={trigger.hotKey} />
								</div>
							{:else}
								<Empty>Empty</Empty>
							{/each}
						</div>
						<Button on:click={handleAddTrigger}>+</Button>
					{:else}
						<Empty>
							Select or create <br>
							a <b>preset</b>
							first
						</Empty>
					{/if}
				</div>
				<div class="section actionSection">
					<div class="title">Actions</div>
					{#if selectedTrigger}
						<div class="list">
							{#each selectedTrigger.actions as action, index (action.id)}
								<div class="item">
									<div class="title">
										<div class="text">{action.type}</div>
										<button on:click={() => handleRemoveAction(index)}>-</button>
									</div>
									<svelte:component this={Functions[action.type]}
																		bind:value={action.value}
																		bind:script={action.script} />
								</div>
							{:else}
								<Empty>Empty</Empty>
							{/each}
						</div>
					{:else}
						<Empty>
							Select or create <br>
							a <b>trigger</b>
							first
						</Empty>
					{/if}
				</div>
				<div class="section functionSection">
					<div class="title">Functions</div>
					<div class="list">
						{#each FunctionKeys as name}
							<div class="item">
								<div class="name">{name}</div>
								<button disabled={!selectedTrigger} on:click={() => handleAddAction(name)}>←</button>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="otherSettings">
				<div class="setting">
					Opacity:
					<input type="range" min="0" max={config.appearance.maxIdlingOpacityLevel} step="1"
								 bind:value={config.appearance.idlingOpacityLevel}>
				</div>
				<div class="setting" style="justify-content: flex-end;">
					<button on:click={handleImport}>Import</button>
					<button disabled={!selectedPreset} on:click={handleExport}>Export</button>
				</div>
			</div>
			<div class="versions">
				{__APP_VERSION__}, {getRPGMaker().getVersionString()}
			</div>
		</div>
	{:else}
		<Menu {selectedPreset} on:edit={handleEdit} on:run={e => handleRun(e.detail)} />
	{/if}
	<input bind:this={fileSelector} style="display: none;" type="file" accept="application/json"
				 on:change={handlePresetFileChange}>
</div>
