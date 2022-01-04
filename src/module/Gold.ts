import {Renderer} from '../core/renderer'
import RowSelect from '../component/ScrollSelect'
import AmountSelector from '../component/AmountSelector'

export default class Gold extends Renderer<HTMLDivElement> {

  static MyName = 'Gold'

  private readonly amount: AmountSelector
  private readonly currentAmount: AmountSelector

  private readonly _intervalId: number

  constructor() {
    super()

    this.amount = new AmountSelector({
      precision: 0,
      min: 1,
      max: 99999999,
      default: 1,
      keymap: RowSelect.KeyMap34,
    })
    this.currentAmount = new AmountSelector({
      readOnly: true,
      keymap: RowSelect.KeyMap56,
      onLess: () => {
        $gameParty.gainGold(-this.amount.value)
        return true
      },
      onMore: () => {
        $gameParty.gainGold(this.amount.value)
        return true
      },
    })

    this._intervalId = setInterval(() => {
      this.currentAmount.value = $gameParty._gold
    }, 100) as unknown as number
  }

  dispose() {
    super.dispose()

    this.amount.dispose()
    this.currentAmount.dispose()

    clearInterval(this._intervalId)
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')
    container.append(this.amount.render())
    container.append(this.currentAmount.render())
    return container
  }

}
