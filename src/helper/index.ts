import { IFormula } from "../model/config.ts";

export function id(namespace: string = "id"): string {
  return `${namespace}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function newID(formulas: IFormula[]): IFormula[] {
  return formulas.map((f) => {
    f.id = id("formula");
    f.triggers.forEach((t) => {
      t.id = id("trigger");
      t.actions.forEach((a) => {
        a.id = id("action");
      });
    });
    return f;
  });
}

export function clone<T = unknown>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
