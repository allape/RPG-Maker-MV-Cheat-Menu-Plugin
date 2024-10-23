import ChronusTimeHack from './lib/module/chronus/ChronusTimeHack.svelte';
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

export const AllFunctions = {
	Gold,
	'HP|MP|TP': SpriteHMTP,
	Navigator,
	Variable,
	Switch,
	Item,
	Save,
	SpeedHack,
	Script: ScriptEval,

	DevTools,

	ChronusTimeHack
};
export type FunctionTypes = keyof typeof AllFunctions;
export const FunctionKeys: FunctionTypes[] = Object.keys(AllFunctions) as FunctionTypes[];
export const AuthorPresets: IPreset[] = PresetJSON as IPreset[];

export interface IFunction {
	component:
		| typeof Gold
		| typeof SpriteHMTP
		| typeof Navigator
		| typeof Variable
		| typeof Switch
		| typeof Item
		| typeof Save
		| typeof SpeedHack
		| typeof ScriptEval
		| typeof DevTools
		| typeof ChronusTimeHack;
	isAvailable: () => boolean;
}

export const Functions: Record<FunctionTypes, IFunction> = {
	Gold: {
		component: Gold,
		isAvailable: () => true
	},
	'HP|MP|TP': {
		component: SpriteHMTP,
		isAvailable: () => true
	},
	Navigator: {
		component: Navigator,
		isAvailable: () => true
	},
	Variable: {
		component: Variable,
		isAvailable: () => true
	},
	Switch: {
		component: Switch,
		isAvailable: () => true
	},
	Item: {
		component: Item,
		isAvailable: () => true
	},
	Save: {
		component: Save,
		isAvailable: () => true
	},
	SpeedHack: {
		component: SpeedHack,
		isAvailable: () => true
	},
	Script: {
		component: ScriptEval,
		isAvailable: () => true
	},
	DevTools: {
		component: DevTools,
		isAvailable: () => true
	},
	ChronusTimeHack: {
		component: ChronusTimeHack,
		isAvailable: () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const anyWindow = window as any;
			return (
				typeof anyWindow.$gameSystem?.chronus === 'function' &&
				typeof anyWindow.$gameSystem.chronus().addTime === 'function'
			);
		}
	}
};

export function GetAvailableFunctionKeys(): FunctionTypes[] {
	return FunctionKeys.filter((key) => Functions[key].isAvailable());
}
