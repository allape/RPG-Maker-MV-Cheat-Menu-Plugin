import type { IRPGMaker } from './declare';
import { Dummy } from './dummy';
import { MVMZ } from './mvmz';

let rpg: IRPGMaker | undefined;

export function getRPGMaker(reload?: boolean): IRPGMaker {
	if (rpg && !reload) {
		return rpg;
	}

	if ('DataManager' in window) {
		rpg = new MVMZ();
	} else {
		rpg = new Dummy();
	}

	return rpg;
}
