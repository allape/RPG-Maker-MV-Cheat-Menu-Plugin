<script lang="ts">
	import { onMount } from 'svelte';
	import DevTools from './lib/module/DevTools.svelte';
	import Gold from './lib/module/Gold.svelte';
	import SpriteHMTP from './lib/module/HMTP.svelte';
	import Item from './lib/module/Item.svelte';
	import Navigator from './lib/module/Navigator.svelte';
	import Save from './lib/module/Save.svelte';
	import ScriptEval from './lib/module/Script.svelte';
	import SpeedHack from './lib/module/SpeedHack.svelte';
	import Switch from './lib/module/Switch.svelte';
	import Variable from './lib/module/Variable.svelte';
	import KeyBinder from './lib/ui/KeyBinder.svelte';
	import PresetJSON from './presets.json';
	import { getRPGMaker } from './rpgmaker';
	import { id } from './utils/gen';
	import { getJSON } from './utils/store';

	const KEY_CONFIG = 'v2-ascheater-config';

	const Functions = {
		Gold,
		'HP|MP|TP': SpriteHMTP,
		Navigator,
		Variable,
		Switch,
		Item,
		Save,
		SpeedHack,
		Script: ScriptEval,

		DevTools
	};
	type FunctionTypes = keyof typeof Functions;

	const FunctionKeys: FunctionTypes[] = Object.keys(Functions) as FunctionTypes[];

	const AuthorPresets: IPreset[] = PresetJSON as IPreset[];

	type HTMLString = string;
	type IDString = string;

	interface IAppearance {
		idlingOpacityLevel: number;
		maxIdlingOpacityLevel: number;
		// focusingOpacity: number;
	}

	interface IAction {
		id: IDString;
		type: FunctionTypes;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any;
		script?: string;
	}

	interface ITrigger {
		id: IDString;
		name: HTMLString;
		hotKey?: string;
		actions: IAction[];
	}

	interface IPreset {
		id: IDString;
		name: string;
		triggers: ITrigger[];
	}

	interface IConfig {
		appearance: IAppearance;
		presets: IPreset[];
	}

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

	let selectedPreset: IPreset | undefined;
	let selectedTrigger: ITrigger | undefined;

	function handleDone() {
		localStorage.setItem(KEY_CONFIG, JSON.stringify(config));
		editing = false;
		selectedTrigger = undefined;
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
		let hotKey = '';
		if (selectedPreset.triggers.length < 9) {
			hotKey = `${selectedPreset.triggers.length + 1}`;
		}
		selectedTrigger = { id: id(), name: 'Trigger', hotKey, actions: [] };
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

    .button {
      cursor: pointer;
      opacity: 0.7;
      text-align: center;
      border: 1px solid white;
      user-select: none;

      &:hover {
        opacity: 1;
      }
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

    .triggerList {
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
  }
</style>

<div class="wrapper" style:opacity="{config.appearance.idlingOpacityLevel / config.appearance.maxIdlingOpacityLevel}">
	{#if editing}
		<div class="editPage">
			<div role="none" class="button" on:click={handleDone}>Done</div>
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
					<!--					<div class="title">Saved</div>-->
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
							<div class="none" style="margin-bottom: 10px;">Empty</div>
						{/each}
					</div>
					<div role="none" class="button" on:click={handleAddPreset}>+</div>
				</div>
				<div class="section triggerSection">
					<div class="title">Triggers</div>
					{#if selectedPreset}
						<div class="list">
							{#each selectedPreset.triggers as trigger, index (trigger.id)}
								<div role="none" class="item" class:selected={trigger === selectedTrigger}
										 on:click={() => handleSelectTrigger(trigger)}>
									<div class="row">
										<input type="text" placeholder="HTML supported" bind:value={trigger.name}>
										<button on:click={() => handleRemoveTrigger(index)}>-</button>
									</div>
									<KeyBinder bind:key={trigger.hotKey} />
								</div>
							{:else}
								<div class="none">Empty</div>
							{/each}
						</div>
						<div role="none" class="button" on:click={handleAddTrigger}>+</div>
					{:else}
						<div class="none">
							Select <br>
							a <b>preset</b> <br>
							first
						</div>
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
								<div class="none">Empty</div>
							{/each}
						</div>
					{:else}
						<div class="none">
							Select <br>
							a <b>trigger</b> <br>
							first
						</div>
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
		<div class="triggerList">
			<div role="none" class="button" on:click={handleEdit}>Edit</div>
			<div class="triggers">
				{#if selectedPreset}
					{#each selectedPreset.triggers as trigger (trigger.id)}
						<div role="none" class="trigger" id={trigger.id} on:click={() => handleRun(trigger)}
								 title={trigger.hotKey ? `Press [${trigger.hotKey}] to trigger` : undefined}>
							{#if trigger.hotKey}
								<span>[{trigger.hotKey}]</span>
							{/if}
							<span contenteditable="false" bind:innerHTML={trigger.name} />
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
	<input bind:this={fileSelector} style="display: none;" type="file" accept="application/json"
				 on:change={handlePresetFileChange}>
</div>
