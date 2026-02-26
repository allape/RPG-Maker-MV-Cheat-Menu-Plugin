export type X = number;
export type Y = number;

export type Gold = number;
export type ItemType = "item" | "weapon" | "armor";

export type TeamType = "alias" | "enemy";
export type HMTP = "hp" | "mp" | "tp";
export type HMTPValue = "full" | "half" | "0" | "1" | number;

export type VariableValue = number | string;

export interface IActor {
  id: number;
  name: string;
  x: X;
  y: Y;
}

export interface IItem {
  id: number;
  name: string;
  type: ItemType;
  amount: number;
}

export interface IMap {
  id: number;
  name: string;
}

export interface ISwitch {
  id: number;
  name: string;
  state: boolean;
}

export interface IVariable {
  id: number;
  name: string;
  value: VariableValue;
}

export interface IStatus {
  id: number;
  name: string;
  value: number;
}

export interface IRPGMaker {
  getGold(): Gold;

  getHero(): IActor;

  getItemList(it: ItemType): IItem[];

  getMapList(): IMap[];

  getSwitchList(): ISwitch[];

  getVariableList(): IVariable[];

  getEnemyList(): IActor[];

  getAliasList(): IActor[];

  getCurrentMap(): IMap | undefined;

  setup(): void;

  playSound(positive?: boolean): void;

  getVersionString(): string;

  getTitle(): string;

  getStatusList(actorId: IActor["id"]): IStatus[];

  getScriptGenerator(): ICheatScriptGenerator;

  evaluate(script: Script): unknown;
}

export type Script = string;

export interface ICheatScriptGenerator {
  setup(): Script;

  gainGold(gold: Gold): Script;

  gainItem(it: ItemType, item: IItem, amount: number): Script;

  teleport(map: IMap, x: X, y: Y): Script;

  saveGame(index: number): Script;

  /**
   * Save game from slot {@link min} to slot {@link max}
   */
  saveGameInRoll(min: number, max: number): Script;

  /**
   * Use current timestamp as saving index
   */
  saveGameWithTimestampAsName(): Script;

  speedHack(fps: number): Script;

  setHMTP(
    tt: TeamType,
    aliveOrActor: boolean | IActor,
    hmtp: HMTP,
    value: HMTPValue,
  ): Script;

  setSwitch(sw: ISwitch, state: boolean): Script;

  setVariable(v: IVariable, value: VariableValue): Script;

  gainExp(actorId: IActor["id"], exp: number): Script;

  gainStatus(
    actorId: IActor["id"],
    statusId: IStatus["id"],
    value: number,
  ): Script;

  clearState(actorId: IActor["id"]): Script;

  openDevTools(): Script;
}
