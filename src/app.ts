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
import PresetJSON from './presets.json';

export type HTMLString = string;
export type IDString = string;

export interface IAppearance {
	idlingOpacityLevel: number;
	maxIdlingOpacityLevel: number;
	// focusingOpacity: number;
}

export interface IAction {
	id: IDString;
	type: FunctionTypes;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
	script?: string;
}

export interface ITrigger {
	id: IDString;
	name: HTMLString;
	hotKey?: string;
	actions: IAction[];
}

export interface IPreset {
	id: IDString;
	name: string;
	triggers: ITrigger[];
}

export interface IConfig {
	appearance: IAppearance;
	presets: IPreset[];
}

export const Functions = {
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
export type FunctionTypes = keyof typeof Functions;
export const FunctionKeys: FunctionTypes[] = Object.keys(Functions) as FunctionTypes[];
export const AuthorPresets: IPreset[] = PresetJSON as IPreset[];
