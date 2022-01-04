import {Renderer} from '../core/renderer'
import Input from './Input'
import MV from '../core/mv'

import RowSelect from './ScrollSelect'

export interface IActorSelectorProps {
  onChange?: (actor?: Game_Actor) => void
}

export class ActorSelector extends Renderer {

  private readonly props: IActorSelectorProps

  private readonly searchInput: HTMLInputElement = new Input().render()

  private readonly row: RowSelect = new RowSelect()

  private _index: number = 0
  private _keyword: string = ''

  private _onSearchChange = (e: Event) => {
    e.stopPropagation()
    this._index = 0
    this._keyword = this.searchInput.value?.toLowerCase() || ''
    this._onChange()
  }

  private _onGameStart = () => {
    setTimeout(() => {
      this._index = 0
      this._onChange()
    })
  }

  constructor(props: IActorSelectorProps) {
    super()
    this.props = props

    MV.singleton().on('loadGame', this._onGameStart)
    MV.singleton().on('setupNewGame', this._onGameStart)

    this.row = new RowSelect({
      keymap: RowSelect.KeyMap34,
      onLeft: () => {
        this._index = (this._index <= 0 ? this._getActors().length : this._index) - 1
        this._onChange()
      },
      onRight: () => {
        this._index = this._index >= (this._getActors().length - 1) ? 0 : (this._index + 1)
        this._onChange()
      },
    })

    this._onChange()
  }

  private _onChange() {
    const {_index, row} = this
    const actors = this._getActors()
    const current = actors[_index]
    this.props.onChange?.(current)
    row.value = `[${_index + 1}/${actors.length}]: ${current?._name || '(null)'}`
  }

  private _getActors(): Game_Actor[] {
    return $gameActors._data.filter(i => !!i && i._name?.toLowerCase().includes(this._keyword)) || []
  }

  dispose() {
    super.dispose()

    this.row.dispose()

    MV.singleton().off('loadGame', this._onGameStart)
    MV.singleton().off('setupNewGame', this._onGameStart)
  }

  render(): HTMLElement {
    const container = document.createElement('div')
    container.classList.add('actor-selector-wrapper')

    this.searchInput.placeholder = 'Search Hero'
    this.searchInput.addEventListener('change', this._onSearchChange, true)
    container.append(this.searchInput)

    container.append(this.row.render())

    return container
  }
}
