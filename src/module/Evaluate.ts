import Input from '../component/Input'
import Switch from '../component/Switch'
import { div } from '../core/dom'
import MV from '../core/mv'
import { KEY_MAPS, Renderer } from '../core/renderer'

export default class Evaluate extends Renderer<HTMLDivElement> {
  static MyName = 'Evaluate'
  static STORAGE_KEY = Evaluate.MyName + '_script'

  private readonly script = new Input({
    type: 'textarea',
  })

  private readonly evaluate = new Switch({
    keymap: KEY_MAPS.Digit3,
    selectable: true,
    default: true,
    onHTML: Evaluate.MyName,
    onChange: () => {
      try {
        const script = this.script.value
        const storage = MV.singleton().storage
        storage[Evaluate.STORAGE_KEY] = script
        alert(eval(script))
      } catch (e) {
        alert(e?.message || JSON.stringify(e));
      }
    },
  })

  constructor() {
    super()
    this.script.value = MV.singleton().storage[Evaluate.STORAGE_KEY]
  }

  dispose() {
    super.dispose()
    this.script.dispose()
    this.evaluate.dispose()
  }

  render(): HTMLDivElement {
    const ctr = div()

    ctr.append(
      this.script.render(),
      this.evaluate.render(),
    )

    return ctr
  }
}
