import MV from '../core/mv'
import XPBaseModule from '../component/mv/XPBaseModule'

export default class PartyMP extends XPBaseModule {

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
      onAlive2Half: () => {
        MV.setPartyMpHalf(true)
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
      onAll2Half: () => {
        MV.setPartyMpHalf(false)
      },
      onAll2Max: () => {
        MV.recoverPartyMp(false)
      },
    })
  }

}
