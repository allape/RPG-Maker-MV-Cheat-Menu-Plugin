import MV from '../core/mv'
import XPBaseModule from '../component/mv/XPBaseModule'

export default class PartyTP extends XPBaseModule {

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
      onAlive2Half: () => {
        MV.setPartyTpHalf(true)
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
      onAll2Half: () => {
        MV.setPartyTpHalf(false)
      },
      onAll2Max: () => {
        MV.recoverPartyTp(false)
      },
    })
  }

}
