import AmountSelector from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'
import ItemSelector from '../component/mv/ItemSelector'
import FSSWithAA from '../component/mv/FSSWithAA'

export default class Items extends FSSWithAA<Game_Item> {

  static MyName = 'Items'

  static VALUE_FN = (current: Game_Item) => $gameParty._items[$dataItems.indexOf(current)]

  protected readonly scrollSelector = new ItemSelector({
    onChange: () => {
      this._triggerValueChange()
    },
  })

  protected readonly amountSelector = new AmountSelector({
    default: 1,
    precision: 0,
    min: 1,
    max: 99,
  })

  protected readonly currentAmountSelector = new AmountSelector({
    precision: 0,
    readOnly: true,
    keymap: ScrollSelect.KeyMap78,
    onLess: () => {
      const current = this.scrollSelector.value
      if (current) {
        $gameParty.gainItem(current, -this.amountSelector.value)
        this._triggerValueChange()
      }
      return true
    },
    onMore: () => {
      const current = this.scrollSelector.value
      if (current) {
        $gameParty.gainItem(current, this.amountSelector.value)
        this._triggerValueChange()
      }
      return true
    },
  })
  
  constructor() {
    super({
      currentAmountProvider: Items.VALUE_FN,
      enableValueIntervalRefresh: true,
    })
  }

}
