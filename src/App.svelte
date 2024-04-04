<script lang="ts">
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
	import { getJSON } from './utils/store';

	const KeyPrefix = 'AsCheater';
	const StoreKeySelectedCheaters = `${KeyPrefix}_SelectedCheaters`;

	const RegisterCheaters = {
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
		Party0TP
	};

	type TypeOfRegisterCheaters = typeof RegisterCheaters;
	type KeyOfRegisterCheaters = keyof TypeOfRegisterCheaters;
	type TypeOfSelectedCheaters = Record<KeyOfRegisterCheaters, boolean>;

	const RegisterCheaterKeys: KeyOfRegisterCheaters[] = Object.keys(RegisterCheaters) as KeyOfRegisterCheaters[];
	const getDefaultSelectedCheaters = () => RegisterCheaterKeys.map((name) => ({ [name]: true })).reduce((acc, cur) => ({ ...acc, ...cur }), {}) as TypeOfSelectedCheaters;

	let mode: 'mini' | 'full' = 'mini';
	let editing: boolean = false;
	let selectedCheaters: TypeOfSelectedCheaters = getJSON<TypeOfSelectedCheaters>(StoreKeySelectedCheaters, getDefaultSelectedCheaters());

	$: {
		if (!editing) {
			localStorage.setItem(StoreKeySelectedCheaters, JSON.stringify(selectedCheaters));
		}
	}
</script>

<style lang="scss">
  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
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

    input {
      cursor: pointer;
    }

    .actions {
      width: 100%;

      .action {
        cursor: pointer;
        border: 1px solid gray;
        color: gray;

        &:hover {
          border-color: white;
					color: white;
          background-color: rgba(0, 0, 0, 0.5);
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

        &:hover {
          border-color: white;
					color: white;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .cheater {
          padding: 5px 0;
          min-height: 30px;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          &.noClick {
            pointer-events: none;
          }
        }
      }
    }
  }
</style>

<div class="wrapper">
	<div class="actions">
		<div role="none" class="action" on:click={() => editing = !editing}>
			{editing ? 'Apply' : 'Edit'}
		</div>
		{#if editing}
			<div role="none" class="action" on:click={() => selectedCheaters = getDefaultSelectedCheaters()}>
				ALL
			</div>
		{/if}
	</div>
	{#if mode === 'mini'}
		<div class="cheaters">
			{#each RegisterCheaterKeys as name}
				{#if selectedCheaters[name] || editing}
					<div role="none" class="cheaterWrapper"
							 on:click={() => editing?(selectedCheaters[name] = !selectedCheaters[name]):undefined}>
						{#if editing}
							<input type="checkbox" bind:checked={selectedCheaters[name]} />
						{/if}
						<div class="cheater" class:noClick={editing}>
							<svelte:component this={RegisterCheaters[name]} />
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{:else if mode === 'full'}
		FULL TODO
	{/if}
</div>
