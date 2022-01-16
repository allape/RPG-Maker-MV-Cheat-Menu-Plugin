import DualFSSWithAA from '../component/mv/DualFSSWithAA'
import StatSelector, {IStat} from '../component/mv/StatSelector'
import ActorSelector from '../component/mv/ActorSelector'
import AmountSelector from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'
import MV from '../core/mv'

export default class Stat extends DualFSSWithAA<Game_Actor, IStat> {

  static MyName = 'Stats'

  protected readonly amountProvider = (f: Game_Actor, s: IStat) => {
    return f && s ? f._paramPlus[s.index] : undefined
  }

  protected readonly scrollSelector = new ActorSelector({
    onChange: this._triggerValueChange,
  })
  protected readonly secondScrollSelector = new StatSelector({
    onChange: this._triggerValueChange,
  })
  protected readonly amountSelector = new AmountSelector({
    default: 100,
    precision: 0,
    min: 1,
    max: 9999,
  })
  protected readonly currentAmountSelector = new AmountSelector({
    precision: 0,
    readOnly: true,
    keymap: ScrollSelect.KeyMap78,
    onLess: () => {
      const actor = this.first
      const stat = this.second
      if (actor && stat) {
        MV.opeStatAmount(actor, stat.index, -this.amountSelector.value)
        this._triggerValueChange()
      }
      return true
    },
    onMore: () => {
      const actor = this.first
      const stat = this.second
      if (actor && stat) {
        MV.opeStatAmount(actor, stat.index, this.amountSelector.value)
        this._triggerValueChange()
      }
      return true
    },
  })

}
