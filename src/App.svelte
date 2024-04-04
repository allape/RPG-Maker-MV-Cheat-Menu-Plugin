<script lang="ts">
	import CustomEvaluate from './lib/cheater/Custom/CustomEvaluate.svelte';
	import CustomTeleport from './lib/cheater/Custom/CustomTeleport.svelte';
	import Gold0 from './lib/cheater/Gold/Gold0.svelte';
	import GoldMinus100K from './lib/cheater/Gold/GoldMinus100K.svelte';
	import GoldMinus10K from './lib/cheater/Gold/GoldMinus10K.svelte';
	import GoldMinus1K from './lib/cheater/Gold/GoldMinus1K.svelte';
	import GoldMinus1M from './lib/cheater/Gold/GoldMinus1M.svelte';
	import GoldPlus100K from './lib/cheater/Gold/GoldPlus100K.svelte';
	import GoldPlus10K from './lib/cheater/Gold/GoldPlus10K.svelte';
	import GoldPlus1K from './lib/cheater/Gold/GoldPlus1K.svelte';
	import GoldPlus1M from './lib/cheater/Gold/GoldPlus1M.svelte';
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
	import { getJSON } from './utils/store';

	const KeyPrefix = 'AsCheater';
	const StoreKeySelectedCheaters = `${KeyPrefix}_SelectedCheaters`;
	const StoreKeyCustomCheaters = `${KeyPrefix}_CustomCheaters`;

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
		SaveAt20
	};
	type KeyOfRegisterCheaters = keyof typeof AllPresetCheaters;
	type TypeOfSelectedCheaters = Record<KeyOfRegisterCheaters, boolean>;
	type PartialSelectedCheaters = Partial<TypeOfSelectedCheaters>;

	const RegisterCheaterKeys: KeyOfRegisterCheaters[] = Object.keys(AllPresetCheaters) as KeyOfRegisterCheaters[];
	const getDefaultSelectedCheaters = () => RegisterCheaterKeys.map((name) => ({ [name]: true })).reduce((acc, cur) => ({ ...acc, ...cur }), {}) as TypeOfSelectedCheaters;

	let selectedCheaters = getJSON<PartialSelectedCheaters>(StoreKeySelectedCheaters, getDefaultSelectedCheaters());

	// endregion

	// region custom cheaters

	const AvailableCustomCheaters = {
		CustomEvaluate,
		CustomTeleport
	};
	type KeyOfAvailableCustomCheaters = keyof typeof AvailableCustomCheaters;

	const AvailableCustomCheaterKeys = Object.keys(AvailableCustomCheaters) as KeyOfAvailableCustomCheaters[];

	interface CustomCheaterConfig {
		type: KeyOfAvailableCustomCheaters;
		name?: string;
		value?: unknown;
	}

	let customCheaters = getJSON<CustomCheaterConfig[]>(StoreKeyCustomCheaters, [], obj => obj instanceof Array);

	let customCheaterType: KeyOfAvailableCustomCheaters = 'CustomEvaluate';

	const handleAddCustomCheater = () => {
		customCheaters = [...customCheaters, {
			type: customCheaterType,
			value: undefined
		}];
	};

	// endregion

	let editing: boolean = false;

	$: {
		if (!editing) {
			localStorage.setItem(StoreKeySelectedCheaters, JSON.stringify(selectedCheaters));
			localStorage.setItem(StoreKeyCustomCheaters, JSON.stringify(customCheaters));
		}
	}
</script>

<style lang="scss">
  .wrapper {
    position: fixed;
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

      .cheaterWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        border: 1px solid gray;
        color: gray;
        opacity: 0.3;

        &:hover {
          border-color: white;
          color: white;
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.8);
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
            width: fit-content;
            padding: 0;
          }

          &.noClick {
            pointer-events: none;
          }
        }
      }
    }
  }
</style>

<div class="wrapper" class:editing={editing}>
	<div class="actions">
		<div role="none" class="action" on:click={() => editing = !editing}>
			{editing ? 'Apply' : 'Edit'}
		</div>
		{#if editing}
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
		<div class="cheaters" style:overflow="visible">
			{#each customCheaters as cheater, index}
				<div role="none" class="cheaterWrapper" style:padding="0">
					<div class="cheater" class:editing={editing}>
						<svelte:component this={AvailableCustomCheaters[cheater.type]} bind:value={cheater.value}
															bind:name={cheater.name} {editing} />
					</div>
					{#if editing}
						<div class="actions">
							<div role="none" class="action"
									 on:click={() => customCheaters = customCheaters.filter((_, i) => i !== index)}>
								-
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	<div class="actions flat">
		{#if editing}
			<div role="none" class="action" on:click={() => selectedCheaters = getDefaultSelectedCheaters()}>
				ALL
			</div>
			<div role="none" class="action" on:click={() => selectedCheaters = {}}>
				NONE
			</div>
		{/if}
	</div>
	<div class="cheaters">
		{#each RegisterCheaterKeys as name}
			{#if selectedCheaters[name] || editing}
				<div role="none" class="cheaterWrapper"
						 on:click={() => editing?(selectedCheaters[name] = !selectedCheaters[name]):undefined}>
					{#if editing}
						<input type="checkbox" bind:checked={selectedCheaters[name]} />
					{/if}
					<div class="cheater" class:noClick={editing}>
						<svelte:component this={AllPresetCheaters[name]} {editing} />
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>
