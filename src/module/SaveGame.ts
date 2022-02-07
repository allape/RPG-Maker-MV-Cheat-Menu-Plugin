import {KEY_MAPS, Renderer} from '../core/renderer'
import AmountSelector from '../component/AmountSelector'
import ScrollSelect from '../component/ScrollSelect'
import MV from '../core/mv'
import Switch from '../component/Switch'
import {createText} from '../core/dom'

export default class SaveGame extends Renderer<HTMLDivElement> {
  static MyName = 'Save Game'

  static KeyMap = {
    save: KEY_MAPS.Digit5,
  }

  private static readonly STORAGE_KEY = 'SaveGame_id'

  private readonly saveIdSelector = new AmountSelector({
    default: 1,
    precision: 0,
    min: 1,
    max: 1000,
    keymap: ScrollSelect.KeyMap34,
    increaseFn: v => v + 1,
    decreaseFn: v => v - 1,
    onChange: v => {
      MV.singleton().storage[SaveGame.STORAGE_KEY] = v
    },
  })

  private readonly save = new Switch({
    default: true,
    onHTML: 'Manually Save',
    keymap: SaveGame.KeyMap.save,
    onChange: () => {
      DataManager.saveGame(this.saveIdSelector.value)
      SoundManager.playSystemSound(1)
    },
  })

  constructor() {
    super()
  }

  dispose() {
    super.dispose()

    this.saveIdSelector.dispose()
    this.save.dispose()
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')

    container.append(
      createText('Used for emergency game saving.'),
      this.saveIdSelector.render(),
      this.save.render(),
    )

    return container
  }
}
