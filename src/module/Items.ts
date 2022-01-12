import ItemSelector from '../component/mv/ItemSelector'
import ItemBaseModule from '../component/mv/ItemBaseModule'

export default class Items extends ItemBaseModule<Game_Item> {

  static MyName = 'Items'

  protected readonly scrollSelector = new ItemSelector({
    onChange: () => {
      this._triggerValueChange()
    },
  })

  protected readonly currentAmountProvider = (current: Game_Item) => $gameParty._items[$dataItems.indexOf(current)]

  protected readonly onLess = () => {
    const current = this.scrollSelector.value
    if (current) {
      $gameParty.gainItem(current, -this.amountSelector.value)
      this._triggerValueChange()
    }
    return true
  }

  protected readonly onMore = () => {
    const current = this.scrollSelector.value
    if (current) {
      $gameParty.gainItem(current, this.amountSelector.value)
      this._triggerValueChange()
    }
    return true
  }
  
  constructor() {
    super()
  }

}
