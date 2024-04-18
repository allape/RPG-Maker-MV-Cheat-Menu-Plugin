<script lang="ts">
	import './style.scss';
	import { onMount } from 'svelte';
	import MV from './core/mv';
	import CustomArmor from './lib/cheater/Custom/CustomArmor.svelte';
	import CustomEvaluate from './lib/cheater/Custom/CustomEvaluate.svelte';
	import CustomItem from './lib/cheater/Custom/CustomItem.svelte';
	import CustomSave from './lib/cheater/Custom/CustomSave.svelte';
	import CustomSwitch from './lib/cheater/Custom/CustomSwitch.svelte';
	import CustomTeleport from './lib/cheater/Custom/CustomTeleport.svelte';
	import CustomVariable from './lib/cheater/Custom/CustomVariable.svelte';
	import CustomWeapon from './lib/cheater/Custom/CustomWeapon.svelte';
	import DevTools from './lib/cheater/DevTools/DevTools.svelte';
	import Gold0 from './lib/cheater/Gold/Gold0.svelte';
	import GoldMinus100K from './lib/cheater/Gold/GoldMinus100K.svelte';
	import GoldMinus10K from './lib/cheater/Gold/GoldMinus10K.svelte';
	import GoldMinus1K from './lib/cheater/Gold/GoldMinus1K.svelte';
	import GoldMinus1M from './lib/cheater/Gold/GoldMinus1M.svelte';
	import GoldPlus100K from './lib/cheater/Gold/GoldPlus100K.svelte';
	import GoldPlus10K from './lib/cheater/Gold/GoldPlus10K.svelte';
	import GoldPlus1K from './lib/cheater/Gold/GoldPlus1K.svelte';
	import GoldPlus1M from './lib/cheater/Gold/GoldPlus1M.svelte';
	import Enemy0HP from './lib/cheater/HMTP/Enemy0HP.svelte';
	import Enemy1HP from './lib/cheater/HMTP/Enemy1HP.svelte';
	import EnemyFullHP from './lib/cheater/HMTP/EnemyFullHP.svelte';
	import EnemyHalfHP from './lib/cheater/HMTP/EnemyHalfHP.svelte';
	import Party0HP from './lib/cheater/HMTP/Party0HP.svelte';
	import Party0MP from './lib/cheater/HMTP/Party0MP.svelte';
	import Party0TP from './lib/cheater/HMTP/Party0TP.svelte';
	import Party1HP from './lib/cheater/HMTP/Party1HP.svelte';
	import Party1MP from './lib/cheater/HMTP/Party1MP.svelte';
	import Party1TP from './lib/cheater/HMTP/Party1TP.svelte';
	import PartyFullHP from './lib/cheater/HMTP/PartyFullHP.svelte';
	import PartyFullMP from './lib/cheater/HMTP/PartyFullMP.svelte';
	import PartyFullTP from './lib/cheater/HMTP/PartyFullTP.svelte';
	import PartyHalfHP from './lib/cheater/HMTP/PartyHalfHP.svelte';
	import PartyHalfMP from './lib/cheater/HMTP/PartyHalfMP.svelte';
	import PartyHalfTP from './lib/cheater/HMTP/PartyHalfTP.svelte';
	import SaveAt1 from './lib/cheater/Save/SaveAt1.svelte';
	import SaveAt10 from './lib/cheater/Save/SaveAt10.svelte';
	import SaveAt2 from './lib/cheater/Save/SaveAt2.svelte';
	import SaveAt20 from './lib/cheater/Save/SaveAt20.svelte';
	import SaveAt3 from './lib/cheater/Save/SaveAt3.svelte';
	import SaveAt4 from './lib/cheater/Save/SaveAt4.svelte';
	import SaveAt5 from './lib/cheater/Save/SaveAt5.svelte';
	import SpeedHack0 from './lib/cheater/SpeedHack/SpeedHack0.svelte';
	import SpeedHack100 from './lib/cheater/SpeedHack/SpeedHack100.svelte';
	import SpeedHack150 from './lib/cheater/SpeedHack/SpeedHack150.svelte';
	import SpeedHack200 from './lib/cheater/SpeedHack/SpeedHack200.svelte';
	import SpeedHack50 from './lib/cheater/SpeedHack/SpeedHack50.svelte';
	import { getJSON } from './utils/store';

	const KeyPrefix = 'AsCheater';
	const StoreKeySelectedCheaters = `${KeyPrefix}_SelectedCheaters`;
	const StoreKeyCustomCheaters = `${KeyPrefix}_CustomCheaters`;
	const StoreHotKeyConfig = `${KeyPrefix}_HotKeyConfig`;

	// region preset cheaters

	const AllPresetCheaters = {
		Gold0,
		GoldPlus1K,
		GoldPlus10K,
		GoldPlus100K,
		GoldPlus1M,
		GoldMinus1K,
		GoldMinus10K,
		GoldMinus100K,
		GoldMinus1M,
		PartyFullHP,
		PartyHalfHP,
		Party1HP,
		Party0HP,
		EnemyFullHP,
		EnemyHalfHP,
		Enemy1HP,
		Enemy0HP,
		PartyFullMP,
		PartyHalfMP,
		Party1MP,
		Party0MP,
		PartyFullTP,
		PartyHalfTP,
		Party1TP,
		Party0TP,
		SaveAt1,
		SaveAt2,
		SaveAt3,
		SaveAt4,
		SaveAt5,
		SaveAt10,
		SaveAt20,
		SpeedHack0,
		SpeedHack50,
		SpeedHack100,
		SpeedHack150,
		SpeedHack200,
		DevTools
	};
	type KeyOfRegisterCheaters = keyof typeof AllPresetCheaters;
	type TypeOfSelectedCheaters = Record<KeyOfRegisterCheaters, boolean>;
	type PartialSelectedCheaters = Partial<TypeOfSelectedCheaters>;

	const AllPresetCheaterKeys: KeyOfRegisterCheaters[] = Object.keys(AllPresetCheaters) as KeyOfRegisterCheaters[];
	const getDefaultSelectedCheaters = () => AllPresetCheaterKeys.map((name) => ({ [name]: true })).reduce((acc, cur) => ({ ...acc, ...cur }), {}) as TypeOfSelectedCheaters;

	// endregion

	// region custom cheaters

	const AvailableCustomCheaters = {
		CustomTeleport,
		CustomSwitch,
		CustomSave,
		CustomItem,
		CustomWeapon,
		CustomArmor,
		CustomVariable,
		CustomEvaluate
	};
	type KeyOfAvailableCustomCheaters = keyof typeof AvailableCustomCheaters;

	const AvailableCustomCheaterKeys = Object.keys(AvailableCustomCheaters) as KeyOfAvailableCustomCheaters[];

	interface CustomCheaterConfig<
		T extends KeyOfAvailableCustomCheaters = KeyOfAvailableCustomCheaters,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		V = any,
	> {
		id: string;
		type: T;
		name?: string;
		value?: V;
	}

	// type CustomCheaterConfig =
	// 	| ICustomCheaterConfig<'CustomEvaluate', string>
	// 	| ICustomCheaterConfig<'CustomTeleport', [number, number, number]>;

	let customCheaters = getJSON<CustomCheaterConfig[]>(StoreKeyCustomCheaters, [], obj => obj instanceof Array);

	let customCheaterType: KeyOfAvailableCustomCheaters = 'CustomTeleport';

	// endregion

	let editing: boolean = false;
	let selectedCheaters = getJSON<PartialSelectedCheaters & Record<string, boolean>>(StoreKeySelectedCheaters, getDefaultSelectedCheaters());

	type HotKeyConfigKeys = keyof Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'shiftKey' | 'metaKey'>;
	type HotKeyConfig = Record<HotKeyConfigKeys, boolean>;

	const DefaultHotKeyConfig: HotKeyConfig = {
		altKey: true,
		ctrlKey: false,
		shiftKey: false,
		metaKey: false
	};
	const KeysOfDefaultHotKeyConfig: HotKeyConfigKeys[] = Object.keys(DefaultHotKeyConfig) as HotKeyConfigKeys[];

	let hotKeyConfig: HotKeyConfig = getJSON<HotKeyConfig>(StoreHotKeyConfig, { ...DefaultHotKeyConfig });

	$: {
		if (!editing) {
			localStorage.setItem(StoreKeySelectedCheaters, JSON.stringify(selectedCheaters));
			localStorage.setItem(StoreKeyCustomCheaters, JSON.stringify(customCheaters));
			localStorage.setItem(StoreHotKeyConfig, JSON.stringify(hotKeyConfig));
		}
	}

	const handleAddCustomCheater = () => {
		const id = `${customCheaterType}_${Date.now()}`;
		customCheaters = [
			...customCheaters,
			{
				id,
				type: customCheaterType,
				value: undefined
			}
		];
		selectedCheaters = {
			...selectedCheaters,
			[id]: true
		};
	};

	onMount(() => {
		let flashTimer: number = -1;
		const handleKeyUp = (e: KeyboardEvent) => {
			if (editing) {
				return;
			}
			let n = parseInt(e.key);
			if (Number.isNaN(n)) {
				switch (e.key) {
					case '-':
						n = 11;
						break;
					case '=':
						n = 12;
						break;
					default:
						return;
				}
			}
			if (KeysOfDefaultHotKeyConfig.find(key => hotKeyConfig[key] != e[key])) {
				return;
			}

			const index = n === 0 ? 9 : n - 1;

			const cheater = document.querySelectorAll(`#CheatMainFrame .cheater`)[index] as HTMLDivElement;
			if (!cheater) {
				return;
			}
			e.preventDefault();

			cheater.click();
			clearTimeout(flashTimer);
			cheater.parentElement?.classList.add('flash');
			flashTimer = setTimeout(() => {
				cheater.parentElement?.classList.remove('flash');
			}, 100);
		};
		window.addEventListener('keyup', handleKeyUp, true);
		return () => {
			window.removeEventListener('keyup', handleKeyUp, true);
		};
	});

	function makeModuleTitle(index: number, prefix: string = '', suffix: string = ''): string {
		if (index > 11) {
			return '';
		}

		if (index === 9) {
			index = -1;
		}

		let keyName = `${index + 1}`;

		if (index > 9) {
			switch (index) {
				case 10:
					keyName = '-';
					break;
				case 11:
					keyName = '=';
					break;
			}
		}
		return `${prefix}Press ` +
			(hotKeyConfig.metaKey ? 'Meta + ' : '') +
			(hotKeyConfig.ctrlKey ? 'Ctrl + ' : '') +
			(hotKeyConfig.shiftKey ? 'Shift + ' : '') +
			(hotKeyConfig.altKey ? 'Alt + ' : '') +
			`${keyName} to active${suffix}`;
	}
</script>

<style lang="scss">
  .wrapper {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    //opacity: 0.1;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    user-select: none;
    min-width: 40px;
    max-height: 100vh;
    flex-wrap: nowrap;
    overflow: hidden;
    text-align: center;

    &:hover {
      //background-color: rgba(0, 0, 0, 0.8);
      opacity: 1;
    }

    &.editing {
      width: 50vw;
      min-width: 500px;
      height: 100vh;
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.8);

      .cheaters {
        align-items: stretch;
        justify-content: flex-start;
        align-content: flex-start;
        scrollbar-width: auto;
        overflow: auto;
        flex-wrap: wrap;
        flex-direction: row;
        flex: 1 0;

        .cheaterWrapper {
          cursor: pointer;
          flex-direction: column;
          justify-content: flex-start;
          padding: 5px 0 0;
          background-color: rgba(0, 0, 0, 0.8);
          opacity: 0.8;

          .cheater {
            flex: 1;
            align-items: flex-start;
          }
        }
      }

      .actions {
        .action {
          background-color: rgba(0, 0, 0, 0.8);
          opacity: 0.8;
        }
      }
    }

    input {
      cursor: pointer;
    }

    select {
      width: 100%;
    }

    .actions {
      width: 100%;

      &.flat {
        display: flex;
        justify-content: center;
        align-items: center;

        .action {
          flex: 1;
        }
      }

      .action {
        cursor: pointer;
        border: 1px solid gray;
        color: gray;
        opacity: 0.3;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          border-color: white;
          color: white;
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.8);
        }
      }
    }

    .cheaters {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      flex: 1;
      flex-wrap: nowrap;
      overflow-y: auto;
      scrollbar-width: none;

      ::-webkit-scrollbar {
        opacity: 0;
      }

      .cheaterWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        border: 1px solid gray;
        color: gray;
        opacity: 0.3;

        &:hover, &:global(.flash) {
          border-color: white;
          color: white;
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.8);
        }

        .checkboxWrapper {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap;
          overflow: hidden;
        }

        .cheater {
          padding: 5px 0;
          min-height: 30px;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          &.editing {
            width: 100%;
            padding: 0;
          }
        }
      }
    }
  }
</style>

<div role="none" id="CheatMainFrame" class="wrapper" class:editing={editing}
		 on:click|stopPropagation={() => undefined}>
	<div class="actions">
		<div role="none" class="action" on:click={() => {
			editing = !editing;
			MV.playSound(editing);
		}}>
			{editing ? 'Apply' : 'Edit'}
		</div>
		{#if editing}
			<div class="actions flat">
				{#each KeysOfDefaultHotKeyConfig as key}
					<div role="none" class="action" on:click={() => hotKeyConfig[key] = !hotKeyConfig[key]}>
						{key}: <input type="checkbox" bind:checked={hotKeyConfig[key]} />
					</div>
				{/each}
			</div>
			<div class="actions flat">
				<div role="none" class="action" on:click={() => {
					selectedCheaters = getDefaultSelectedCheaters();
					customCheaters.forEach((cheater) => selectedCheaters[cheater.id] = true);
					MV.playSound(true);
				}}>
					ALL
				</div>
				<div role="none" class="action" on:click={() => {
					selectedCheaters = {};
					MV.playSound();
				}}>
					NONE
				</div>
			</div>
			<div class="actions flat">
				<div class="action">
					<select bind:value={customCheaterType}>
						{#each AvailableCustomCheaterKeys as key}
							<option value={key}>{key}</option>
						{/each}
					</select>
				</div>
				<div role="none" class="action" on:click={handleAddCustomCheater}>
					<span>+</span>
				</div>
			</div>
		{/if}
	</div>
	{#if customCheaters.length > 0}
		<div class="cheaters">
			{#each customCheaters as cheater, index (cheater.id)}
				{#if selectedCheaters[cheater.id] || editing}
					<div role="none" class="cheaterWrapper" style:padding="0">
						{#if editing}
							<div role="none" class="checkboxWrapper"
									 on:click={() => selectedCheaters[cheater.id] = !selectedCheaters[cheater.id]}>
								<button
									on:click|capture|stopPropagation={() => customCheaters = customCheaters.filter((_, i) => i !== index)}>
									-
								</button>
								<span>{cheater.id}</span>
								<input type="checkbox" bind:checked={selectedCheaters[cheater.id]} />
							</div>
						{/if}
						<div class="cheater" class:editing={editing} id={cheater.id}>
							<svelte:component this={AvailableCustomCheaters[cheater.type]}
																title={makeModuleTitle(index)}
																bind:value={cheater.value}
																bind:name={cheater.name} {editing} />
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
	<div class="cheaters">
		{#each AllPresetCheaterKeys as name, index}
			{#if selectedCheaters[name] || editing}
				<div role="none" class="cheaterWrapper"
						 on:click={() => editing?(selectedCheaters[name] = !selectedCheaters[name]):undefined}>
					{#if editing}
						<input type="checkbox" bind:checked={selectedCheaters[name]} />
					{/if}
					<div class="cheater">
						<svelte:component this={AllPresetCheaters[name]} {editing}
															title={makeModuleTitle(index + customCheaters.length)} />
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>
