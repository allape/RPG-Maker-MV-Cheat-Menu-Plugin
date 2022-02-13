import './index.scss'
import {IKeyMap, Renderer} from '../../core/renderer'
import MV from '../../core/mv'
import {createKeyMapLabel, div, span} from '../../core/dom'

export interface ISwitchProps {
  keymap?: IKeyMap

  onHTML?: string | HTMLElement
  offHTML?: string | HTMLElement
  onStyle?: string
  offStyle?: string

  label?: string
  // label selectable
  selectable?: boolean
  default?: boolean
  onChange?: (value: boolean, e?: Event) => void
}

export default class Switch extends Renderer<HTMLDivElement> {

  static OnHTML = 'on'
  static OffHTML = 'off'
  static OnStyle = ''
  static OffStyle = ''

  private readonly props: ISwitchProps

  private readonly label = div()
  private readonly status = span()

  private _value = false

  get text(): string {
    return this.label.title
  }
  set text(v: string) {
    this.label.innerHTML = `${v}: `
    this.label.title = v
  }

  set value(v: boolean) {
    this._value = v
    const {status, props: {
      onHTML = Switch.OnHTML,
      offHTML = Switch.OffHTML,
      onStyle = Switch.OnStyle,
      offStyle = Switch.OffStyle,
    }} = this
    status.innerHTML = ''
    status.append(v ? onHTML : offHTML)
    status.setAttribute('style', v ? onStyle : offStyle)
    status.classList.add('on', 'off')
    status.classList.remove(v ? 'off' : 'on')
  }

  private _onChange = (e?: Event) => {
    this.props.onChange?.(!this._value, e)
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (MV.singleton().visible) {
      const code = this.props.keymap?.code
      if (code && e.code === code) {
        this._onChange(e)
      }
    }
  }

  constructor(props?: ISwitchProps) {
    super()

    this.props = props || {}

    if (this.props.keymap) {
      window.addEventListener('keydown', this._onKeydown)
    }
    if (this.props.label) {
      this.text = this.props.label
    }

    this.value = !!this.props.default
  }

  dispose() {
    super.dispose()
    window.removeEventListener('keydown', this._onKeydown)
  }

  render(): HTMLDivElement {
    const {label, status, props: {keymap, selectable}} = this

    const container = div()
    container.classList.add('switch-wrapper')

    label.classList.add('label')
    if (selectable) {
      label.classList.add('selectable')
    }
    container.append(label)

    const statusWrapper = div()
    statusWrapper.classList.add('status')

    status.classList.add('current-status')
    statusWrapper.append(status)

    if (keymap) {
      const keystroke = createKeyMapLabel(keymap)
      keystroke.classList.add('keystroke')
      statusWrapper.append(keystroke)
    }

    statusWrapper.addEventListener('click', this._onChange)

    container.append(statusWrapper)

    return container
  }

}
