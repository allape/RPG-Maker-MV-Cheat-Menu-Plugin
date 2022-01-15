import MV from '../core/mv'
import PBasedModule from '../component/mv/PBasedModule'

export default class EnemyHP extends PBasedModule {

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

  dispose() {
    super.dispose()
  }

  render(): HTMLDivElement {
    return super.render()
  }

}
