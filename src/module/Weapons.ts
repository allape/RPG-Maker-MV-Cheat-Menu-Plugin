import ItemBaseModule from '../component/mv/ItemBaseModule'
import WeaponSelector from '../component/mv/WeaponSelector'

export default class Weapons extends ItemBaseModule<Game_Weapon> {

  static MyName = 'Weapons'

  protected readonly scrollSelector = new WeaponSelector({
    onChange: this._triggerValueChange,
  })

  protected readonly currentAmountProvider =
    (current: Game_Weapon) => current ? $gameParty._weapons[$dataWeapons.indexOf(current)] : undefined

}
