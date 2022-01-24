import MV from '../core/mv'
import XPBasedModule from '../component/mv/XPBasedModule'

export default class EnemyHP extends XPBasedModule {

  static MyName = 'Enemy HP'

  constructor() {
    super({
      name: EnemyHP.MyName,
      onAliveTo0: () => {
        MV.setEnemyHp(0, true)
      },
      onAliveTo1: () => {
        MV.setEnemyHp(1, true)
      },
      onAlive2Max: () => {
        MV.recoverEnemyHp(true)
      },
      onAllTo0: () => {
        MV.setEnemyHp(0, false)
      },
      onAllTo1: () => {
        MV.setEnemyHp(1, false)
      },
      onAll2Max: () => {
        MV.recoverEnemyHp(false)
      },
    })
  }

}
