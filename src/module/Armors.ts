import ItemBaseModule from '../component/mv/ItemBaseModule'
import ArmorSelector from '../component/mv/ArmorSelector'

export default class Armors extends ItemBaseModule<Game_Armor> {

  static MyName = 'Armors'

  protected readonly scrollSelector = new ArmorSelector({
    onChange: this._triggerValueChange,
  })

  protected readonly currentAmountProvider =
    (current: Game_Armor) => current ? $gameParty._armors[$dataArmors.indexOf(current)] : undefined

  constructor() {
    super()
  }

}
