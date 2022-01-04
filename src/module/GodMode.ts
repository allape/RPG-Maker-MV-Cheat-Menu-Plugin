import {Renderer} from '../core/renderer'
import {ActorSelector} from '../component/ActorSelector'
import MV from '../core/mv'
import Switch from '../component/Switch'

export default class GodMode extends Renderer {

  static KeyMap = {
    toggle: {
      key: '5',
      code: 'Digit5',
    },
  }

  static MyName = 'God Mode'

  private readonly actorSelector: ActorSelector
  private readonly switcher: Switch

  private current?: Game_Actor

  private readonly _whoIsYourDaddy = (value: boolean) => {
    if (!this.current) return
    const actor = this.current
    actor._godMode = value

    this._inject(actor)

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

    this.actorSelector = new ActorSelector({
      onChange: (actor?: Game_Actor) => {
        this.current = actor as Game_Actor
        this._onGameStart()
      },
    })

    this.switcher = new Switch({
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
    this.switcher.text = 'Current Status'

    MV.singleton().on('loadGame', this._onGameStart)
    MV.singleton().on('saveGame', this._onGameStart)
  }

  private _inject(actor: Game_Actor) {
    if (!actor._godModeInjected) {
      try {
        actor._godModeInjected = true

        actor._gainHP_proxy = actor.gainHp
        actor.gainHp = (hp) => {
          actor._gainHP_proxy(actor._godMode ? actor.mhp : hp)
        }

        actor._setHp_proxy = actor.setHp
        actor.setHp = (hp) => {
          actor._setHp_proxy(actor._godMode ? actor.mhp : hp)
        }

        actor._gainMp_proxy = actor.gainMp
        actor.gainMp = (mp) => {
          actor._gainMp_proxy(actor._godMode ? actor.mmp : mp)
        }

        actor._setMp_proxy = actor.setMp
        actor.setMp = (mp) => {
          actor._setMp_proxy(actor._godMode ? actor.mmp : mp)
        }

        actor._gainTp_proxy = actor.gainTp
        actor.gainTp = (tp) => {
          actor._gainTp_proxy(actor._godMode ? actor.maxTp() : tp)
        }

        actor._setTp_proxy = actor.setTp
        actor.setTp = (tp) => {
          actor._setTp_proxy(actor._godMode ? actor.maxTp() : tp)
        }

        actor._paySkillCost_proxy = actor.paySkillCost;
        actor.paySkillCost = (skill) => {
          if (!actor._godMode) {
            actor._paySkillCost_proxy(skill)
          }
        }
      } catch (e) {
        console.error(`unable to turn on god mode for: ${actor._name},`, e)
      }
    }
  }

  dispose() {
    super.dispose()

    this.actorSelector.dispose()
    this.switcher.dispose()

    MV.singleton().off('loadGame', this._onGameStart)
    MV.singleton().off('saveGame', this._onGameStart)
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    container.append(this.actorSelector.render())
    container.append(this.switcher.render())
    return container
  }
}
