import MV from '../core/mv'
import XPBasedModule from '../component/mv/XPBasedModule'

export default class PartyTP extends XPBasedModule {

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

}
