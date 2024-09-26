export const MakeScriptEventName = '__asCheater_makeScript';

export class MakeScriptEvent extends Event {
	constructor() {
		super(MakeScriptEventName);
	}
}
