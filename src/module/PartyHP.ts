import MV from '../core/mv'
import PBasedModule from '../component/mv/PBasedModule'

export default class PartyHP extends PBasedModule {

  static MyName = 'Party HP'

  constructor() {
    super({
      name: PartyHP.MyName,
      onAliveTo0: () => {
        MV.setPartyHp(0, true)
      },
      onAliveTo1: () => {
        MV.setPartyHp(1, true)
      },
      onAlive2Max: () => {
        MV.recoverPartyHp(true)
      },
      onAllTo0: () => {
        MV.setPartyHp(0, false)
      },
      onAllTo1: () => {
        MV.setPartyHp(1, false)
      },
      onAll2Max: () => {
        MV.recoverPartyHp(false)
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
