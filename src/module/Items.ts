import ItemSelector from '../component/mv/ItemSelector'
import ItemBaseModule from '../component/mv/ItemBaseModule'

export default class Items extends ItemBaseModule<Game_Item> {

  static MyName = 'Items'

  protected readonly scrollSelector = new ItemSelector({
    onChange: this._triggerValueChange,
  })

  protected readonly currentAmountProvider =
    (current?: Game_Item) => current ? $gameParty._items[$dataItems.indexOf(current)] : undefined

}
