import {KEY_MAPS, Renderer} from '../../core/renderer'
import Switch, {ISwitchProps} from '../Switch'
import {div, hr} from '../../core/dom'

export interface IPBasedModuleProps {
  name: string
  onAliveTo0: () => void
  onAliveTo1: () => void
  onAlive2Half: () => void
  onAlive2Max: () => void
  onAllTo0: () => void
  onAllTo1: () => void
  onAll2Half: () => void
  onAll2Max: () => void
}

/**
 * *P = HP or MP or TP, or something like this
 */
export default abstract class XPBaseModule extends Renderer<HTMLDivElement> {

  static KeyMap = {
    aliveTo0: KEY_MAPS.Digit6,
    aliveTo1: KEY_MAPS.Digit5,
    alive2Half: KEY_MAPS.Digit4,
    alive2Max: KEY_MAPS.Digit3,
    allTo0: KEY_MAPS.Digit7,
    allTo1: KEY_MAPS.Digit8,
    all2Half: KEY_MAPS.Digit9,
    all2Max: KEY_MAPS.Digit0,
  }

  private static DefaultSwitchProps: Partial<ISwitchProps> = {
    default: true,
    onHTML: 'Activate',
  }

  private readonly aliveTo0: Switch
  private readonly aliveTo1: Switch
  private readonly alive2Half: Switch
  private readonly alive2Max: Switch

  private readonly allTo0: Switch
  private readonly allTo1: Switch
  private readonly all2Half: Switch
  private readonly all2Max: Switch

  protected constructor(props: IPBasedModuleProps) {
    super()

    this.aliveTo0 = new Switch({
      ...XPBaseModule.DefaultSwitchProps,
      label: `Alive ${props.name} to 0`,
      keymap: XPBaseModule.KeyMap.aliveTo0,
      onChange: () => {
        props.onAliveTo0()
        SoundManager.playSystemSound(0)
      },
    })

    this.aliveTo1 = new Switch({
      ...XPBaseModule.DefaultSwitchProps,
      label: `Alive ${props.name} to 1`,
      keymap: XPBaseModule.KeyMap.aliveTo1,
      onChange: () => {
        props.onAliveTo1()
        SoundManager.playSystemSound(1)
      },
    })

    this.alive2Half = new Switch({
      ...XPBaseModule.DefaultSwitchProps,
      label: `Alive ${props.name} to HALF`,
      keymap: XPBaseModule.KeyMap.alive2Half,
      onChange: () => {
        props.onAlive2Half()
        SoundManager.playSystemSound(1)
      },
    })

    this.alive2Max = new Switch({
      ...XPBaseModule.DefaultSwitchProps,
      label: `Alive ${props.name} to MAX`,
      keymap: XPBaseModule.KeyMap.alive2Max,
      onChange: () => {
        props.onAlive2Max()
        SoundManager.playSystemSound(1)
      },
    })

    this.allTo0 = new Switch({
      ...XPBaseModule.DefaultSwitchProps,
      label: `All ${props.name} to 0`,
      keymap: XPBaseModule.KeyMap.allTo0,
      onChange: () => {
        props.onAllTo0()
        SoundManager.playSystemSound(0)
      },
    })

    this.allTo1 = new Switch({
      ...XPBaseModule.DefaultSwitchProps,
      label: `All ${props.name} to 1`,
      keymap: XPBaseModule.KeyMap.allTo1,
      onChange: () => {
        props.onAllTo1()
        SoundManager.playSystemSound(1)
      },
    })

    this.all2Half = new Switch({
      ...XPBaseModule.DefaultSwitchProps,
      label: `All ${props.name} to HALF`,
      keymap: XPBaseModule.KeyMap.all2Half,
      onChange: () => {
        props.onAll2Half()
        SoundManager.playSystemSound(1)
      },
    })

    this.all2Max = new Switch({
      ...XPBaseModule.DefaultSwitchProps,
      label: `All ${props.name} to MAX`,
      keymap: XPBaseModule.KeyMap.all2Max,
      onChange: () => {
        props.onAll2Max()
        SoundManager.playSystemSound(1)
      },
    })
  }

  dispose() {
    super.dispose()

    this.aliveTo0.dispose()
    this.aliveTo1.dispose()
    this.alive2Half.dispose()
    this.alive2Max.dispose()

    this.allTo0.dispose()
    this.allTo1.dispose()
    this.all2Half.dispose()
    this.all2Max.dispose()
  }

  render(): HTMLDivElement {
    const ctr = div()

    ctr.append(
      this.alive2Max.render(),
      this.alive2Half.render(),
      this.aliveTo1.render(),
      this.aliveTo0.render(),
      hr(),
      this.allTo0.render(),
      this.allTo1.render(),
      this.all2Half.render(),
      this.all2Max.render(),
    )

    return ctr
  }

}
