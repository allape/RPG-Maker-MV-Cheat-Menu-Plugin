import {KEY_MAPS, Renderer} from '../core/renderer'
import Switch from '../component/Switch'

export default class NoClip extends Renderer<HTMLDivElement> {

  static MyName = 'No Clip'

  private readonly switch = new Switch({
    keymap: KEY_MAPS.Digit3,
    default: $gameParty._through,
    onChange: () => {
      $gameParty._through = !$gameParty._through
      this._onChange()
    },
  })

  private readonly _onChange = () => {
    this.switch.value = $gameParty._through
  }

  private readonly _intervalId: number

  constructor() {
    super()

    this._intervalId = setInterval(() => {
      this._onChange()
    }, 100) as unknown as number
  }

  dispose() {
    super.dispose()

    this.switch.dispose()

    clearInterval(this._intervalId)
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')
    container.append(this.switch.render())
    return container
  }

}
