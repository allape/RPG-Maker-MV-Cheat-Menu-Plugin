import MV from '../core/mv'
import XPBaseModule from '../component/mv/XPBaseModule'

export default class PartyHP extends XPBaseModule {

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
      onAlive2Half: () => {
        MV.setPartyHpHalf(true)
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
      onAll2Half: () => {
        MV.setPartyHpHalf(false)
      },
      onAll2Max: () => {
        MV.recoverPartyHp(false)
      },
    })
  }

}
