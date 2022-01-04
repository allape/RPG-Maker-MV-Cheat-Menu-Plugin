import './index.scss'
import {Renderer} from '../../core/renderer'

export default class Input extends Renderer<HTMLInputElement> {

  private readonly input = document.createElement('input')

  private readonly _stopPropagation = (e: Event) => {
    e.stopPropagation()
  }

  get value(): string {
    return this.input.value || ''
  }
  set value(v: any) {
    this.input.value = `${v === undefined || v === null ? '' : v}`
  }

  render(): HTMLInputElement {
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
