import type { FunctionTypes } from '../../app';
import type { HMTP, HMTPValue, IActor, ItemType, TeamType } from '../../rpgmaker/declare';

export interface IGoldValue extends Pick<Record<FunctionTypes, () => unknown>, 'Gold'> {
	Gold: () => number;
}

export interface IHMTPValue extends Pick<Record<FunctionTypes, () => unknown>, 'HP|MP|TP'> {
	'HP|MP|TP': () => {
		actorType: TeamType;
		actorId: IActor['id'];
		type: HMTP;
		valueType: Exclude<HMTPValue, number> | 'custom';
		customValue: number;
	};
}

export interface INavigatorValue extends Pick<Record<FunctionTypes, () => unknown>, 'Navigator'> {
	Navigator: () => {
		mapId: number;
		x: number;
		y: number;
	};
}

export interface IVariableValue extends Pick<Record<FunctionTypes, () => unknown>, 'Variable'> {
	Variable: () => {
		index: string;
		value: string;
	};
}

export interface ISwitchValue extends Pick<Record<FunctionTypes, () => unknown>, 'Switch'> {
	Switch: () => {
		index: string;
		value: boolean;
	};
}

export interface IItemValue extends Pick<Record<FunctionTypes, () => unknown>, 'Item'> {
	Item: () => {
		type: ItemType;
		item: string;
		amount: number;
	};
}

export interface ISaveValue extends Pick<Record<FunctionTypes, () => unknown>, 'Save'> {
	Save: () => number;
}

export interface ISpeedHackValue extends Pick<Record<FunctionTypes, () => unknown>, 'SpeedHack'> {
	SpeedHack: () => number;
}

export interface IScriptValue extends Pick<Record<FunctionTypes, () => unknown>, 'Script'> {
	Script: () => string;
}

export interface IDevToolsValue extends Pick<Record<FunctionTypes, () => unknown>, 'DevTools'> {
	DevTools: () => null;
}

export type IDefaultValue = IGoldValue &
	IHMTPValue &
	INavigatorValue &
	IVariableValue &
	ISwitchValue &
	IItemValue &
	ISaveValue &
	ISpeedHackValue &
	IScriptValue &
	IDevToolsValue;

export const DefaultValue: IDefaultValue = {
	Gold: () => 10_000,
	'HP|MP|TP': () => ({
		actorType: 'alias',
		actorId: -1,
		type: 'hp',
		valueType: 'full',
		customValue: 1
	}),
	Navigator: () => ({
		mapId: -1,
		x: 0,
		y: 0
	}),
	Variable: () => ({
		index: '',
		value: ''
	}),
	Switch: () => ({
		index: '',
		value: false
	}),
	Item: () => ({
		type: 'item',
		item: '',
		amount: 1
	}),
	Save: () => 2,
	SpeedHack: () => 0,
	Script: () => `alert('Hello World!');`,
	DevTools: () => null
};
