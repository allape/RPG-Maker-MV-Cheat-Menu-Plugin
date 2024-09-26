export type X = number;
export type Y = number;

export type Gold = number;
export type ItemType = 'item' | 'weapon' | 'armor';

export type TeamType = 'alias' | 'enemy';
export type HMTP = 'hp' | 'mp' | 'tp';
export type HMTPValue = 'full' | 'half' | '0' | '1' | number;

export type VariableValue = number | string;

export interface IActor {
	id: number | string;
	name: string;
	x: X;
	y: Y;
}

export interface IItem {
	id: number | string;
	name: string;
	type: ItemType;
}

export interface IMap {
	id: number | string;
	name: string;
}

export interface ISwitch {
	id: number | string;
	name: string;
	state: boolean;
}

export interface IVariable {
	id: number | string;
	name: string;
	value: VariableValue;
}

export interface IRPGMaker {
	getGold(): Gold;

	getHero(): IActor;

	getItemList(it: ItemType): IItem[];

	getMapList(): IMap[];

	getSwitchList(): ISwitch[];

	getVariableList(): IVariable[];

	getEnemyList(): IActor[];

	getAliasList(): IActor[];

	getCurrentMap(): IMap | undefined;

	setup(): void;

	playSound(positive?: boolean): void;

	getVersionString(): string;

	getScriptGenerator(): ICheatScriptGenerator;

	evaluate(script: Script): unknown;
}

export type Script = string;

export interface ICheatScriptGenerator {
	setup(): Script;

	gainGold(gold: Gold): Script;

	gainItem(it: ItemType, item: IItem, amount: number): Script;

	teleport(map: IMap, x: X, y: Y): Script;

	saveGame(index: number): Script;

	speedHack(fps: number): Script;

	setHMTP(tt: TeamType, aliveOrActor: boolean | IActor, hmtp: HMTP, value: HMTPValue): Script;

	setSwitch(sw: ISwitch, state: boolean): Script;

	setVariable(v: IVariable, value: VariableValue): Script;

	openDevTools(): Script;
}
