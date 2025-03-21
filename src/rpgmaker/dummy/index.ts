import type {
  Gold,
  HMTP,
  HMTPValue,
  IActor,
  ICheatScriptGenerator,
  IItem,
  IMap,
  IRPGMaker,
  ISwitch,
  ItemType,
  IVariable,
  Script,
  TeamType,
  VariableValue,
  X,
  Y,
} from "../declare";
import { NewScript } from "../script";

export class DummyScriptGenerator implements ICheatScriptGenerator {
  openDevTools(): Script {
    return NewScript(`console.log('called openDevTools')`);
  }

  setup(): Script {
    return NewScript(`console.log('called setup')`);
  }

  gainGold(gold: Gold): Script {
    return NewScript(`console.log('called gainGold(${gold})')`);
  }

  gainItem(it: ItemType, item: IItem, amount: number): Script {
    return NewScript(
      `console.log('called gainItem(${it}, ${item.id}, ${amount})')`,
    );
  }

  teleport(map: IMap, x: X, y: Y): Script {
    return NewScript(`console.log('called teleport(${map.id}, ${x}, ${y})')`);
  }

  saveGame(index: number): Script {
    return NewScript(`console.log('called saveGame(${index})')`);
  }

  saveGameInRoll(min: number, max: number): Script {
    return NewScript(`console.log('called saveGameInRoll(${min}, ${max})')`);
  }

  speedHack(fps: number): Script {
    return NewScript(`console.log('called speedHack(${fps})')`);
  }

  setHMTP(
    tt: TeamType,
    aliveOrActor: boolean | IActor,
    hmtp: HMTP,
    value: HMTPValue,
  ): Script {
    return NewScript(
      `console.log('called setHMTP(${tt}, ${typeof aliveOrActor === "boolean" ? aliveOrActor : aliveOrActor.id}, ${hmtp}, ${value})')`,
    );
  }

  setSwitch(sw: ISwitch, state: boolean): Script {
    return NewScript(`console.log('called setSwitch(${sw.id}, ${state})')`);
  }

  setVariable(v: IVariable, value: VariableValue): Script {
    return NewScript(`console.log('called setVariable(${v.id}, ${value})')`);
  }
}

export class Dummy implements IRPGMaker {
  getVersionString(): string {
    return (
      navigator.userAgent
        .split(" ")
        .find((s) => s.startsWith("Chrome/"))
        ?.split("/")
        .join(" v") || "-"
    );
  }

  getTitle(): string {
    return document.title;
  }

  setup(): void {
    this.evaluate(this.getScriptGenerator().setup());
  }

  playSound(positive?: boolean): void {
    console.log("Ding Ding Ding:", positive);
  }

  evaluate(script: Script): unknown {
    return new Function(script)();
  }

  getGold(): Gold {
    return 999_999;
  }

  getHero(): IActor {
    return {
      id: 1,
      name: "Dummy",
      x: 0,
      y: 0,
    };
  }

  getItemList(it: ItemType): IItem[] {
    return [
      {
        id: 1,
        name: `Dummy ${it}`,
        type: it,
        amount: Math.floor(Math.random() * 1000),
      },
    ];
  }

  getMapList(): IMap[] {
    return [{ id: 1, name: "Dummy Map" }];
  }

  getSwitchList(): ISwitch[] {
    return [
      { id: 1, name: "True Switch", state: true },
      { id: 2, name: "False Switch1", state: false },
    ];
  }

  getVariableList(): IVariable[] {
    return [{ id: 1, name: "Dummy Variable", value: 0 }];
  }

  getEnemyList(): IActor[] {
    return [{ id: 1, name: "Dummy Enemy", x: 0, y: 0 }];
  }

  getAliasList(): IActor[] {
    return [{ id: 1, name: "Dummy Alias", x: 0, y: 0 }];
  }

  getCurrentMap(): IMap | undefined {
    return { id: 1, name: "Dummy Map" };
  }

  getScriptGenerator(): ICheatScriptGenerator {
    return new DummyScriptGenerator();
  }
}
