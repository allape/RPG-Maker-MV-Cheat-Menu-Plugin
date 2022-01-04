import {Renderer} from '../core/renderer'
import Input from './Input'
import RowSelect, {IRowSelectKeyMap} from './ScrollSelect'
import MV from '../core/mv'

export function shrink2Precision(value: number | string, precision: number): number {
  const power = Math.pow(10, ((precision || 0) < 0 ? 0 : precision) || 0)
  return Math.floor((parseInt(value as string) || 0) * power) / power
}

export interface IAmountSelectorProps {
  readOnly?: boolean
  default?: number
  precision?: number
  keymap?: IRowSelectKeyMap
  min?: number
  max?: number
  increaseFn?: (value: number) => number
  decreaseFn?: (value: number) => number
  onChange?: (value: number) => void
  onLess?: () => boolean | void
  onMore?: () => boolean | void
}

export default class AmountSelector extends Renderer<HTMLDivElement> {

  static KeyMap = RowSelect.KeyMap56

  static defaultIncreaseFn = v => v * 10
  static defaultDecreaseFn = v => v / 10

  private readonly props: IAmountSelectorProps

  private readonly row: RowSelect
  private readonly input = new Input()

  get value(): number {
    let v = shrink2Precision(this.input.value, this.props.precision)
    v = v > this.props.max ? this.props.max : v
    v = v < this.props.min ? this.props.min : v
    return v
  }
  set value(v: number | string) {
    v = shrink2Precision(v, this.props.precision)
    v = v > this.props.max ? this.props.max : v
    v = v < this.props.min ? this.props.min : v
    this.input.value = v
  }

  private readonly _onLess = (e?: Event) => {
    if (MV.singleton().visible) {
      e?.stopPropagation()
      if (this.props.onLess?.()) return
      this.input.value = shrink2Precision(this.props.decreaseFn(this.value), this.props.precision)
      this._onChange()
    }
  }

  private readonly _onMore = (e?: Event) => {
    if (MV.singleton().visible) {
      e?.stopPropagation()
      if (this.props.onMore?.()) return
      this.input.value = shrink2Precision(this.props.increaseFn(this.value), this.props.precision)
      this._onChange()
    }
  }

  private readonly _onChange = () => {
    this.value = this.input.value
    this.props.onChange?.(this.value)
  }

  constructor(props?: IAmountSelectorProps) {
    super()
    this.props = props || {}

    this.props.precision = (this.props.precision || 0) < 0 ? 0 : this.props.precision
    this.props.keymap = this.props.keymap || AmountSelector.KeyMap

    this.props.increaseFn = this.props.increaseFn || AmountSelector.defaultIncreaseFn
    this.props.decreaseFn = this.props.decreaseFn || AmountSelector.defaultDecreaseFn

    this.input.value = this.props.default || ''

    this.row = new RowSelect({
      keymap: this.props.keymap,
      leftText: '-',
      rightText: '+',
      onLeft: this._onLess,
      onRight: this._onMore,
    })
  }

  dispose() {
    super.dispose()

    this.row.dispose()
    this.input.dispose()
  }

  render(): HTMLDivElement {
    const {row, input, _onChange} = this

    const inputDom = input.render()
    inputDom.addEventListener('change', _onChange)
    inputDom.classList.add('input')
    inputDom.type = 'number'
    inputDom.style.textAlign = 'center'
    if (this.props.readOnly) {
      inputDom.readOnly = this.props.readOnly
      inputDom.style.borderColor = 'transparent'
    }
    row.text.append(inputDom)

    return row.render()
  }

}
