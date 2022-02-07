import {Renderer} from '../core/renderer'
import Switch from '../component/Switch'
import SwitchSelector from '../component/mv/SwitchSelector'

export default class Switches extends Renderer<HTMLDivElement> {
  static MyName = 'Switches'

  private readonly _triggerOnChange = () => {
    const current = this.switchSelector?.value
    if (current) {
      this.switch.value = $gameSwitches.value(current.index)
    }
  }

  private readonly switchSelector = new SwitchSelector({
    onChange: this._triggerOnChange,
  })

  private readonly switch = new Switch({
    onHTML: 'true',
    offHTML: 'false',
    label: 'Current Value',
    onChange: () => {
      const current = this.switchSelector?.value
      if (current) {
        const nextValue = !$gameSwitches.value(current.index)
        $gameSwitches.setValue(current.index, nextValue)
        SoundManager.playSystemSound(nextValue ? 1 : 0)
        this._triggerOnChange()
      }
    },
  })

  private readonly _intervalId: number

  constructor() {
    super()

    this._intervalId = setInterval(() => {
      this._triggerOnChange()
    }, 500) as unknown as number
  }

  dispose() {
    super.dispose()

    this.switchSelector.dispose()
    this.switch.dispose()
  }

  render(): HTMLDivElement {
    const ctr = document.createElement('div')
    ctr.append(
      this.switchSelector.render(),
      this.switch.render(),
    )
    return ctr
  }
}
