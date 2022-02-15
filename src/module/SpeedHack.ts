import {Renderer} from '../core/renderer'
import AmountSelector from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'
import MV from '../core/mv'
import {br, createText, div} from '../core/dom'

export default class SpeedHack extends Renderer<HTMLDivElement> {
  static MyName = 'Speed Hack'

  private static readonly STORAGE_KEY = 'SpeedHack_count'

  private static _timerId = -1

  private readonly countSelector = new AmountSelector({
    default: 0,
    precision: 0,
    min: 0,
    max: 1000,
    keymap: ScrollSelect.KeyMap34,
    increaseFn: v => v + 50,
    decreaseFn: v => v - 50,
    onChange: v => {
      MV.singleton().storage[SpeedHack.STORAGE_KEY] = v
      SpeedHack._update(v)
    },
  })

  private static readonly _update = (count: number) => {
    clearTimeout(this._timerId)
    if (count > 0) {
      this._timerId = setTimeout(() => {
        SceneManager.updateScene()
        SpeedHack._update(count)
      }, 1000 / count) as unknown as number
    }
  }

  private readonly _onGameStart = () => {
    this.countSelector.value = (MV.singleton().storage[SpeedHack.STORAGE_KEY] || 0) as number
    SpeedHack._update(this.countSelector.value)
  }

  constructor() {
    super()

    this._onGameStart()
    MV.singleton().on('loadGame', this._onGameStart)
  }

  dispose() {
    super.dispose()

    MV.singleton().off('loadGame', this._onGameStart)

    this.countSelector.dispose()
  }

  render(): HTMLDivElement {
    const container = div()

    container.append(
      createText('This function may cause game misbehave.', 'fatal'),
      createText('This function may cause frame drop.', 'warning'),
      br(),
      createText('This is how many more render count per second base on the original fps.'),
      this.countSelector.render(),
    )

    return container
  }
}
