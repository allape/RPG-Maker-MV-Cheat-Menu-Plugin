/* eslint-disable @typescript-eslint/no-explicit-any */
// noinspection JSUnusedGlobalSymbols

import MV from './core/mv'

export {}

declare global {
  interface Window {
    __hookedMV: MV
    __cheat_speed?: number
    __cheat_speedLocked?: boolean
    __guaranteed_intervals?: Record<string, number[]>
  }

  const nw: any

  const $gameActors: Game_Actors

  const $gamePlayer: Game_Player

  const $gameParty: Game_Party

  const $gameTroop: Game_Troop

  const $gameSystem: Record<string, any>

  const $gameVariables: Game_Variables

  const $gameSwitches: Game_Switches

  const $gameMap: Game_Map

  const $gameMessage: Game_Message

  const $dataStates: Game_State[]

  const $dataSystem: Data_System

  const $dataWeapons: Game_Weapon[]

  const $dataArmors: Game_Weapon[]

  const $dataItems: Game_Item[]

  const $dataMapInfos: Game_Map_Info[]

  class Game_Skill {

  }

  class Game_State {
    id: number
  }

  class Game_Actor {
    _name: string
    _hp: number
    _mp: number
    _tp: number
    _paramPlus: number[]
    _states: Array<Game_State | null | undefined>
    _stateSteps: Record<string, Game_State>

    // max hp
    mhp: number
    // max mp
    mmp: number

    maxTp: () => number

    gainHp: (hp: number) => void
    setHp: (hp: number) => void
    gainMp: (mp: number) => void
    setMp: (mp: number) => void
    gainTp: (tp: number) => void
    setTp: (tp: number) => void
    paySkillCost: (skill: Game_Skill) => void
    addParam: (statIndex: number, amount: number) => void
    currentExp: () => number
    gainExp: (exp: number) => void
    clearStates: () => void

    // injected

    _godModeInjected: boolean | undefined
    _godMode: boolean
    _godModeIntervalId: number | undefined
    _gainHP_proxy: (hp: number) => void
    _setHp_proxy: (hp: number) => void
    _gainMp_proxy: (mp: number) => void
    _setMp_proxy: (mp: number) => void
    _gainTp_proxy: (tp: number) => void
    _setTp_proxy: (tp: number) => void
    _paySkillCost_proxy: (skill: Game_Skill) => void
  }

  class Game_Player {
    x: number
    y: number
    _speedCheatInjected: boolean
    _moveSpeed: number
    direction: () => any
    reserveTransfer: (mapId: number, x: number, y: number, direction: any, other: number) => void
    setPosition: (x: number, y: number) => void
  }

  class Game_Item {
    name: string
  }

  class Game_Map_Info {
    name: string
  }

  class Game_Map {
    mapId: () => number
  }

  class Game_Message {
    _choices: string[]
    add: (message: string) => void
    __add_proxy: (message: string) => void
  }

  class Game_Party {
    _weapons: number[]
    _armors: number[]
    _items: number[]
    _gold: number
    _through: boolean
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

  class Game_Switches {
    value: (index: number) => boolean
    setValue: (index: number, value: boolean) => boolean
  }

  class Game_Actors {
    _data: Game_Actor[]
  }

  class Game_Weapon extends Game_Item {}

  class Game_Armor extends Game_Item {}

  class Data_System {
    switches: string[]
    variables: string[]
    terms: {
      params: string[]
    }
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

  class AudioManager {
    static _playBgm_proxy: typeof AudioManager.playBgm
    static _playBgs_proxy: typeof AudioManager.playBgs
    static playBgm(bgm: any, pos?: number): void
    static playBgs(bgs: any, pos?: number): void
  }

  class SceneManager {
    static updateScene: () => void
  }
}

export type LoadGame = typeof DataManager.loadGame
export type SetupNewGame = typeof DataManager.setupNewGame
export type SaveGame = typeof DataManager.saveGame

