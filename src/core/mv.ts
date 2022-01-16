import {LoadGame, SaveGame, SetupNewGame} from '../mv'

export default class MV {

  /**
   * 全局对象: 是否显示作弊器
   */
  visible = false

  private readonly _loadGameQueue: LoadGame[] = []
  private readonly _setupNewGameQueue: SetupNewGame[] = []
  private readonly _saveGameQueue: SaveGame[] = []

  private constructor() {
    this._injectHooks()
  }

  private _injectHooks() {
    if (DataManager._hookInjected) {
      return
    }

    DataManager._hookInjected = true

    DataManager._loadGame_proxy = DataManager.loadGame
    DataManager.loadGame = (saveFieldId) => {
      try {
        this._loadGameQueue.forEach(fn => {
          try {
            fn(saveFieldId)
          } catch (e) {
            console.error('error in call load game fn:', e)
          }
        })
      } catch (e) {
        console.error('error in call load game queue:', e)
      }
      return DataManager._loadGame_proxy(saveFieldId)
    }

    DataManager._setupNewGame_proxy = DataManager.setupNewGame
    DataManager.setupNewGame = () => {
      try {
        this._setupNewGameQueue.forEach(fn => {
          try {
            fn()
          } catch (e) {
            console.error('error in call setup new game fn:', e)
          }
        })
      } catch (e) {
        console.error('error in call setup new game queue:', e)
      }
      return DataManager._setupNewGame_proxy()
    }

    DataManager._saveGame_proxy = DataManager.saveGame
    DataManager.saveGame = (saveFieldId) => {
      try {
        this._saveGameQueue.forEach(fn => {
          try {
            fn(saveFieldId)
          } catch (e) {
            console.error('error in call save game fn:', e)
          }
        })
      } catch (e) {
        console.error('error in call save game queue:', e)
      }
      return DataManager._saveGame_proxy(saveFieldId)
    }
  }

  on(name: 'loadGame' | 'setupNewGame' | 'saveGame', fn: LoadGame | SetupNewGame | SaveGame): void {
    switch (name) {
    case 'loadGame': this._loadGameQueue.push(fn); break
    case 'setupNewGame': this._setupNewGameQueue.push(fn as SetupNewGame); break
    case 'saveGame': this._saveGameQueue.push(fn); break
    }
  }

  off(name: 'loadGame' | 'setupNewGame' | 'saveGame', fn: LoadGame | SetupNewGame | SaveGame): void {
    switch (name) {
    case 'loadGame': MV._removeFromArray(this._loadGameQueue, fn); break
    case 'setupNewGame': MV._removeFromArray(this._setupNewGameQueue, fn as SetupNewGame); break
    case 'saveGame': MV._removeFromArray(this._saveGameQueue, fn); break
    }
  }

  private static  _removeFromArray<T>(arr: T[] , t: T): void {
    const index = arr.indexOf(t)
    if (index !== -1) arr.splice(index, 1)
  }

  static singleton() {
    window.__hookedMV = window.__hookedMV || new MV()
    return window.__hookedMV
  }

  static injectGod(actor: Game_Actor) {
    if (!actor._godModeInjected) {
      try {
        actor._godModeInjected = true

        actor._gainHP_proxy = actor.gainHp
        actor.gainHp = (hp) => {
          actor._gainHP_proxy(actor._godMode ? actor.mhp : hp)
        }

        actor._setHp_proxy = actor.setHp
        actor.setHp = (hp) => {
          actor._setHp_proxy(actor._godMode ? actor.mhp : hp)
        }

        actor._gainMp_proxy = actor.gainMp
        actor.gainMp = (mp) => {
          actor._gainMp_proxy(actor._godMode ? actor.mmp : mp)
        }

        actor._setMp_proxy = actor.setMp
        actor.setMp = (mp) => {
          actor._setMp_proxy(actor._godMode ? actor.mmp : mp)
        }

        actor._gainTp_proxy = actor.gainTp
        actor.gainTp = (tp) => {
          actor._gainTp_proxy(actor._godMode ? actor.maxTp() : tp)
        }

        actor._setTp_proxy = actor.setTp
        actor.setTp = (tp) => {
          actor._setTp_proxy(actor._godMode ? actor.maxTp() : tp)
        }

        actor._paySkillCost_proxy = actor.paySkillCost
        actor.paySkillCost = (skill) => {
          if (!actor._godMode) {
            actor._paySkillCost_proxy(skill)
          }
        }
      } catch (e) {
        console.error(`unable to turn on god mode for: ${actor._name},`, e)
      }
    }
  }

  static setNumberVariable(varId: number, offsetValue: number) {
    try {
      const oldValue = $gameVariables.value(varId)
      if (isNaN(oldValue)) {
        $gameVariables.setValue(varId, offsetValue)
      } else {
        $gameVariables.setValue(varId, oldValue + offsetValue)
      }
    } catch (e) {
      console.error('error to set value for', varId, 'with', e)
    }
  }

  static setVariable(varId: number, value: number | string | unknown) {
    try {
      $gameVariables.setValue(varId, value)
    } catch (e) {
      console.error('error to set value for', varId, 'with', e)
    }
  }

  static setPartyHp(hp: number, alive = false) {
    for (const member of $gameParty.allMembers()) {
      if ((alive && member._hp !== 0) || !alive) {
        member.setHp(hp)
      }
    }
  }

  static recoverPartyHp(alive = false) {
    for (const member of $gameParty.allMembers()) {
      if ((alive && member._hp !== 0) || !alive) {
        member.setHp(member.mhp)
      }
    }
  }

  static setPartyMp(mp: number, alive = false) {
    for (const member of $gameParty.allMembers()) {
      if ((alive && member._hp !== 0) || !alive) {
        member.setMp(mp)
      }
    }
  }

  static recoverPartyMp(alive = false) {
    for (const member of $gameParty.allMembers()) {
      if ((alive && member._hp !== 0) || !alive) {
        member.setMp(member.mmp)
      }
    }
  }

  static setPartyTp(tp: number, alive = false) {
    for (const member of $gameParty.allMembers()) {
      if ((alive && member._hp !== 0) || !alive) {
        member.setTp(tp)
      }
    }
  }

  static recoverPartyTp(alive = false) {
    for (const member of $gameParty.allMembers()) {
      if ((alive && member._hp !== 0) || !alive) {
        member.setTp(member.maxTp())
      }
    }
  }

  static setEnemyHp(hp: number, alive = false) {
    for (const member of $gameTroop.members()) {
      if ((alive && member._hp !== 0) || !alive) {
        member.setHp(hp)
      }
    }
  }

  static recoverEnemyHp(alive = false) {
    for (const member of $gameTroop.members()) {
      if ((alive && member._hp !== 0) || !alive) {
        member.setHp(member.mhp)
      }
    }
  }

  static opeStatAmount(actor: Game_Actor, statIndex: number, amount: number) {
    if (actor._paramPlus[statIndex] !== undefined) {
      actor.addParam(statIndex, amount)
    }
  }

}
