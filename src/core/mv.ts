import {LoadGame, SaveGame, SetupNewGame} from '../mv'

export default class MV {

  /**
   * 全局对象: 是否显示作弊器
   */
  visible: boolean = false

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

}
