/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
	const nw: any;

	interface Window {
		KEY_CODE_TO_CHAR: Record<number, string>;
		__hookedMV: MV;
		__cheat_speed?: number;
		__cheat_speedLocked?: boolean;
		__guaranteed_intervals?: Record<string, number[]>;
	}

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

	class Game_Skill {

	}

	class Game_State {
		id: number;
	}

	class Game_Actor {
		_name: string;
		_hp: number;
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
		_speedCheatInjected: boolean;
		_moveSpeed: number;
		direction: () => any;
		reserveTransfer: (mapId: number, x: number, y: number, direction: any, other: number) => void;
		setPosition: (x: number, y: number) => void;
	}

	class Game_Item {
		name: string;
	}

	class Game_Map_Info {
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

	class Game_Weapon extends Game_Item {
	}

	class Game_Armor extends Game_Item {
	}

	class Data_System {
		switches: string[];
		variables: string[];
		terms: {
			params: string[]
		};
	}

	class DataManager {
		static loadGame(saveFieldId: number): any

		static setupNewGame(): any

		static saveGame(saveFieldId: number): any

		static _hookInjected: boolean;
		static _loadGame_proxy: LoadGame;
		static _setupNewGame_proxy: SetupNewGame;
		static _saveGame_proxy: SaveGame;
	}

	class SoundManager {
		static playSystemSound(soundIndex?: number): void

		static _playSystemSound_proxy(soundIndex?: number): void
	}

	class AudioManager {
		static _playBgm_proxy: typeof AudioManager.playBgm;
		static _playBgs_proxy: typeof AudioManager.playBgs;

		static playBgm(bgm: any, pos?: number): void

		static playBgs(bgs: any, pos?: number): void
	}

	class SceneManager {
		static updateScene: () => void;
	}
}

export type GameActor = Game_Actor;

export type LoadGame = typeof DataManager.loadGame
export type SetupNewGame = typeof DataManager.setupNewGame
export type SaveGame = typeof DataManager.saveGame

export type OnNewMessage = (messages: string) => void
export type OnChoicesChange = (messages: string[]) => void

/**
 * used for handle some errors because of cheat menu
 */
export function errorEnhancement() {
	AudioManager._playBgm_proxy = AudioManager.playBgm;
	AudioManager.playBgm = (bgm, pos) => {
		try {
			AudioManager._playBgm_proxy(bgm, pos);
		} catch (e) {
			console.error('error occurred while calling AudioManager.playBgm');
		}
	};

	AudioManager._playBgs_proxy = AudioManager.playBgs;
	AudioManager.playBgs = (bgm, pos) => {
		try {
			AudioManager._playBgs_proxy(bgm, pos);
		} catch (e) {
			console.error('error occurred while calling AudioManager.playBgs');
		}
	};

	SoundManager._playSystemSound_proxy = SoundManager.playSystemSound;
	SoundManager.playSystemSound = (pos) => {
		try {
			SoundManager._playSystemSound_proxy(pos);
		} catch (e) {
			console.error('error occurred while calling SoundManager.playSystemSound');
		}
	};
}

export default class MV {

	private static readonly CHEAT_NAME = 'AsCheater';

	/**
	 * 全局对象, 当前新游戏或者读取的游戏的保存数据
	 */
	storage: Record<string, string | number | boolean | null | undefined> = {};

	private readonly _onNewMessageQueue: OnNewMessage[] = [];
	private readonly _onChoicesChangeQueue: OnChoicesChange[] = [];

	private readonly _loadGameQueue: LoadGame[] = [];
	private readonly _setupNewGameQueue: SetupNewGame[] = [];
	private readonly _saveGameQueue: SaveGame[] = [];

	private constructor() {
		this._injectHooks();
	}

	private _injectHooks() {
		if (DataManager._hookInjected) {
			return;
		}

		DataManager._hookInjected = true;

		DataManager._loadGame_proxy = DataManager.loadGame;
		DataManager.loadGame = (saveFieldId) => {
			const result = DataManager._loadGame_proxy(saveFieldId);
			this.storage = $gameSystem[MV.CHEAT_NAME] || {};
			try {
				this._loadGameQueue.forEach(fn => {
					try {
						fn(saveFieldId);
					} catch (e) {
						console.error('error in call load game fn:', e);
					}
				});
			} catch (e) {
				console.error('error in call load game queue:', e);
			}
			return result;
		};

		DataManager._setupNewGame_proxy = DataManager.setupNewGame;
		DataManager.setupNewGame = () => {
			try {
				this._setupNewGameQueue.forEach(fn => {
					try {
						fn();
					} catch (e) {
						console.error('error in call setup new game fn:', e);
					}
				});
			} catch (e) {
				console.error('error in call setup new game queue:', e);
			}
			return DataManager._setupNewGame_proxy();
		};

		DataManager._saveGame_proxy = DataManager.saveGame;
		DataManager.saveGame = (saveFieldId) => {
			try {
				this._saveGameQueue.forEach(fn => {
					try {
						fn(saveFieldId);
					} catch (e) {
						console.error('error in call save game fn:', e);
					}
				});
			} catch (e) {
				console.error('error in call save game queue:', e);
			}
			$gameSystem[MV.CHEAT_NAME] = this.storage;
			return DataManager._saveGame_proxy(saveFieldId);
		};

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		Game_Message.prototype.__add_proxy = Game_Message.prototype.add;
		Game_Message.prototype.add = function(text) {
			this.__add_proxy(text);
			try {
				self._onNewMessageQueue.forEach(fn => {
					try {
						fn(text);
					} catch (e) {
						console.error('error in call new message fn:', e);
					}
				});
			} catch (e) {
				console.error('error in call new message queue:', e);
			}
		};
		Object.defineProperties(Game_Message.prototype, {
			_choices: {
				configurable: true,
				set: function(value) {
					value = value || [];
					if (value instanceof Array) {
						try {
							self._onChoicesChangeQueue.forEach(fn => {
								try {
									fn(value);
								} catch (e) {
									console.error('error in call choice change fn:', e);
								}
							});
						} catch (e) {
							console.error('error in call choice change queue:', e);
						}
					}
					this._wrappedChoices = value;
				},
				get: function() {
					return this._wrappedChoices || [];
				}
			}
		});
	}

	on(
		name: 'loadGame' | 'setupNewGame' | 'saveGame' | 'onNewMessage' | 'onChoicesChange',
		fn: LoadGame | SetupNewGame | SaveGame | OnNewMessage | OnChoicesChange
	): void {
		switch (name) {
			case 'loadGame':
				this._loadGameQueue.push(fn as LoadGame);
				break;
			case 'setupNewGame':
				this._setupNewGameQueue.push(fn as SetupNewGame);
				break;
			case 'saveGame':
				this._saveGameQueue.push(fn as SaveGame);
				break;
			case 'onNewMessage':
				this._onNewMessageQueue.push(fn as OnNewMessage);
				break;
			case 'onChoicesChange':
				this._onChoicesChangeQueue.push(fn as OnChoicesChange);
				break;
		}
	}

	off(
		name: 'loadGame' | 'setupNewGame' | 'saveGame' | 'onNewMessage' | 'onChoicesChange',
		fn: LoadGame | SetupNewGame | SaveGame | OnNewMessage | OnChoicesChange
	): void {
		switch (name) {
			case 'loadGame':
				MV._removeFromArray(this._loadGameQueue, fn);
				break;
			case 'setupNewGame':
				MV._removeFromArray(this._setupNewGameQueue, fn);
				break;
			case 'saveGame':
				MV._removeFromArray(this._saveGameQueue, fn);
				break;
			case 'onNewMessage':
				MV._removeFromArray(this._onNewMessageQueue, fn);
				break;
			case 'onChoicesChange':
				MV._removeFromArray(this._onChoicesChangeQueue, fn);
				break;
		}
	}

	private static _removeFromArray<T>(arr: T[], t: T): void {
		const index = arr.indexOf(t);
		if (index !== -1) arr.splice(index, 1);
	}

	static singleton() {
		window.__hookedMV = window.__hookedMV || new MV();
		return window.__hookedMV;
	}

	static injectGod(actor: Game_Actor) {
		if (!actor._godModeInjected) {
			try {
				actor._godModeInjected = true;

				actor._gainHP_proxy = actor.gainHp;
				actor.gainHp = (hp) => {
					actor._gainHP_proxy(actor._godMode ? actor.mhp : hp);
				};

				actor._setHp_proxy = actor.setHp;
				actor.setHp = (hp) => {
					actor._setHp_proxy(actor._godMode ? actor.mhp : hp);
				};

				actor._gainMp_proxy = actor.gainMp;
				actor.gainMp = (mp) => {
					actor._gainMp_proxy(actor._godMode ? actor.mmp : mp);
				};

				actor._setMp_proxy = actor.setMp;
				actor.setMp = (mp) => {
					actor._setMp_proxy(actor._godMode ? actor.mmp : mp);
				};

				actor._gainTp_proxy = actor.gainTp;
				actor.gainTp = (tp) => {
					actor._gainTp_proxy(actor._godMode ? actor.maxTp() : tp);
				};

				actor._setTp_proxy = actor.setTp;
				actor.setTp = (tp) => {
					actor._setTp_proxy(actor._godMode ? actor.maxTp() : tp);
				};

				actor._paySkillCost_proxy = actor.paySkillCost;
				actor.paySkillCost = (skill) => {
					if (!actor._godMode) {
						actor._paySkillCost_proxy(skill);
					}
				};
			} catch (e) {
				console.error(`unable to turn on god mode for: ${actor._name},`, e);
			}
		}
	}

	static setNumberVariable(varId: number, offsetValue: number) {
		try {
			const oldValue = $gameVariables.value(varId);
			if (isNaN(oldValue)) {
				$gameVariables.setValue(varId, offsetValue);
			} else {
				$gameVariables.setValue(varId, oldValue + offsetValue);
			}
		} catch (e) {
			console.error('error to set value for', varId, 'with', e);
		}
	}

	static setVariable(varId: number, value: number | string | unknown) {
		try {
			$gameVariables.setValue(varId, value);
		} catch (e) {
			console.error('error to set value for', varId, 'with', e);
		}
	}

	static opeStatAmount(actor: Game_Actor, statIndex: number, amount: number) {
		if (actor._paramPlus[statIndex] !== undefined) {
			actor.addParam(statIndex, amount);
		}
	}

	static gainGold(gold: number) {
		$gameParty.gainGold(gold);
	}

	static getGold(): number {
		return $gameParty._gold;
	}

	static playSound(positive: boolean = false) {
		try {
			SoundManager.playSystemSound(positive ? 1 : 2);
		} catch (e) {
			console.error('error to play sound:', e);
		}
	}

	static get$gameParty() {
		try {
			return $gameParty;
		} catch (e) {
			return { _items: [] } as unknown as Game_Party;
		}
	}

	static get$gameTroop() {
		return $gameTroop;
	}

	static get$gamePlayer(): Game_Player {
		try {
			return $gamePlayer;
		} catch (e) {
			return { x: 0, y: 0 } as Game_Player;
		}
	}

	static get$dataMapInfos() {
		try {
			return $dataMapInfos;
		} catch (e) {
			return [];
		}
	}

	static get$gameMap(): Game_Map {
		try {
			return $gameMap;
		} catch (e) {
			return { mapId: () => 0 };
		}
	}

	static get$dataSystem(): Data_System {
		try {
			return $dataSystem;
		} catch (e) {
			return { switches: [], variables: [] } as unknown as Data_System;
		}
	}

	static get$gameSwitches(): Game_Switches {
		try {
			return $gameSwitches;
		} catch (e) {
			return { value: () => false } as unknown as Game_Switches;
		}
	}

	static get$gameVariables() {
		try {
			return $gameVariables;
		} catch (e) {
			return { value: () => false } as unknown as Game_Variables;
		}
	}

	static get$dataItems() {
		try {
			return $dataItems;
		} catch (e) {
			return [];
		}
	}

	static get$dataWeapons() {
		try {
			return $dataWeapons;
		} catch (e) {
			return [];
		}
	}

	static get$dataArmors() {
		try {
			return $dataArmors;
		} catch (e) {
			return [];
		}
	}

	static getDataManager(): typeof DataManager {
		return DataManager;
	}

	static getSceneManager(): typeof SceneManager {
		return SceneManager;
	}
}
