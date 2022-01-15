import MV from '../core/mv'
import PBasedModule from '../component/mv/PBasedModule'

export default class PartyTP extends PBasedModule {

  static MyName = 'Party TP'

  constructor() {
    super({
      name: PartyTP.MyName,
      onAliveTo0: () => {
        MV.setPartyTp(0, true)
      },
      onAliveTo1: () => {
        MV.setPartyTp(1, true)
      },
      onAlive2Max: () => {
        MV.recoverPartyTp(true)
      },
      onAllTo0: () => {
        MV.setPartyTp(0, false)
      },
      onAllTo1: () => {
        MV.setPartyTp(1, false)
      },
      onAll2Max: () => {
        MV.recoverPartyTp(false)
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
