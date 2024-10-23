/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
	Gold,
	HMTP,
	HMTPValue,
	IActor,
	ICheatScriptGenerator,
	IItem,
	IMap,
	IRPGMaker,
	ISwitch,
	ItemType,
	IVariable,
	Script,
	TeamType,
	VariableValue,
	X,
	Y
} from '../declare';

declare global {
	const nw: any;

	const $gameActors: Game_Actors;

	const $gamePlayer: Game_Player;

	const $gameParty: Game_Party;

	const $gameTroop: Game_Troop;

	const $gameSystem: Record<string, any>;

	const $gameVariables: Game_Variables;

	const $gameSwitches: Game_Switches;

	const $gameMap: Game_Map;

	const $gameMessage: Game_Message;

	const $dataStates: Game_State[];

	const $dataSystem: Data_System;

	const $dataWeapons: Game_Weapon[];

	const $dataArmors: Game_Weapon[];

	const $dataItems: Game_Item[];

	const $dataMapInfos: Game_Map_Info[];

	class Game_Skill {}

	class Game_State {
		id: number;
	}

	class Game_Actor {
		_name: string;
		_nickname: string;
		_characterName: string;
		_hp: number;
		_actorId: number;
		_mp: number;
		_tp: number;
		_paramPlus: number[];
		_states: Array<Game_State | null | undefined>;
		_stateSteps: Record<string, Game_State>;

		// max hp
		mhp: number;
		// max mp
		mmp: number;

		maxTp: () => number;

		gainHp: (hp: number) => void;
		setHp: (hp: number) => void;
		gainMp: (mp: number) => void;
		setMp: (mp: number) => void;
		gainTp: (tp: number) => void;
		setTp: (tp: number) => void;
		paySkillCost: (skill: Game_Skill) => void;
		addParam: (statIndex: number, amount: number) => void;
		currentExp: () => number;
		gainExp: (exp: number) => void;
		clearStates: () => void;

		// injected

		_godModeInjected: boolean | undefined;
		_godMode: boolean;
		_godModeIntervalId: number | undefined;
		_gainHP_proxy: (hp: number) => void;
		_setHp_proxy: (hp: number) => void;
		_gainMp_proxy: (mp: number) => void;
		_setMp_proxy: (mp: number) => void;
		_gainTp_proxy: (tp: number) => void;
		_setTp_proxy: (tp: number) => void;
		_paySkillCost_proxy: (skill: Game_Skill) => void;
	}

	class Game_Player {
		x: number;
		y: number;
		_actorId: number;
		_characterName: string;
		_speedCheatInjected: boolean;
		_moveSpeed: number;
		direction: () => any;
		reserveTransfer: (mapId: number, x: number, y: number, direction: any, other: number) => void;
		setPosition: (x: number, y: number) => void;
	}

	class Game_Item {
		id: number;
		name: string;
	}

	class Game_Map_Info {
		id: number;
		name: string;
	}

	class Game_Map {
		mapId: () => number;
	}

	class Game_Message {
		_choices: string[];
		add: (message: string) => void;
		__add_proxy: (message: string) => void;
	}

	class Game_Party {
		_weapons: number[];
		_armors: number[];
		_items: number[];
		_gold: number;
		_through: boolean;
		gainItem: (item: Game_Item, amount: number) => void;
		gainGold: (amount: number) => void;
		allMembers: () => Game_Actor[];
	}

	class Game_Troop {
		members: () => Game_Actor[];
	}

	class Game_Variables {
		value: <T = any>(index: number) => T;
		setValue: <T = any>(index: number, value: T) => T;
	}

	class Game_Switches {
		value: (index: number) => boolean;
		setValue: (index: number, value: boolean) => boolean;
	}

	class Game_Actors {
		_data: Game_Actor[];
	}

	class Game_Weapon extends Game_Item {}

	class Game_Armor extends Game_Item {}

	class Data_System {
		switches: string[];
		variables: string[];
		terms: {
			params: string[];
		};
	}

	class DataManager {
		static loadGame(saveFieldId: number): any;

		static setupNewGame(): any;

		static saveGame(saveFieldId: number): any;
	}

	class SoundManager {
		static playSystemSound(soundIndex?: number): void;

		static _playSystemSound_proxy(soundIndex?: number): void;
	}

	class AudioManager {
		static _playBgm_proxy: typeof AudioManager.playBgm;
		static _playBgs_proxy: typeof AudioManager.playBgs;

		static playBgm(bgm: any, pos?: number): void;

		static playBgs(bgs: any, pos?: number): void;
	}

	class SceneManager {
		static updateScene: () => void;
	}
}

export class MVMZScriptGenerator implements ICheatScriptGenerator {
	constructor(private readonly maker: IRPGMaker) {}

	openDevTools(): Script {
		return `require('nw.gui').Window.get().showDevTools(); SoundManager.playSystemSound(1);`;
	}

	setup(): Script {
		return `
			AudioManager._playBgm_proxy = AudioManager.playBgm;
			AudioManager.playBgm = function(bgm, pos) {
				try {
					AudioManager._playBgm_proxy(bgm, pos);
				} catch (e) {
					console.error('error occurred while calling AudioManager.playBgm');
				}
			};
		
			AudioManager._playBgs_proxy = AudioManager.playBgs;
			AudioManager.playBgs = function(bgm, pos) {
				try {
					AudioManager._playBgs_proxy(bgm, pos);
				} catch (e) {
					console.error('error occurred while calling AudioManager.playBgs');
				}
			};
		
			SoundManager._playSystemSound_proxy = SoundManager.playSystemSound;
			SoundManager.playSystemSound = function(pos) {
				try {
					SoundManager._playSystemSound_proxy(pos);
				} catch (e) {
					console.error('error occurred while calling SoundManager.playSystemSound');
				}
			};
		`;
	}

	gainGold(gold: Gold): Script {
		return `$gameParty.gainGold(${gold || 0}); SoundManager.playSystemSound(1);`;
	}

	gainItem(it: ItemType, item: IItem, amount: number): Script {
		let itemVariableName: '_items' | '_weapons' | '_armors';
		let itemListVariableName: '$dataItems' | '$dataWeapons' | '$dataArmors';
		switch (it) {
			case 'item':
				itemVariableName = '_items';
				itemListVariableName = '$dataItems';
				break;
			case 'weapon':
				itemVariableName = '_weapons';
				itemListVariableName = '$dataWeapons';
				break;
			case 'armor':
				itemVariableName = '_armors';
				itemListVariableName = '$dataArmors';
				break;
			default:
				throw new Error(`Invalid item type: ${it}`);
		}
		return `
			$gameParty.gainItem(
				${itemListVariableName}[${item.id}], 
				${amount} - $gameParty.${itemVariableName}[${item.id}]
			);
			SoundManager.playSystemSound(1);
		`;
	}

	teleport(map: IMap, x: X, y: Y): Script {
		return `
			$gamePlayer.reserveTransfer(${map.id}, ${x}, ${y}, $gamePlayer.direction(), 0);
			$gamePlayer.setPosition(${x}, ${y});
			SoundManager.playSystemSound(1);
		`;
	}

	saveGame(index: number): Script {
		return `DataManager.saveGame(${index}); SoundManager.playSystemSound(1);`;
	}

	speedHack(fps: number): Script {
		let script: Script = `clearInterval(SceneManager._speedHackIntervalId); SoundManager.playSystemSound(1);`;
		if (fps > 0) {
			script += `
				SceneManager._speedHackIntervalId = setInterval(function(){SceneManager.updateScene();}, 1000 / ${fps});
			`;
		}
		return script;
	}

	setHMTP(tt: TeamType, aliveOrActor: boolean | IActor, hmtp: HMTP, value: HMTPValue): Script {
		let setFuncName: 'setHp' | 'setMp' | 'setTp';
		let maxValueScript: 'mhp' | 'mmp' | 'maxTp()';

		switch (hmtp) {
			case 'hp':
				setFuncName = 'setHp';
				maxValueScript = 'mhp';
				break;
			case 'mp':
				setFuncName = 'setMp';
				maxValueScript = 'mmp';
				break;
			case 'tp':
				setFuncName = 'setTp';
				maxValueScript = 'maxTp()';
				break;
			default:
				throw new Error(`Invalid HMTP: ${hmtp}`);
		}

		let valueScript: Script;
		switch (value) {
			case 'full':
				valueScript = `actor.${maxValueScript}`;
				break;
			case 'half':
				valueScript = `actor._${hmtp} / 2`;
				break;
			case '0':
				valueScript = '0';
				break;
			case '1':
				valueScript = '1';
				break;
			default:
				valueScript = value.toString();
		}

		let actorsScript: Script;
		switch (tt) {
			case 'alias':
				actorsScript = '$gameParty.allMembers()';
				break;
			case 'enemy':
				actorsScript = '$gameTroop.members()';
				break;
			default:
				throw new Error(`Invalid team type: ${tt}`);
		}

		let interceptorScript: Script = '';
		if (typeof aliveOrActor === 'boolean') {
			interceptorScript = `${aliveOrActor ? '' : 'if (actor._hp <= 0) continue;'}`;
		} else {
			switch (tt) {
				case 'alias':
					actorsScript = `[$gameParty.allMembers().find(function(a){ return a._actorId == ${aliveOrActor.id} })]`;
					break;
				case 'enemy':
					actorsScript = `[$gameTroop.members().find(function(a){ return a._actorId == ${aliveOrActor.id} })]`;
					break;
			}
		}

		return `
			var actors = ${actorsScript};
			for (var i = 0; i < actors.length; i++) {
				var actor = actors[i];
				if (!actor) continue;
				${interceptorScript}
				actor.${setFuncName}(${valueScript});
			}
			SoundManager.playSystemSound(1);
		`;
	}

	setSwitch(sw: ISwitch, state: boolean): Script {
		return `$gameSwitches.setValue(${sw.id}, ${state});SoundManager.playSystemSound(1);`;
	}

	setVariable(v: IVariable, value: VariableValue): Script {
		return `
		if (typeof $gameVariables.value(${v.id})) {
			$gameVariables.setValue(${v.id}, decodeURIComponent("${encodeURIComponent(value)}"));
		} else {
			$gameVariables.setValue(${v.id}, ${parseInt(`${value}`, 10) || 0});
		}
		SoundManager.playSystemSound(1);
		`;
	}
}

export class MVMZ implements IRPGMaker {
	private readonly sg: MVMZScriptGenerator;

	constructor() {
		this.sg = new MVMZScriptGenerator(this);
	}

	getVersionString(): string {
		return this.evaluate(
			`return "NW v" + process.versions["nw"] + ", Node " + process.version;`
		) as string;
	}

	setup(): void {
		this.evaluate(this.sg.setup());
	}

	playSound(positive?: boolean): void {
		this.evaluate(`SoundManager.playSystemSound(${positive ? 1 : 2});`);
	}

	getCurrentMap(): IMap | undefined {
		if (!$gameMap.mapId()) {
			return undefined;
		}
		return {
			id: $gameMap.mapId(),
			name: $dataMapInfos[$gameMap.mapId()]?.name
		};
	}

	getEnemyList(): IActor[] {
		return $gameTroop.members().map((i) => ({
			id: i._actorId,
			name: i._name,
			x: 0,
			y: 0
		}));
	}

	getAliasList(): IActor[] {
		return $gameParty.allMembers().map((i) => ({
			id: i._actorId,
			name: i._name,
			x: 0,
			y: 0
		}));
	}

	getGold(): Gold {
		return $gameParty._gold;
	}

	getHero(): IActor {
		const heroActor = $gameParty
			.allMembers()
			.find((i) => i._characterName === $gamePlayer._characterName);
		return {
			id: heroActor?._actorId || 0,
			name: heroActor?._name || '-',
			x: $gamePlayer.x,
			y: $gamePlayer.y
		};
	}

	getItemList(it: ItemType): IItem[] {
		let itemList: Game_Item[];
		switch (it) {
			case 'item':
				itemList = $dataItems;
				break;
			case 'weapon':
				itemList = $dataWeapons;
				break;
			case 'armor':
				itemList = $dataArmors;
				break;
			default:
				throw new Error(`Invalid item type: ${it}`);
		}
		return itemList.filter(Boolean).map((i) => ({
			id: i.id,
			name: i.name,
			type: it,
			amount: $gameParty[`_${it}s`][i.id]
		}));
	}

	getMapList(): IMap[] {
		return $dataMapInfos.filter(Boolean).map((i) => ({
			id: i.id,
			name: i.name
		}));
	}

	getSwitchList(): ISwitch[] {
		return $dataSystem.switches.map((i, index) => ({
			id: index,
			name: i,
			state: $gameSwitches.value(index)
		}));
	}

	getVariableList(): IVariable[] {
		return $dataSystem.variables.map((i, index) => ({
			id: index,
			name: i,
			value: $gameVariables.value(index)
		}));
	}

	getScriptGenerator(): ICheatScriptGenerator {
		return this.sg;
	}

	evaluate(script: Script): unknown {
		try {
			return new Function(script)();
		} catch (e) {
			console.error('Error occurred while evaluating script:', script, e);
			return undefined;
		}
	}
}
