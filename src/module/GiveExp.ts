import ActorSelector from '../component/mv/ActorSelector'
import FSSWithAA from '../component/mv/FSSWithAA'
import AmountSelector from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'

export default class GiveExp extends FSSWithAA<Game_Actor> {

  static MyName = 'Give Exp'

  protected readonly currentAmountProvider =
    (current: Game_Actor) => current?.currentExp()

  protected readonly scrollSelector = new ActorSelector({
    onChange: this._triggerValueChange,
  })

  protected readonly amountSelector = new AmountSelector({
    default: 1000,
    precision: 0,
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
  })

  protected readonly currentAmountSelector = new AmountSelector({
    precision: 0,
    readOnly: true,
    keymap: ScrollSelect.KeyMap78,
    onLess: () => {
      const current = this.current
      if (current) {
        current.gainExp(-this.amountSelector.value)
        this._triggerValueChange()
      }
      return true
    },
    onMore: () => {
      const current = this.current
      if (current) {
        current.gainExp(this.amountSelector.value)
        this._triggerValueChange()
      }
      return true
    },
  })

}
