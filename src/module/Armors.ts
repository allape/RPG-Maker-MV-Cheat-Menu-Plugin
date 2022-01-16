import ItemBaseModule from '../component/mv/ItemBaseModule'
import ArmorSelector from '../component/mv/ArmorSelector'

export default class Armors extends ItemBaseModule<Game_Weapon> {

  static MyName = 'Armors'

  protected readonly scrollSelector = new ArmorSelector({
    onChange: this._triggerValueChange,
  })

  protected readonly currentAmountProvider =
    (current: Game_Weapon) => current ? $gameParty._armors[$dataArmors.indexOf(current)] : undefined

  constructor() {
    super()
  }

}
