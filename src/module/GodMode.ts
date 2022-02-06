import {KEY_MAPS, Renderer} from '../core/renderer'
import ActorSelector from '../component/mv/ActorSelector'
import MV from '../core/mv'
import Switch from '../component/Switch'

export default class GodMode extends Renderer {

  static KeyMap = {
    toggle: KEY_MAPS.Digit5,
  }

  static MyName = 'God Mode'

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
      actor._godModeIntervalId = setInterval(() => {
        actor.gainHp(actor.mhp)
        actor.gainMp(actor.mmp)
        actor.gainTp(actor.maxTp())
      }, 100) as unknown as number
    } else {
      clearInterval(actor._godModeIntervalId)
    }

    SoundManager.playSystemSound(actor._godMode ? 1 : 2)
  }

  private readonly _onGameStart = () => {
    if (this.switcher) {
      this.switcher.value = !!this.current?._godMode
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

    MV.singleton().off('loadGame', this._onGameStart)
    MV.singleton().off('saveGame', this._onGameStart)
  }

  render(): HTMLElement {
    const container = document.createElement('div')

    const notice = document.createElement('div')
    notice.style.color = 'red'
    notice.style.paddingBottom = '10px'
    notice.innerHTML = 'May cause "Memory Leak", restart game to solve this'
    container.append(notice)

    container.append(this.actor.render())
    container.append(this.switcher.render())

    this._onGameStart()

    return container
  }
}
