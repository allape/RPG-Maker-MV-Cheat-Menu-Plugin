export const EvalEventName = '__asCheater_eval';

export class EvalEvent extends Event {
	constructor(public readonly id: string) {
		super(EvalEventName);
	}
}
