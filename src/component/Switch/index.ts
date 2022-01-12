import './index.scss'
import {IKeyMap, Renderer} from '../../core/renderer'

export interface ISwitchProps {
  keymap?: IKeyMap

  onHTML?: string | HTMLElement
  offHTML?: string | HTMLElement
  onStyle?: string
  offStyle?: string

  default?: boolean
  onChange?: (value: boolean, e?: Event) => void
}

export default class Switch extends Renderer<HTMLDivElement> {

  static OnHTML = `on`
  static OffHTML = `off`
  static OnStyle = ``
  static OffStyle = ``

  private readonly props: ISwitchProps

  private readonly label = document.createElement('div')
  private readonly status = document.createElement('span')

  private _value: boolean = false

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
    status.innerHTML = ``
    status.append(v ? onHTML : offHTML)
    status.setAttribute('style', v ? onStyle : offStyle)
    status.classList.add('on', 'off')
    status.classList.remove(v ? 'off' : 'on')
  }

  private _onChange = (e?: Event) => {
    this.props.onChange?.(!this._value, e)
  }

  private _onKeydown = (e: KeyboardEvent) => {
    const code = this.props.keymap?.code
    if (code && e.code === code) {
      this._onChange(e)
    }
  }

  constructor(props?: ISwitchProps) {
    super()

    this.props = props || {}

    if (this.props.keymap) {
      window.addEventListener('keydown', this._onKeydown)
    }

    this.value = !!this.props.default
  }

  dispose() {
    super.dispose()
    window.removeEventListener('keydown', this._onKeydown)
  }

  render(): HTMLDivElement {
    const {label, status, props: {keymap}} = this

    const container = document.createElement('div')
    container.classList.add('switch-wrapper')

    label.classList.add('label')
    this.text = `Status`
    container.append(label)

    const statusWrapper = document.createElement('div')
    statusWrapper.classList.add('status')

    status.classList.add('current-status')
    statusWrapper.append(status)

    if (keymap) {
      const keystroke = document.createElement('span')
      keystroke.classList.add('keystroke')
      keystroke.innerHTML = `[${keymap.key}]`
      statusWrapper.append(keystroke)
    }

    statusWrapper.addEventListener('click', this._onChange)

    container.append(statusWrapper)

    return container
  }

}