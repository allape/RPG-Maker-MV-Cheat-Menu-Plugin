<script lang="ts">
	import MV, { type GameActor } from '../../core/mv';
	import DeepTrigger from '../ui/DeepTrigger.svelte';
	import FlatRow from '../ui/FlatRow.svelte';
	import HeroSelector from '../ui/SpriteSelector.svelte';

	interface IValue {
		actorType: 'party' | 'enemy';
		actorIndex: number;
		type: 'hp' | 'mp' | 'tp';
		valueType: 'full' | 'half' | '0' | '1' | 'custom';
		customValue: number;
	}

	const MaxFunc: Record<IValue['type'], (actor: GameActor) => number> = {
		hp: (actor: GameActor) => actor.mhp,
		mp: (actor: GameActor) => actor.mmp,
		tp: (actor: GameActor) => actor.maxTp()
	};

	export let id: string = '';
	export let value: IValue = {
		actorType: 'party',
		actorIndex: 0,
		type: 'hp',
		valueType: 'full',
		customValue: 1
	};

	export function handleEval() {
		const allHeroes = MV.get$gameParty().allMembers();
		let heroes: GameActor[] = [];
		if (value.actorIndex < 0) {
			switch (value.actorIndex) {
				case -2:
					heroes = allHeroes.filter(hero => hero._hp > 0);
					break;
				case -1:
					heroes = allHeroes;
					break;
			}
		} else {
			const hero = allHeroes[value.actorIndex];
			if (!hero) {
				MV.playSound(false);
				return;
			}
			heroes = [hero];
		}

		const HMTP = value.type.charAt(0).toUpperCase() + value.type.slice(1);
		const setFunc = `set${HMTP}` as keyof Pick<GameActor, 'setHp' | 'setMp' | 'setTp'>;
		heroes.forEach(hero => {
			switch (value.valueType) {
				case 'full':
					hero[setFunc](MaxFunc[value.type](hero));
					break;
				case 'half':
					hero[setFunc](hero[`_${value.type}`] / 2);
					break;
				case '1':
					hero[setFunc](1);
					break;
				case '0':
					hero[setFunc](0);
					break;
				case 'custom':
				default:
					hero[setFunc](value.customValue || 0);
					break;
			}
		});
		MV.playSound(true);
	}
</script>

<DeepTrigger {id} func={handleEval} />

<select bind:value={value.actorType}>
	<option value="party">Party</option>
	<option value="enemy">Enemy</option>
</select>
<HeroSelector all alive type={value.actorType} bind:value={value.actorIndex} />
<FlatRow>
	<select bind:value={value.type}>
		<option value="hp">HP</option>
		<option value="mp">MP</option>
		<option value="tp">TP</option>
	</select>
	<select bind:value={value.valueType}>
		<option value="full">Full</option>
		<option value="half">Half</option>
		<option value="1">1</option>
		<option value="0">0</option>
		<option value="custom">Custom</option>
	</select>
</FlatRow>
{#if value.valueType === 'custom'}
	<input type="number" min="0" step="1" bind:value={value.customValue}>
{/if}
<button on:click={handleEval}>Set Now</button>
