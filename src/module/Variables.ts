import Input from '../component/Input'
import ScrollSelect from '../component/ScrollSelect'
import AmountSelector from '../component/AmountSelector'
import MV from '../core/mv'
import VariableSelector, { IVariable } from '../component/mv/VariableSelector'
import FSSWithAA from '../component/mv/FSSWithAA'

export default class Variables extends FSSWithAA<IVariable> {

  static MyName = 'Variables'

  protected readonly currentAmountProvider =
    (current: IVariable) => current ? $gameVariables.value(current.index) : undefined

  protected readonly scrollSelector = new VariableSelector({
    onChange: this._triggerValueChange,
  })

  protected readonly amountSelector = new AmountSelector({
    default: 1,
    precision: 0,
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
  })

  private readonly currentAmountValue = new Input({
    type: 'textarea',
  })

  protected readonly currentAmountSelector

  constructor() {
    super()

    const value = this.currentAmountValue.render() as HTMLTextAreaElement
    value.addEventListener('change', () => {
      const variable = this.scrollSelector.value
      if (variable) {
        MV.setVariable(variable.index, this.currentAmountValue.value)
        this._triggerValueChange()
      }
    })
    value.rows = 5

    this.currentAmountSelector = new ScrollSelect({
      leftText: AmountSelector.DEFAULT_LESS_ARROW,
      rightText: AmountSelector.DEFAULT_MORE_ARROW,
      center: value,
      keymap: ScrollSelect.KeyMap78,
      valueProvider: value => {
        this.currentAmountValue.value = value
      },
      onLeft: () => {
        const current = this.current
        if (current) {
          MV.setNumberVariable(current.index, -this.amountSelector.value)
          this._triggerValueChange()
        }
      },
      onRight: () => {
        const current = this.current
        if (current) {
          MV.setNumberVariable(current.index, this.amountSelector.value)
          this._triggerValueChange()
        }
      },
    })
  }

  dispose() {
    super.dispose()
    this.currentAmountValue.dispose()
  }

}
