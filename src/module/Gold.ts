import {Renderer} from '../core/renderer'
import ScrollSelect from '../component/ScrollSelect'
import AmountSelector from '../component/AmountSelector'
import {div} from '../core/dom'

export default class Gold extends Renderer<HTMLDivElement> {

  static MyName = 'Gold'

  private readonly amount: AmountSelector
  private readonly currentAmount: AmountSelector

  private readonly _intervalId: number

  private readonly _onGoldChange = () => {
    this.currentAmount.value = $gameParty._gold
  }

  constructor() {
    super()

    this.amount = new AmountSelector({
      precision: 0,
      min: 1,
      max: 99999999,
      default: 10000,
      keymap: ScrollSelect.KeyMap34,
    })
    this.currentAmount = new AmountSelector({
      readOnly: true,
      keymap: ScrollSelect.KeyMap56,
      onLess: () => {
        $gameParty.gainGold(-this.amount.value)
        this._onGoldChange()
        return true
      },
      onMore: () => {
        $gameParty.gainGold(this.amount.value)
        this._onGoldChange()
        return true
      },
    })

    this._intervalId = setInterval(() => {
      this._onGoldChange()
    }, 100) as unknown as number
  }

  dispose() {
    super.dispose()

    this.amount.dispose()
    this.currentAmount.dispose()

    clearInterval(this._intervalId)
  }

  render(): HTMLDivElement {
    const container = div()
    container.append(this.amount.render())
    container.append(this.currentAmount.render())

    this._onGoldChange()

    return container
  }

}
