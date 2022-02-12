import {KEY_MAPS, Renderer} from '../core/renderer'
import ActorSelector from '../component/mv/ActorSelector'
import MV from '../core/mv'
import Switch from '../component/Switch'
import {br, createText} from '../core/dom'
import setGuaranteedInterval, {clearGuaranteedInterval} from '../util/guaranteed-interval'

export default class GodMode extends Renderer {

  static KeyMap = {
    toggle: KEY_MAPS.Digit5,
  }

  static MyName = 'God Mode'

  private static readonly GuaranteedIntervalKey = 'Cheat:GodMode:GuaranteedIntervalKey'

  private readonly actor: ActorSelector
  private readonly switcher: Switch

  private get current(): Game_Actor | undefined {
    return this.actor?.value
  }

  private readonly _whoIsYourDaddy = (value: boolean) => {
    if (!this.current) return
    const actor = this.current
    actor._godMode = value

    MV.injectGod(actor)

    if (actor._godMode) {
      actor._godModeIntervalId = setGuaranteedInterval(GodMode.GuaranteedIntervalKey, () => {
        actor.gainHp(actor.mhp)
        actor.gainMp(actor.mmp)
        actor.gainTp(actor.maxTp())
      }, 100)
    } else {
      clearGuaranteedInterval(GodMode.GuaranteedIntervalKey)
    }

    SoundManager.playSystemSound(actor._godMode ? 1 : 0)
  }

  private readonly _onGameStart = () => {
    if (this.switcher) {
      this.switcher.value = !!this.current?._godMode
      this._whoIsYourDaddy(this.switcher.value)
    }
  }

  constructor() {
    super()

    this.actor = new ActorSelector({
      onChange: actor => {
        if (actor && this.switcher) {
          this.switcher.value = !!actor._godMode
        }
      },
    })

    this.switcher = new Switch({
      label: 'Current Status',
      default: !!this.current?._godMode,
      keymap: GodMode.KeyMap.toggle,
      onChange: (value, e) => {
        if (MV.singleton().visible && e) {
          e.stopPropagation()
        }
        this._whoIsYourDaddy(value)
        this.switcher.value = value
      },
    })

    MV.singleton().on('loadGame', this._onGameStart)
    MV.singleton().on('saveGame', this._onGameStart)
  }

  dispose() {
    super.dispose()

    this.actor.dispose()
    this.switcher.dispose()

    clearGuaranteedInterval(GodMode.GuaranteedIntervalKey)

    MV.singleton().off('loadGame', this._onGameStart)
    MV.singleton().off('saveGame', this._onGameStart)
  }

  render(): HTMLElement {
    const container = document.createElement('div')

    container.append(
      createText('If game becomes laggy after enabling this function, try to turn on and turn off god mode to clear something wrong.', 'warning'),
      br(),
    )

    container.append(this.actor.render())
    container.append(this.switcher.render())

    this._onGameStart()

    return container
  }
}
