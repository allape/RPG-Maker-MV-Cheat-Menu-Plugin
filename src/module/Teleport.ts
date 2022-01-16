import {KEY_MAPS, Renderer} from '../core/renderer'
import MapSelector from '../component/mv/MapSelector'
import AmountSelector, {IAmountSelectorProps} from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'
import Switch from '../component/Switch'
import MV from '../core/mv'

export default class Teleport extends Renderer<HTMLDivElement> {
  static MyName = 'Teleport'

  private static readonly axisLabelBuilder = (text: string): HTMLElement => {
    const span = document.createElement('span')
    span.style.paddingRight = '10px'
    span.innerHTML = text
    return span
  }

  private static readonly AxisDefaultAmountSelectorProps: IAmountSelectorProps = {
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    default: 1,
    precision: 0,
    increaseFn: v => v + 1,
    decreaseFn: v => v - 1,
  }

  private readonly _triggerOnChange = () => {
    const map = $dataMapInfos[$gameMap.mapId()]
    if (map && this.teleport) {
      this.teleport.text = `${map.name || '(null)'} (${$gameMap.mapId()}: [${$gamePlayer.x}, ${$gamePlayer.y}])`
    }
  }

  private readonly mapSelector = new MapSelector({
    onChange: this._triggerOnChange,
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
        this._triggerOnChange()
      }
    },
  })

  private readonly _intervalId: number

  private readonly _onGameStart = () => {
    this._triggerOnChange()
  }

  constructor() {
    super()

    this._intervalId = setInterval(() => {
      this._triggerOnChange()
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

    MV.singleton().off('setupNewGame', this._onGameStart)
    MV.singleton().off('loadGame', this._onGameStart)
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')
    container.append(this.mapSelector.render())
    container.append(this.xSelector.render())
    container.append(this.ySelector.render())
    container.append(this.teleport.render())

    this._triggerOnChange()

    return container
  }
}
