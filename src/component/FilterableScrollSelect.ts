import MV from '../core/mv'
import { Renderer } from '../core/renderer'
import Input from './Input'
import ScrollSelect, { IScrollSelectProps } from './ScrollSelect'
import {div} from '../core/dom'

export interface IFilterableScrollSelectProps<T> extends IScrollSelectProps {
  // used for cache keyword, the same key will produce the same cached keyword
  key?: string
  listProvider: (keyword: string) => T[]
  nameProvider: (item?: T) => string | undefined
  onChange?: (value: T) => void
  placeholder?: string
  disableResetOnGameStarted?: boolean;
  hideFilter?: boolean;
}

export default class FilterableScrollSelect<T> extends Renderer<HTMLDivElement> {

  private readonly props: IFilterableScrollSelectProps<T>

  private readonly search = new Input()
  private readonly row: ScrollSelect = new ScrollSelect()

  private _index = 0
  private _keyword = ''

  private _onChange = () => {
    const { _index, row, _keyword, props } = this
    const { listProvider, nameProvider, onChange, key } = props

    const list = listProvider(_keyword)
    const current = list[_index]

    onChange?.(current)

    row.value = `[${_index + 1}/${list.length}]: ${nameProvider(current) || '(null)'}`

    if (key) {
      const storage = MV.singleton().storage
      storage[`${key}_index`] = _index
      storage[`${key}_keyword`] = _keyword
    }
  }

  private _fillWithStorage = () => {
    const {key} = this.props
    if (key) {
      const storage = MV.singleton().storage
      this._index = (storage[`${key}_index`] || 0) as number
      this._keyword = `${storage[`${key}_keyword`] || ''}`
      this.search.value = this._keyword
    }
  }

  private _onSearchChange = (e: Event) => {
    e.stopPropagation()

    this._index = 0
    this._keyword = this.search.value?.toLowerCase() || ''
    this._onChange()
  }

  private _onGameStart = () => {
    setTimeout(() => {
      this._index = 0
      this._fillWithStorage()
      this._onChange()
    })
  }

  get value(): T | undefined {
    return this.props.listProvider(this._keyword)[this._index]
  }
  set index(i: number) {
    this._index = i
    this._onChange()
  }

  constructor(props: IFilterableScrollSelectProps<T>) {
    super()

    this.props = props

    if (!props.disableResetOnGameStarted) {
      MV.singleton().on('loadGame', this._onGameStart)
      MV.singleton().on('setupNewGame', this._onGameStart)
    }

    this._fillWithStorage()

    const { listProvider, onLeft, onCenter, onRight } = props

    this.row = new ScrollSelect({
      keymap: props.keymap || ScrollSelect.KeyMap34,
      onLeft: (e) => {
        if (onLeft?.(e)) return true
        this._index = (this._index <= 0 ? listProvider(this._keyword).length : this._index) - 1
        this._onChange()
      },
      onCenter,
      onRight: (e) => {
        if (onRight?.(e)) return true
        this._index = this._index >= (listProvider(this._keyword).length - 1) ? 0 : (this._index + 1)
        this._onChange()
      },
    })

    this._onChange()
  }

  dispose() {
    super.dispose()

    this.search.dispose()
    this.row.dispose()

    MV.singleton().off('loadGame', this._onGameStart)
    MV.singleton().off('setupNewGame', this._onGameStart)
  }

  render(): HTMLDivElement {
    const container = div()

    if (!this.props.hideFilter) {
      const inputDom = this.search.render()
      inputDom.placeholder = this.props.placeholder || 'Search by Keyword'
      inputDom.addEventListener('change', this._onSearchChange, true)
      container.append(inputDom)
    }

    container.append(this.row.render())

    return container
  }

}
