import './index.scss'
import {Renderer} from '../../core/renderer'

export type InputElement = HTMLInputElement | HTMLTextAreaElement

export interface IInputProps {
  type?: 'input' | 'textarea'
}

export default class Input extends Renderer<InputElement> {

  private readonly props: IInputProps

  private readonly input: InputElement

  private readonly _stopPropagation = (e: Event) => {
    e.stopPropagation()
  }

  get value(): string {
    return this.input.value || ''
  }
  set value(v: any) {
    this.input.value = `${v === undefined || v === null ? '' : v}`
  }

  constructor(props?: IInputProps) {
    super()

    this.props = props || {}

    this.input = document.createElement(this.props.type || 'input')
  }

  render(): InputElement {
    const {input} = this
    input.classList.add('input-wrapper')
    // input.addEventListener('change', this._stopPropagation, true)
    input.addEventListener('keyup', this._stopPropagation, true)
    input.addEventListener('keydown', this._stopPropagation, true)
    input.addEventListener('keypress', this._stopPropagation, true)
    input.addEventListener('click', this._stopPropagation, true)
    input.addEventListener('dblclick', this._stopPropagation, true)
    input.addEventListener('auxclick', this._stopPropagation, true)
    input.addEventListener('mousedown', this._stopPropagation, true)
    input.addEventListener('mouseup', this._stopPropagation, true)
    input.addEventListener('mouseenter', this._stopPropagation, true)
    input.addEventListener('mouseleave', this._stopPropagation, true)
    return input
  }
}
