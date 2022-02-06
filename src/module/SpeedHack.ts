import {Renderer} from '../core/renderer'
import AmountSelector from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'

export default class SpeedHack extends Renderer<HTMLDivElement> {
  static MyName = 'Speed Hack'

  private _timerId = -1

  private readonly countSelector = new AmountSelector({
    default: 0,
    precision: 0,
    min: 0,
    max: 1000,
    keymap: ScrollSelect.KeyMap34,
    increaseFn: v => v + 50,
    decreaseFn: v => v - 50,
    onChange: () => {
      this._render()
    },
  })

  private readonly _render = () => {
    clearTimeout(this._timerId)
    const count = this.countSelector.value
    if (count > 0) {
      this._timerId = setTimeout(() => {
        SceneManager.updateScene()
        this._render()
      }, 1000 / count) as unknown as number
    }
  }

  constructor() {
    super()

    // this.render()
  }

  dispose() {
    super.dispose()

    this.countSelector.dispose()

    clearTimeout(this._timerId)
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')

    const label = document.createElement('div')
    label.innerHTML = '<b>This is how many more render count per second base on the original fps. <br>This may cause frame drop. <br>Leaving this module will stop speed-hacking.</b>'
    container.append(label)

    container.append(this.countSelector.render())

    return container
  }
}
