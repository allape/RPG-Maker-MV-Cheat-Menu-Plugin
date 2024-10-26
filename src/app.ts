import type { IAction, IPreset, ITrigger } from './functions';
import { getRPGMaker } from './rpgmaker';
import { id } from './utils/gen';

export function NewIDs(preset: IPreset): IPreset {
	preset.id = id();
	preset.triggers.forEach((trigger) => {
		trigger.id = id();
		trigger.actions.forEach((action) => {
			action.id = id();
		});
	});
	return preset;
}

export function ToJSONString(preset: IPreset): string {
	preset = JSON.parse(JSON.stringify(preset));
	delete (preset as Partial<IPreset>).id;
	preset.triggers.forEach((trigger) => {
		delete (trigger as Partial<ITrigger>).id;
		trigger.actions.forEach((action) => {
			delete (action as Partial<IAction>).id;
		});
	});
	return JSON.stringify(preset);
}

export function DownloadAsJSONFile(preset: IPreset): void {
	const content = ToJSONString(preset);
	const blob = new Blob([content], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${preset.name}.json`;
	a.click();
	URL.revokeObjectURL(url);
}

export function RunTrigger(trigger: ITrigger): void {
	trigger.actions.forEach((action) => {
		if (!action.script) return;
		getRPGMaker().evaluate(action.script);
	});
}
