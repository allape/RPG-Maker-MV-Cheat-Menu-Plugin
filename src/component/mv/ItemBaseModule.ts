import AmountSelector from '../AmountSelector'
import ScrollSelect from '../ScrollSelect'
import FSSWithAA from './FSSWithAA'

export default abstract class ItemBaseModule<T extends Game_Item = Game_Item> extends FSSWithAA<T> {

  protected readonly onLess = () => {
    const current = this.current
    if (current) {
      $gameParty.gainItem(current, -this.amountSelector.value)
      this._triggerValueChange()
    }
    return true
  }

  protected readonly onMore = () => {
    const current = this.current
    if (current) {
      $gameParty.gainItem(current, this.amountSelector.value)
      this._triggerValueChange()
    }
    return true
  }

  protected readonly amountSelector = new AmountSelector({
    default: 10,
    precision: 0,
    min: 1,
    max: 99,
  })

  protected readonly currentAmountSelector = new AmountSelector({
    precision: 0,
    readOnly: true,
    keymap: ScrollSelect.KeyMap78,
    onLess: () => this.onLess(),
    onMore: () => this.onMore(),
  })

  protected constructor() {
    super()
  }

}
