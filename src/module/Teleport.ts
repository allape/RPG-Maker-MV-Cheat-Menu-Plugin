import {KEY_MAPS, Renderer} from '../core/renderer'
import MapSelector from '../component/mv/MapSelector'
import AmountSelector, {IAmountSelectorProps} from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'
import Switch from '../component/Switch'
import MV from '../core/mv'
import {div, span} from '../core/dom'

export default class Teleport extends Renderer<HTMLDivElement> {
  static MyName = 'Teleport'

  private static readonly X_STORAGE_KEY = 'Teleport_x'

  private static readonly Y_STORAGE_KEY = 'Teleport_y'

  private static readonly axisLabelBuilder = (text: string): HTMLElement => {
    const s = span()
    s.style.paddingRight = '10px'
    s.innerHTML = text
    return s
  }

  private static readonly AxisDefaultAmountSelectorProps: IAmountSelectorProps = {
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    default: 0,
    precision: 0,
    increaseFn: v => v + 1,
    decreaseFn: v => v - 1,
  }

  private readonly _getCurrentPosition = () => {
    const map = $dataMapInfos[$gameMap.mapId()]
    if (map && this.teleport) {
      const newText = `${map.name || '(null)'} (${$gameMap.mapId()}: [${$gamePlayer.x}, ${$gamePlayer.y}])`
      if (this.teleport.text !== newText) this.teleport.text = newText
    }
  }

  private readonly mapSelector = new MapSelector({
    onChange: this._getCurrentPosition,
  })

  private readonly xSelector = new AmountSelector({
    ...Teleport.AxisDefaultAmountSelectorProps,
    scrollSelectorProps: {
      centerPrefix: Teleport.axisLabelBuilder('X:'),
    },
    keymap: ScrollSelect.KeyMap56,
  })

  private readonly ySelector = new AmountSelector({
    ...Teleport.AxisDefaultAmountSelectorProps,
    scrollSelectorProps: {
      centerPrefix: Teleport.axisLabelBuilder('Y:'),
    },
    keymap: ScrollSelect.KeyMap78,
  })

  private readonly teleport = new Switch({
    keymap: KEY_MAPS.Digit9,
    selectable: true,
    default: true,
    onHTML: Teleport.MyName,
    onChange: () => {
      const map = this.mapSelector?.value
      if (map && this.xSelector && this.ySelector) {
        const mapId = $dataMapInfos.indexOf(map)
        const x = this.xSelector.value
        const y = this.ySelector.value
        $gamePlayer.reserveTransfer(mapId, x, y, $gamePlayer.direction(), 0)
        $gamePlayer.setPosition(x, y)
        SoundManager.playSystemSound(1)
        this._getCurrentPosition()

        const storage = MV.singleton().storage
        storage[Teleport.X_STORAGE_KEY] = x
        storage[Teleport.Y_STORAGE_KEY] = y
      }
    },
  })

  private readonly _intervalId: number

  private readonly _onGameStart = () => {
    this._fillWithStorage()
    this._getCurrentPosition()
  }

  private _fillWithStorage = () => {
    const storage = MV.singleton().storage
    this.xSelector.value = (storage[Teleport.X_STORAGE_KEY] || 0) as number
    this.ySelector.value = (storage[Teleport.Y_STORAGE_KEY] || 0) as number
  }

  constructor() {
    super()

    this._fillWithStorage()

    this._intervalId = setInterval(() => {
      this._getCurrentPosition()
    }, 500) as unknown as number

    MV.singleton().on('setupNewGame', this._onGameStart)
    MV.singleton().on('loadGame', this._onGameStart)
  }

  dispose() {
    super.dispose()

    this.mapSelector.dispose()
    this.xSelector.dispose()
    this.ySelector.dispose()
    this.teleport.dispose()

    clearInterval(this._intervalId)

    MV.singleton().off('setupNewGame', this._onGameStart)
    MV.singleton().off('loadGame', this._onGameStart)
  }

  render(): HTMLDivElement {
    const ctr = div()
    ctr.append(
      this.mapSelector.render(),
      this.xSelector.render(),
      this.ySelector.render(),
      this.teleport.render(),
    )

    this._getCurrentPosition()

    return ctr
  }
}
