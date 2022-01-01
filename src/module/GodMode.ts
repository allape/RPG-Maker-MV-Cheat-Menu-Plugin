import {Renderer} from '../core/renderer'
import {ActorSelector} from '../component/ActorSelector'

declare class GodModeActor extends Game_Actor {
  _godModeInjected: boolean | undefined
  _godMode: boolean
  _godModeIntervalId: number | undefined
  gainHP_proxy: (hp: number) => void;
  setHp_proxy: (hp: number) => void;
  gainMp_proxy: (mp: number) => void;
  setMp_proxy: (mp: number) => void;
  gainTp_proxy: (tp: number) => void;
  setTp_proxy: (tp: number) => void;
  paySkillCost_proxy: (skill: Game_Skill) => void;
}

export default class GodMode extends Renderer {

  private static readonly ON_COLOR = 'red'
  private static readonly OFF_COLOR = 'green'
  private static readonly ON_TEXT = '[on]'
  private static readonly OFF_TEXT = '[off]'

  private readonly container = document.createElement('div')
  private readonly statusEle = document.createElement('div')
  private readonly onOffButton = document.createElement('div')

  private readonly actorSelector = new ActorSelector({
    onChange: actor => {
      this.current = actor as GodModeActor
    }
  })

  private _whoIsYourDaddy = () => {
    if (!this.current) return

    const actor = this.current

    actor._godMode = !actor._godMode

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

    // ui
    this.onOffButton.style.color = actor._godMode ? GodMode.ON_COLOR : GodMode.OFF_COLOR
    this.onOffButton.innerHTML = actor._godMode ? GodMode.ON_TEXT : GodMode.OFF_TEXT
  }

  private current?: GodModeActor

  constructor() {
    super()
    this._buildUI()
  }

  private _buildUI() {
    this.container.append(this.actorSelector.render())

    const { style: statusStyle } = this.statusEle
    statusStyle.color = 'white'
    statusStyle.display = 'flex'
    statusStyle.alignItems = 'center'
    statusStyle.padding = '10px 0'

    const text = document.createElement('div')
    text.innerHTML = 'Current Status:'
    text.style.textAlign = 'left'
    text.style.flex = '1'
    this.statusEle.append(text)

    this.onOffButton.style.padding = '0 10px'
    this.onOffButton.style.cursor = 'pointer'
    this.onOffButton.style.color = GodMode.OFF_COLOR
    this.onOffButton.innerHTML = GodMode.OFF_TEXT
    this.onOffButton.addEventListener('click', this._whoIsYourDaddy)
    this.statusEle.append(this.onOffButton)

    this.container.append(this.statusEle)
  }

  private _inject(actor: GodModeActor) {
    if (!actor._godModeInjected) {
      try {
        actor._godModeInjected = true

        actor.gainHP_proxy = actor.gainHp
        actor.gainHp = (hp) => {
          actor.gainHP_proxy(actor._godMode ? actor.mhp : hp)
        }

        actor.setHp_proxy = actor.setHp
        actor.setHp = (hp) => {
          actor.setHp_proxy(actor._godMode ? actor.mhp : hp)
        }

        actor.gainMp_proxy = actor.gainMp
        actor.gainMp = (mp) => {
          actor.gainMp_proxy(actor._godMode ? actor.mmp : mp)
        }

        actor.setMp_proxy = actor.setMp
        actor.setMp = (mp) => {
          actor.setMp_proxy(actor._godMode ? actor.mmp : mp)
        }

        actor.gainTp_proxy = actor.gainTp
        actor.gainTp = (tp) => {
          actor.gainTp_proxy(actor._godMode ? actor.maxTp() : tp)
        }

        actor.setTp_proxy = actor.setTp
        actor.setTp = (tp) => {
          actor.setTp_proxy(actor._godMode ? actor.maxTp() : tp)
        }

        actor.paySkillCost_proxy = actor.paySkillCost;
        actor.paySkillCost = (skill) => {
          if (!actor._godMode) {
            actor.paySkillCost_proxy(skill)
          }
        }
      } catch (e) {
        console.error(`unable to turn on god mode for: ${actor._name},`, e)
      }
    }
  }

  dispose() {
    super.dispose()
    this.onOffButton.removeEventListener('click', this._whoIsYourDaddy)
    this.actorSelector.dispose()
  }

  render(): HTMLElement {
    return this.container
  }
}
