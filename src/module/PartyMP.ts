import MV from '../core/mv'
import PBasedModule from '../component/mv/PBasedModule'

export default class PartyMP extends PBasedModule {

  static MyName = 'Party MP'

  constructor() {
    super({
      name: PartyMP.MyName,
      onAliveTo0: () => {
        MV.setPartyMp(0, true)
      },
      onAliveTo1: () => {
        MV.setPartyMp(1, true)
      },
      onAlive2Max: () => {
        MV.recoverPartyMp(true)
      },
      onAllTo0: () => {
        MV.setPartyMp(0, false)
      },
      onAllTo1: () => {
        MV.setPartyMp(1, false)
      },
      onAll2Max: () => {
        MV.recoverPartyMp(false)
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
