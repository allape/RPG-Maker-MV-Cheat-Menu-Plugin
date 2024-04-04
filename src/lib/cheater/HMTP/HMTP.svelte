<!-- HMTP = HP, MP, TP -->

<script lang="ts">
	import MV, { type GameActor } from '../../../core/mv';
	import Evaluate from '../Evaluate/Evaluate.svelte';

	const MaxFunc: Record<typeof type, (actor: GameActor) => number> = {
		hp: (actor: GameActor) => actor.mhp,
		mp: (actor: GameActor) => actor.mmp,
		tp: (actor: GameActor) => actor.maxTp()
	};

	const Color: Record<typeof type, string> = {
		hp: 'green',
		mp: '#747bff',
		tp: 'cyan'
	};

	export let alive: boolean = true;
	export let type: 'hp' | 'mp' | 'tp' = 'hp';
	export let target: 'party' | 'enemy' = 'party';
	export let to: 'full' | 'half' | '0' | '1' = 'full';

	$: _type = `_${type}` as keyof Pick<GameActor, '_hp' | '_mp' | '_tp'>;
	$: Type = type.charAt(0).toUpperCase() + type.slice(1);
	$: setFunc = `set${Type}` as keyof Pick<GameActor, 'setHp' | 'setMp' | 'setTp'>;

	const handleEval = () => {
		let actors: GameActor[] = [];
		switch (target) {
			case 'party':
				actors = MV.get$gameParty().allMembers();
				break;
			case 'enemy':
				actors = MV.get$gameTroop().members();
				break;
		}
		actors.forEach(actor => {
			if (alive && actor._hp <= 0) return;
			switch (to) {
				case 'full':
					actor[setFunc](MaxFunc[type](actor));
					break;
				case 'half':
					actor[setFunc](actor[_type] / 2);
					break;
				case '1':
					actor[setFunc](1);
					break;
				case '0': // ALERT: this may cause error
					actor[setFunc](0);
					break;
			}
		});
	};
</script>

<Evaluate func={handleEval} title={$$props.title} disabled={$$props.editing}>
	<span style:color={Color[type]}><slot>HMTP</slot></span>
</Evaluate>
