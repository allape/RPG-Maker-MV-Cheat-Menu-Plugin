import {KEY_MAPS, Renderer} from '../core/renderer'
import Switch from '../component/Switch'
import ActorSelector from '../component/mv/ActorSelector'
import {br, hr} from '../core/dom'

export default class ClearStates extends Renderer<HTMLDivElement> {
  static MyName = 'Clear States'

  static KeyMap = {
    partyClearAll: KEY_MAPS.Digit5,
    clearAll: KEY_MAPS.Digit6,
  }

  private readonly clearAll = new Switch({
    label: 'Clear ALL States of PARTY',
    default: true,
    onHTML: 'Clear',
    keymap: ClearStates.KeyMap.partyClearAll,
    onChange: () => {
      $gameParty.allMembers().forEach(member => {
        if (member && member._states?.length) {
          member.clearStates()
        }
      })
      SoundManager.playSystemSound(1)
    },
  })

  private readonly actorSelector = new ActorSelector()

  private readonly clear = new Switch({
    label: 'Clear ALL States',
    default: true,
    onHTML: 'Clear',
    keymap: ClearStates.KeyMap.clearAll,
    onChange: () => {
      const member = this.actorSelector.value
      if (member && member._states?.length) {
        member.clearStates()
      }
      SoundManager.playSystemSound(0)
    },
  })

  dispose() {
    super.dispose()

    this.clearAll.dispose()
    this.actorSelector.dispose()
    this.clear.dispose()
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')

    container.append(
      this.clearAll.render(),
      hr(),
      br(),
      this.actorSelector.render(),
      this.clear.render(),
    )

    return container
  }
}
