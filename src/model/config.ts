export type HTMLString = string;
export type IDString = string;

export interface IAppearance {
  idlingOpacityLevel: number;
  maxIdlingOpacityLevel: number;
}

export interface IAction {
  id: IDString;
  type: string;
  value: string;
  script: string;
}

export interface ITrigger {
  id: IDString;
  name: HTMLString;
  hotKey?: string;
  actions: IAction[];
}

export interface IFormula {
  id: IDString;
  name: string;
  triggers: ITrigger[];
}

export interface IConfig {
  appearance: IAppearance;
  formulas: IFormula[];
  activeFormula?: IFormula["id"];
}
