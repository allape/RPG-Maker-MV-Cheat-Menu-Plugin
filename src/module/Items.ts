import {Renderer} from '../core/renderer'
import AmountSelector from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'
import ItemSelector from '../component/mv/ItemSelector'

export default class Items extends Renderer<HTMLDivElement> {

  static MyName = 'Items'

  static KeyMap = ScrollSelect.KeyMap34

  private readonly container = document.createElement('div')
  private readonly item = new ItemSelector()
  private readonly amount: AmountSelector
  private readonly currentAmount: AmountSelector

  private readonly _itemAmountRefreshIntervalId: number

  private get current(): Game_Item {
    return this.item.value
  }

  constructor() {
    super()

    this.amount = new AmountSelector({
      default: 1,
      precision: 0,
      min: 1,
      max: 99,
    })

    this.currentAmount = new AmountSelector({
      precision: 0,
      readOnly: true,
      keymap: ScrollSelect.KeyMap78,
      onLess: () => {
        const current = this.current
        if (current) {
          $gameParty.gainItem(current, -this.amount.value);
        }
        return true
      },
      onMore: () => {
        const current = this.current
        if (current) {
          $gameParty.gainItem(current, this.amount.value);
        }
        return true
      },
    })

    this._itemAmountRefreshIntervalId = setInterval(() => {
      const current = this.current
      if (current) {
        this.currentAmount.value = $gameParty._items[$dataItems.indexOf(current)]
      }
    }, 100) as unknown as number
  }

  dispose() {
    super.dispose()

    this.item.dispose()
    this.amount.dispose()

    clearInterval(this._itemAmountRefreshIntervalId)
  }

  render(): HTMLDivElement {
    const {container, item, amount, currentAmount} = this

    container.append(item.render())
    container.append(amount.render())
    container.append(currentAmount.render())

    return container
  }

}
