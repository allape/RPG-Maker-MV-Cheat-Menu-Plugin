import {KEY_MAPS, Renderer} from '../../core/renderer'
import Switch, {ISwitchProps} from '../Switch'
import Title from '../Title'

export interface IPBasedModuleProps {
  name: string
  onAliveTo0: () => void
  onAliveTo1: () => void
  onAlive2Max: () => void
  onAllTo0: () => void
  onAllTo1: () => void
  onAll2Max: () => void
}

/**
 * *P = HP or MP or TP, or something like this
 */
export default abstract class XPBasedModule extends Renderer<HTMLDivElement> {

  static KeyMap = {
    aliveTo0: KEY_MAPS.Digit3,
    aliveTo1: KEY_MAPS.Digit4,
    alive2Max: KEY_MAPS.Digit5,
    allTo0: KEY_MAPS.Digit6,
    allTo1: KEY_MAPS.Digit7,
    all2Max: KEY_MAPS.Digit8,
  }

  private static DefaultSwitchProps: Partial<ISwitchProps> = {
    default: true,
    onHTML: 'Activate',
  }

  private readonly aliveTitle = new Title({ title: 'Alive' })

  private readonly aliveTo0: Switch
  private readonly aliveTo1: Switch
  private readonly alive2Max: Switch

  private readonly allTitle = new Title({ title: 'All' })
  private readonly allTo0: Switch
  private readonly allTo1: Switch
  private readonly all2Max: Switch

  protected constructor(props: IPBasedModuleProps) {
    super()

    this.aliveTo0 = new Switch({
      ...XPBasedModule.DefaultSwitchProps,
      label: `${props.name} to 0`,
      keymap: XPBasedModule.KeyMap.aliveTo0,
      onChange: () => {
        props.onAliveTo0()
        SoundManager.playSystemSound(1)
      },
    })

    this.aliveTo1 = new Switch({
      ...XPBasedModule.DefaultSwitchProps,
      label: `${props.name} to 1`,
      keymap: XPBasedModule.KeyMap.aliveTo1,
      onChange: () => {
        props.onAliveTo1()
        SoundManager.playSystemSound(1)
      },
    })

    this.alive2Max = new Switch({
      ...XPBasedModule.DefaultSwitchProps,
      label: `${props.name} to MAX`,
      keymap: XPBasedModule.KeyMap.alive2Max,
      onChange: () => {
        props.onAlive2Max()
        SoundManager.playSystemSound(1)
      },
    })

    this.allTo0 = new Switch({
      ...XPBasedModule.DefaultSwitchProps,
      label: `${props.name} to 0`,
      keymap: XPBasedModule.KeyMap.allTo0,
      onChange: () => {
        props.onAllTo0()
        SoundManager.playSystemSound(1)
      },
    })

    this.allTo1 = new Switch({
      ...XPBasedModule.DefaultSwitchProps,
      label: `${props.name} to 1`,
      keymap: XPBasedModule.KeyMap.allTo1,
      onChange: () => {
        props.onAllTo1()
        SoundManager.playSystemSound(1)
      },
    })

    this.all2Max = new Switch({
      ...XPBasedModule.DefaultSwitchProps,
      label: `${props.name} to MAX`,
      keymap: XPBasedModule.KeyMap.all2Max,
      onChange: () => {
        props.onAll2Max()
        SoundManager.playSystemSound(1)
      },
    })
  }

  dispose() {
    super.dispose()

    this.aliveTitle.dispose()
    this.aliveTo0.dispose()
    this.aliveTo1.dispose()
    this.alive2Max.dispose()

    this.allTitle.dispose()
    this.allTo0.dispose()
    this.allTo1.dispose()
    this.all2Max.dispose()
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')

    container.append(this.aliveTitle.render())
    container.append(this.aliveTo0.render())
    container.append(this.aliveTo1.render())
    container.append(this.alive2Max.render())

    container.append(this.allTitle.render())
    container.append(this.allTo0.render())
    container.append(this.allTo1.render())
    container.append(this.all2Max.render())

    return container
  }

}
