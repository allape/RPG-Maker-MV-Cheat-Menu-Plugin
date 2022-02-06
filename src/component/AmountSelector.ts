import {Renderer} from '../core/renderer'
import Input from './Input'
import ScrollSelect, {IScrollSelectKeyMap, IScrollSelectProps} from './ScrollSelect'
import MV from '../core/mv'

export function shrink2Precision(value: number | string, precision: number): number {
  const power = Math.pow(10, ((precision || 0) < 0 ? 0 : precision) || 0)
  return Math.floor((parseFloat(value as string) || 0) * power) / power
}

export interface IAmountSelectorProps {
  readOnly?: boolean
  default?: number
  precision?: number
  keymap?: IScrollSelectKeyMap
  min?: number
  max?: number
  increaseFn?: (value: number) => number
  decreaseFn?: (value: number) => number
  scrollSelectorProps?: IScrollSelectProps
  onChange?: (value: number) => void
  onLess?: () => boolean | void
  onMore?: () => boolean | void
}

export default class AmountSelector extends Renderer<HTMLDivElement> {

  static KeyMap = ScrollSelect.KeyMap56

  static defaultIncreaseFn = v => v * 10
  static defaultDecreaseFn = v => v / 10

  private readonly props: IAmountSelectorProps

  private readonly row: ScrollSelect
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

    this.props = props = props || {}

    props.precision = (props.precision || 0) < 0 ? 0 : props.precision
    props.keymap = props.keymap || AmountSelector.KeyMap
    props.keymap = props.keymap || AmountSelector.KeyMap
    props.increaseFn = props.increaseFn || AmountSelector.defaultIncreaseFn
    props.decreaseFn = props.decreaseFn || AmountSelector.defaultDecreaseFn

    this.input.value = (props.default === undefined ? '' : props.default)

    const inputDom = this.input.render() as HTMLInputElement
    inputDom.addEventListener('change', this._onChange)
    inputDom.classList.add('input')
    inputDom.type = 'number'
    inputDom.style.textAlign = 'center'
    if (props.readOnly) {
      inputDom.readOnly = props.readOnly
      inputDom.style.borderColor = 'transparent'
    }

    this.row = new ScrollSelect({
      keymap: props.keymap,
      leftText: '-',
      rightText: '+',
      ...props.scrollSelectorProps,
      center: inputDom,
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
    return this.row.render()
  }

}
