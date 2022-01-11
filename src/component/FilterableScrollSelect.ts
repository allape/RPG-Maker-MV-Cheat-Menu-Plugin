import MV from '../core/mv'
import { Renderer } from '../core/renderer'
import Input from './Input'
import ScrollSelect, { IScrollSelectProps } from './ScrollSelect'

export interface IFilterableScrollSelectProps<T = any> extends IScrollSelectProps {
  listProvider: (keyword: string) => T[]
  nameProvider: (item?: T) => string | undefined
  onChange?: (value: T) => void
  placeholder?: string
}

export default class FilterableScrollSelect<T = any> extends Renderer<HTMLDivElement> {

  private readonly props: IFilterableScrollSelectProps<T>

  private readonly search = new Input()
  private readonly row: ScrollSelect = new ScrollSelect()

  private _index: number = 0
  private _keyword: string = ''

  private _onChange = () => {
    const { _index, row, _keyword } = this
    const list = this.props.listProvider(_keyword)
    const current = list[_index]
    this.props.onChange?.(current)
    row.value = `[${_index + 1}/${list.length}]: ${this.props.nameProvider(current) || '(null)'}`
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
      this._onChange()
    })
  }

  get value(): T | undefined {
    return this.props.listProvider(this._keyword)[this._index]
  }

  constructor(props: IFilterableScrollSelectProps<T>) {
    super()

    this.props = props

    MV.singleton().on('loadGame', this._onGameStart)
    MV.singleton().on('setupNewGame', this._onGameStart)

    const { listProvider, onLeft, onCenter, onRight } = this.props

    this.row = new ScrollSelect({
    keymap: ScrollSelect.KeyMap34,
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
    const container = document.createElement('div')

    const inputDom = this.search.render()
    inputDom.placeholder = this.props.placeholder || 'Search by Keyword'
    inputDom.addEventListener('change', this._onSearchChange, true)
    container.append(inputDom)

    container.append(this.row.render())

    return container
  }

}
