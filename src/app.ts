import ChronusTimeHack from './lib/module/chronus/ChronusTimeHack.svelte';
import DevTools from './lib/module/DevTools.svelte';
import Gold from './lib/module/Gold.svelte';
import SpriteHMTP from './lib/module/HMTP.svelte';
import Item from './lib/module/Item.svelte';
import Navigator from './lib/module/Navigator.svelte';
import OptionSelect from './lib/module/OptionSelect.svelte';
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
	OptionSelect,

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
		| typeof OptionSelect
		| typeof DevTools
		| typeof ChronusTimeHack;
	isAvailable: () => boolean;
	description?: string;
}

export const Functions: Record<FunctionTypes, IFunction> = {
	Gold: {
		component: Gold,
		isAvailable: () => true,
		description: 'Make money or lose it'
	},
	'HP|MP|TP': {
		component: SpriteHMTP,
		isAvailable: () => true,
		description: 'Change HP, MP, or TP of alias/enemy'
	},
	Navigator: {
		component: Navigator,
		isAvailable: () => true,
		description: 'Teleport from one map to another'
	},
	Variable: {
		component: Variable,
		isAvailable: () => true,
		description: 'Change game variables'
	},
	Switch: {
		component: Switch,
		isAvailable: () => true,
		description: 'Change game switches'
	},
	Item: {
		component: Item,
		isAvailable: () => true,
		description: 'Gain item/weapon/armor or lose it'
	},
	Save: {
		component: Save,
		isAvailable: () => true,
		description: 'Save game at any circumstances'
	},
	SpeedHack: {
		component: SpeedHack,
		isAvailable: () => true,
		description: 'Change game speed (may cause game crash)'
	},
	Script: {
		component: ScriptEval,
		isAvailable: () => true,
		description: 'Run script in game console'
	},
	OptionSelect: {
		component: OptionSelect,
		isAvailable: () => true,
		description: 'Fast choose option from menu/list'
	},
	DevTools: {
		component: DevTools,
		isAvailable: () => true,
		description: 'Open DevTools in game window (may not working)'
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
		},
		description: 'Change time in game with chronus plugin'
	}
};

export function GetAvailableFunctionKeys(): FunctionTypes[] {
	return FunctionKeys.filter((key) => Functions[key].isAvailable());
}
