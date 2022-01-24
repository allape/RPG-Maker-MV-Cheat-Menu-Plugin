import MV from '../core/mv'
import XPBasedModule from '../component/mv/XPBasedModule'

export default class PartyHP extends XPBasedModule {

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

}
