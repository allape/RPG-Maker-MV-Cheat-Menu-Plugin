import AmountSelector from '../AmountSelector'
import ScrollSelect from '../ScrollSelect'
import FSSWithAA from './FSSWithAA'

export default abstract class ItemBaseModule<T> extends FSSWithAA<T> {

  protected readonly abstract onLess: () => void | boolean
  protected readonly abstract onMore: () => void | boolean

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
