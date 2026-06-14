/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Gold,
  HMTP,
  HMTPValue,
  IActor,
  ICheatScriptGenerator,
  IItem,
  IMap,
  IRPGMaker,
  IStatus,
  ISwitch,
  ItemType,
  IVariable,
  Script,
  TeamType,
  VariableValue,
  X,
  Y
} from "../declare";
import { NewScript } from "../script";

declare global {
  const nw: any;

  const $gameActors: Game_Actors;

  const $gamePlayer: Game_Player;

  const $gameParty: Game_Party;

  const $gameTroop: Game_Troop;

  const $gameSystem: Record<string, any>;

  const $gameVariables: Game_Variables;

  const $gameSwitches: Game_Switches;

  const $gameMap: Game_Map;

  const $gameMessage: Game_Message;

  const $dataStates: Game_State[];

  const $dataSystem: Data_System;

  const $dataWeapons: Game_Weapon[];

  const $dataArmors: Game_Weapon[];

  const $dataItems: Game_Item[];

  const $dataMapInfos: Game_Map_Info[];

  class Game_Skill {}

  class Game_State {
    id: number;
  }

  class Game_Actor {
    _name: string;
    _nickname: string;
    _characterName: string;
    _hp: number;
    _actorId: number;
    _mp: number;
    _tp: number;
    _paramPlus: number[];
    _states: Array<Game_State | null | undefined>;
    _stateSteps: Record<string, Game_State>;

    // max hp
    mhp: number;
    // max mp
    mmp: number;

    maxTp: () => number;

    gainHp: (hp: number) => void;
    setHp: (hp: number) => void;
    gainMp: (mp: number) => void;
    setMp: (mp: number) => void;
    gainTp: (tp: number) => void;
    setTp: (tp: number) => void;
    paySkillCost: (skill: Game_Skill) => void;
    addParam: (statIndex: number, amount: number) => void;
    addState: (stateId: number) => void;
    currentExp: () => number;
    gainExp: (exp: number) => void;
    clearStates: () => void;

    // injected

    _godModeInjected: boolean | undefined;
    _godMode: boolean;
    _godModeIntervalId: number | undefined;
    _gainHP_proxy: (hp: number) => void;
    _setHp_proxy: (hp: number) => void;
    _gainMp_proxy: (mp: number) => void;
    _setMp_proxy: (mp: number) => void;
    _gainTp_proxy: (tp: number) => void;
    _setTp_proxy: (tp: number) => void;
    _paySkillCost_proxy: (skill: Game_Skill) => void;
  }

  class Game_Player {
    x: number;
    y: number;
    _actorId: number;
    _characterName: string;
    _speedCheatInjected: boolean;
    _moveSpeed: number;
    direction: () => any;
    reserveTransfer: (
      mapId: number,
      x: number,
      y: number,
      direction: any,
      other: number,
    ) => void;
    setPosition: (x: number, y: number) => void;
  }

  class Game_Item {
    id: number;
    name: string;
  }

  class Game_Map_Info {
    id: number;
    name: string;
  }

  class Game_Map {
    mapId: () => number;
  }

  class Game_Message {
    _choices: string[];
    add: (message: string) => void;
    __add_proxy: (message: string) => void;
  }

  class Game_Party {
    _weapons: number[];
    _armors: number[];
    _items: number[];
    _gold: number;
    _through: boolean;
    gainItem: (item: Game_Item, amount: number) => void;
    gainGold: (amount: number) => void;
    allMembers: () => Game_Actor[];
  }

  class Game_Troop {
    members: () => Game_Actor[];
  }

  class Game_Variables {
    value: <T = any>(index: number) => T;
    setValue: <T = any>(index: number, value: T) => T;
  }

  class Game_Switches {
    value: (index: number) => boolean;
    setValue: (index: number, value: boolean) => boolean;
  }

  class Game_Actors {
    _data: Game_Actor[];
  }

  class Game_Weapon extends Game_Item {}

  class Game_Armor extends Game_Item {}

  class Data_System {
    gameTitle: string;
    switches: string[];
    variables: string[];
    terms: {
      params: string[];
    };
  }

  class DataManager {
    static loadGame(saveFieldId: number): any;

    static setupNewGame(): any;

    static saveGame(saveFieldId: number): any;
  }

  class SoundManager {
    static playSystemSound(soundIndex?: number): void;

    static _playSystemSound_proxy(soundIndex?: number): void;
  }

  class AudioManager {
    static _playBgm_proxy: typeof AudioManager.playBgm;
    static _playBgs_proxy: typeof AudioManager.playBgs;

    static playBgm(bgm: any, pos?: number): void;

    static playBgs(bgs: any, pos?: number): void;
  }

  class SceneManager {
    static updateScene: () => void;
  }
}

export class MVMZScriptGenerator implements ICheatScriptGenerator {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // noinspection JSUnusedLocalSymbols
  constructor(private readonly maker: IRPGMaker) {}

  openDevTools(): Script {
    // language=JavaScript
    return NewScript(`
      require('nw.gui').Window.get().showDevTools();
      SoundManager.playSystemSound(1);
    `);
  }

  setup(): Script {
    // language=JavaScript
    return NewScript(`
      AudioManager._playBgm_proxy = AudioManager.playBgm;
      AudioManager.playBgm = function (bgm, pos) {
        try {
          AudioManager._playBgm_proxy(bgm, pos);
        } catch (e) {
          console.error('error occurred while calling AudioManager.playBgm');
        }
      };

      AudioManager._playBgs_proxy = AudioManager.playBgs;
      AudioManager.playBgs = function (bgm, pos) {
        try {
          AudioManager._playBgs_proxy(bgm, pos);
        } catch (e) {
          console.error('error occurred while calling AudioManager.playBgs');
        }
      };

      SoundManager._playSystemSound_proxy = SoundManager.playSystemSound;
      SoundManager.playSystemSound = function (pos) {
        try {
          SoundManager._playSystemSound_proxy(pos);
        } catch (e) {
          console.error('error occurred while calling SoundManager.playSystemSound');
        }
      };
    `);
  }

  gainGold(gold: Gold): Script {
    // language=JavaScript
    return NewScript(`
      $gameParty.gainGold(${gold || 0});
      SoundManager.playSystemSound(1);
    `);
  }

  gainItem(it: ItemType, item: IItem, amount: number): Script {
    let itemListVariableName: "$dataItems" | "$dataWeapons" | "$dataArmors";
    switch (it) {
      case "item":
        itemListVariableName = "$dataItems";
        break;
      case "weapon":
        itemListVariableName = "$dataWeapons";
        break;
      case "armor":
        itemListVariableName = "$dataArmors";
        break;
      default:
        throw new Error(`Invalid item type: ${it}`);
    }

    // language=JavaScript
    return NewScript(`
      $gameParty.gainItem(${itemListVariableName}[${item.id}], ${amount});
      SoundManager.playSystemSound(1);
    `);
  }

  teleport(map: IMap, x: X, y: Y): Script {
    // language=JavaScript
    return NewScript(`
      $gamePlayer.reserveTransfer(${map.id}, ${x}, ${y}, $gamePlayer.direction(), 0);
      $gamePlayer.setPosition(${x}, ${y});
      SoundManager.playSystemSound(1);
    `);
  }

  saveGame(index: number): Script {
    // language=JavaScript
    return NewScript(`
      DataManager.saveGame(${index});
      SoundManager.playSystemSound(1);
    `);
  }

  saveGameInRoll(min: number, max: number): Script {
    min = Math.abs(min);
    max = Math.abs(max);

    if (min > max) {
      const tmp = max;
      max = min;
      min = tmp;
    }

    // language=JavaScript
    return NewScript(`
      DataManager._asCheatMenu_saveInRollMin = ${min};
      DataManager._asCheatMenu_saveInRollMax = ${max};
      
      if (
        !("_asCheatMenu_saveInRollCurrent" in DataManager) 
        || 
        isNaN(DataManager._asCheatMenu_saveInRollCurrent)
      ) {
        DataManager._asCheatMenu_saveInRollCurrent = 0;
      }

      if (
        DataManager._asCheatMenu_saveInRollCurrent < DataManager._asCheatMenu_saveInRollMin
        || 
        DataManager._asCheatMenu_saveInRollCurrent > DataManager._asCheatMenu_saveInRollMax
      ) {
        DataManager._asCheatMenu_saveInRollCurrent = DataManager._asCheatMenu_saveInRollMin;
      }
      
      DataManager.saveGame(DataManager._asCheatMenu_saveInRollCurrent++);
      SoundManager.playSystemSound(1);
    `);
  }

  saveGameWithTimestampAsName(): Script {
    // language=JavaScript
    return NewScript(`
      DataManager.saveGame(Date.now());
      SoundManager.playSystemSound(1);
    `);
  }

  speedHack(fps: number): Script {
    // language=JavaScript
    let script: Script = `
      clearInterval(SceneManager._speedHackIntervalId);
      SoundManager.playSystemSound(1);
    `;
    if (fps > 0) {
      // language=JavaScript
      script += `
        SceneManager._speedHackIntervalId = setInterval(function () {
          SceneManager.updateScene();
        }, 1000 / ${fps});
      `;
    }
    return NewScript(script);
  }

  setHMTP(
    tt: TeamType,
    aliveOrActor: boolean | IActor,
    hmtp: HMTP,
    value: HMTPValue,
  ): Script {
    let setFuncName: "setHp" | "setMp" | "setTp";
    let maxValueScript: "mhp" | "mmp" | "maxTp()";

    switch (hmtp) {
      case "hp":
        setFuncName = "setHp";
        maxValueScript = "mhp";
        break;
      case "mp":
        setFuncName = "setMp";
        maxValueScript = "mmp";
        break;
      case "tp":
        setFuncName = "setTp";
        maxValueScript = "maxTp()";
        break;
      default:
        throw new Error(`Invalid HMTP: ${hmtp}`);
    }

    let valueScript: Script;
    switch (value) {
      case "full":
        valueScript = `actor.${maxValueScript}`;
        break;
      case "half":
        valueScript = `actor._${hmtp} / 2`;
        break;
      case "0":
        valueScript = "0";
        break;
      case "1":
        valueScript = "1";
        break;
      default:
        valueScript = value.toString();
    }

    let actorsScript: Script;
    switch (tt) {
      case "alias":
        actorsScript = "$gameParty.allMembers()";
        break;
      case "enemy":
        actorsScript = "$gameTroop.members()";
        break;
      default:
        throw new Error(`Invalid team type: ${tt}`);
    }

    let interceptorScript: Script = "";
    if (typeof aliveOrActor === "boolean") {
      interceptorScript = `${aliveOrActor ? "if (actor._hp <= 0) continue;" : ""}`;
    } else {
      switch (tt) {
        case "alias":
          actorsScript = `[$gameParty.allMembers().find(function(a){ return a._actorId == ${aliveOrActor.id} })]`;
          break;
        case "enemy":
          actorsScript = `[$gameTroop.members().find(function(a){ return a._actorId == ${aliveOrActor.id} })]`;
          break;
      }
    }

    // language=JavaScript
    return NewScript(`
      var actors = ${actorsScript};
      for (var i = 0; i < actors.length; i++) {
        var actor = actors[i];
        if (!actor) continue;
        ${interceptorScript}
        actor.${setFuncName}(${valueScript});
      }
      SoundManager.playSystemSound(1);
    `);
  }

  setSwitch(sw: ISwitch, state: boolean): Script {
    // language=JavaScript
    return NewScript(`
      $gameSwitches.setValue(${sw.id}, ${state});
      SoundManager.playSystemSound(1);
    `);
  }

  setVariable(v: IVariable, value: VariableValue): Script {
    // language=JavaScript
    return NewScript(`
      if (typeof $gameVariables.value(${v.id}) == 'string') {
        $gameVariables.setValue(${v.id}, decodeURIComponent('${encodeURIComponent(value)}'));
      } else {
        $gameVariables.setValue(${v.id}, ${parseInt(`${value}`, 10) || 0});
      }
      SoundManager.playSystemSound(1);
    `);
  }

  gainExp(actorId: IActor["id"], exp: number): Script {
    // language=JavaScript
    return NewScript(`
      var members = $gameParty.allMembers();
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (m._actorId == ${actorId}) {
          m.gainExp(${exp});
          SoundManager.playSystemSound(1);
          break;
        }
      }
    `);
  }

  gainStatus(
    actorId: IActor["id"],
    statusId: IStatus["id"],
    value: number,
  ): Script {
    // language=JavaScript
    return NewScript(`
      var members = $gameParty.allMembers();
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (m._actorId == ${actorId}) {
          if (m._paramPlus[${statusId}] != undefined) {
            m.addParam(${statusId}, ${value});
            SoundManager.playSystemSound(1);
          } else {
            SoundManager.playSystemSound(2);
          }
          break;
        }
      }
    `);
  }

  clearState(actorId: IActor["id"]): Script {
    // language=JavaScript
    return NewScript(`
      var members = $gameParty.allMembers();
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (m._actorId == ${actorId}) {
          m.clearStates();
          SoundManager.playSystemSound(1);
          break;
        }
      }
    `);
  }
}

export class MVMZ implements IRPGMaker {
  private readonly sg: MVMZScriptGenerator;

  constructor() {
    this.sg = new MVMZScriptGenerator(this);
  }

  getVersionString(): string {
    return this.evaluate(
      // language=JavaScript
      NewScript(
        `return "NW v" + process.versions["nw"] + ", Node " + process.version + ", Chromium " + process.versions["chromium"];`,
      ),
    ) as string;
  }

  getTitle(generateIdenticalTitleIfEmpty?: boolean): string {
    if ($dataSystem?.gameTitle) {
      return $dataSystem.gameTitle;
    }

    if (generateIdenticalTitleIfEmpty) {
      return (
        (this.evaluate(
          // language=JavaScript
          NewScript(`
            return process.cwd();
          `),
        ) as string) || `${Date.now()}`
      );
    }

    return "";
  }

  setup(): void {
    this.evaluate(this.sg.setup());
  }

  playSound(positive?: boolean): void {
    // language=JavaScript
    this.evaluate(
      NewScript(`SoundManager.playSystemSound(${positive ? 1 : 2});`),
    );
  }

  getCurrentMap(): IMap | undefined {
    if (!$gameMap.mapId()) {
      return undefined;
    }
    return {
      id: $gameMap.mapId(),
      name: $dataMapInfos[$gameMap.mapId()]?.name,
    };
  }

  getEnemyList(): IActor[] {
    return $gameTroop.members().map((i) => ({
      id: i._actorId,
      name: i._name,
      x: 0,
      y: 0,
    }));
  }

  getAliasList(): IActor[] {
    return $gameParty.allMembers().map((i) => ({
      id: i._actorId,
      name: i._name,
      x: 0,
      y: 0,
    }));
  }

  getGold(): Gold {
    return $gameParty._gold;
  }

  getHero(): IActor {
    const heroActor = $gameParty
      .allMembers()
      .find((i) => i._characterName === $gamePlayer._characterName);
    return {
      id: heroActor?._actorId || 0,
      name: heroActor?._name || "-",
      x: $gamePlayer.x,
      y: $gamePlayer.y,
    };
  }

  getItemList(it: ItemType): IItem[] {
    let itemList: Game_Item[];
    switch (it) {
      case "item":
        itemList = $dataItems;
        break;
      case "weapon":
        itemList = $dataWeapons;
        break;
      case "armor":
        itemList = $dataArmors;
        break;
      default:
        throw new Error(`Invalid item type: ${it}`);
    }
    return itemList.filter(Boolean).map((i) => ({
      id: i.id,
      name: i.name,
      type: it,
      amount: $gameParty[`_${it}s`][i.id],
    }));
  }

  getMapList(): IMap[] {
    try {
      return $dataMapInfos.filter(Boolean).map((i) => ({
        id: i.id,
        name: i.name,
      }));
    } catch (e) {
      console.log("Error occurred while getting map list:", e);
      return [];
    }
  }

  getSwitchList(): ISwitch[] {
    try {
      return $dataSystem.switches.map((i, index) => ({
        id: index,
        name: i,
        state: $gameSwitches.value(index),
      }));
    } catch (e) {
      console.log("Error occurred while getting switch list:", e);
      return [];
    }
  }

  getVariableList(): IVariable[] {
    try {
      return $dataSystem.variables.map((i, index) => ({
        id: index,
        name: i,
        value: $gameVariables.value(index),
      }));
    } catch (e) {
      console.log("Error occurred while getting variable list:", e);
      return [];
    }
  }

  getStatusList(actorId: IActor["id"]): IStatus[] {
    const actor = $gameActors._data[actorId];
    if (!actor?._paramPlus.length) {
      return [];
    }

    return actor._paramPlus.map((i, index) => ({
      id: index,
      name: $dataSystem.terms.params[index],
      value: i,
    }));
  }

  getScriptGenerator(): ICheatScriptGenerator {
    return this.sg;
  }

  evaluate(script: Script): unknown {
    try {
      return new Function(script)();
    } catch (e) {
      console.error("Error occurred while evaluating script:", script, e);
      return undefined;
    }
  }
}
