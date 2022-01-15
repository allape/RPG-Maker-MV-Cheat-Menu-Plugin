import MV from './core/mv'

export {}

declare global {
  interface Window {
    __hookedMV: MV
  }

  const nw: any

  const $gameActors: Game_Actors

  const $gamePlayer: Game_Player

  const $gameParty: Game_Party

  const $gameTroop: Game_Troop

  const $gameSystem: Record<string, any>

  const $gameVariables: Game_Variables

  const $dataSystem: Data_System

  const $dataItems: Game_Item[]

  class Game_Skill {

  }

  class Game_Actor {
    _name: string
    _hp: number
    _mp: number
    _tp: number

    // max hp
    mhp: number
    // max mp
    mmp: number

    maxTp: () => number

    gainHp: (hp: number) => void;
    setHp: (hp: number) => void;
    gainMp: (mp: number) => void;
    setMp: (mp: number) => void;
    gainTp: (tp: number) => void;
    setTp: (tp: number) => void;
    paySkillCost: (skill: Game_Skill) => void;

    // injected

    _godModeInjected: boolean | undefined
    _godMode: boolean
    _godModeIntervalId: number | undefined
    _gainHP_proxy: (hp: number) => void;
    _setHp_proxy: (hp: number) => void;
    _gainMp_proxy: (mp: number) => void;
    _setMp_proxy: (mp: number) => void;
    _gainTp_proxy: (tp: number) => void;
    _setTp_proxy: (tp: number) => void;
    _paySkillCost_proxy: (skill: Game_Skill) => void;
  }

  class Game_Player {
    _speedCheatInjected: boolean
    _moveSpeed: number
  }

  class Game_Item {
    name: string
  }

  class Game_Party {
    _items: number[]
    _gold: number
    gainItem: (item: Game_Item, amount: number) => void
    gainGold: (amount: number) => void
    allMembers: () => Game_Actor[]
  }

  class Game_Troop {
    members: () => Game_Actor[]
  }

  class Game_Variables {
    value: <T = any>(index: number) => T
    setValue: <T = any>(index: number, value: T) => T
  }

  class Game_Actors {
    _data: Game_Actor[]
  }

  class Data_System {
    variables: Array<string | undefined>
  }

  class DataManager {
    static loadGame(saveFieldId: number): any
    static setupNewGame(): any
    static saveGame(saveFieldId: number): any

    static _hookInjected: boolean
    static _loadGame_proxy: LoadGame
    static _setupNewGame_proxy: SetupNewGame
    static _saveGame_proxy: SaveGame
  }

  class SoundManager {
    static playSystemSound(soundIndex?: number): void
  }
}

export type LoadGame = typeof DataManager.loadGame
export type SetupNewGame = typeof DataManager.setupNewGame
export type SaveGame = typeof DataManager.saveGame

