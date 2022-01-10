import {Renderer} from '../core/renderer'
import AmountSelector from '../component/AmountSelector'
import Input from '../component/Input'
import RowSelect from '../component/ScrollSelect'
import MV from '../core/mv'

export default class Items extends Renderer<HTMLDivElement> {

  static MyName = 'Items'

  static KeyMap = RowSelect.KeyMap34

  private readonly container = document.createElement('div')
  private readonly search: Input
  private readonly item: RowSelect
  private readonly amount: AmountSelector
  private readonly currentAmount: AmountSelector

  private readonly _itemAmountRefreshIntervalId: number

  private _keyword = ''
  private _index = 0

  private _onChange = () => {
    const items = this._getAllItems()
    const item: Game_Item | undefined = items[this._index]
    this.item.value = `[${this._index + 1}/${items.length}]: ${item?.name || '(null)'}`
  }

  private _onKeywordChange = (e: Event) => {
    e.stopPropagation()
    this._index = 0
    this._keyword = this.search.value.toLowerCase()
    this._onChange()
  }

  private _onPrev = () => {
    if (MV.singleton().visible) {
      const items = this._getAllItems()
      this._index = (this._index <= 0 ? items.length : this._index) - 1
      this._onChange()
    }
  }

  private _onNext = () => {
    if (MV.singleton().visible) {
      const items = this._getAllItems()
      this._index = (this._index >= items.length - 1 ? -1 : this._index) + 1
      this._onChange()
    }
  }

  constructor() {
    super()

    this.search = new Input()

    this.item = new RowSelect({
      keymap: Items.KeyMap,
      onLeft: this._onPrev,
      onRight: this._onNext,
    })
    this.amount = new AmountSelector({
      default: 1,
      precision: 0,
      min: 1,
      max: 99,
    })
    this.currentAmount = new AmountSelector({
      precision: 0,
      readOnly: true,
      keymap: RowSelect.KeyMap78,
      onLess: () => {
        const current = this._getAllItems()[this._index]
        if (current) {
          $gameParty.gainItem(current, -this.amount.value);
        }
        return true
      },
      onMore: () => {
        const current = this._getAllItems()[this._index]
        if (current) {
          $gameParty.gainItem(current, this.amount.value);
        }
        return true
      },
    })

    this._itemAmountRefreshIntervalId = setInterval(() => {
      const current = this._getAllItems()[this._index]
      if (current) {
        this.currentAmount.value = $gameParty._items[$dataItems.indexOf(current)]
      }
    }, 100) as unknown as number
  }

  private _getAllItems(): Game_Item[] {
    return $dataItems?.filter(i => !!i && i.name?.toLowerCase().includes(this._keyword.toLowerCase())) || []
  }

  dispose() {
    super.dispose()

    this.item.dispose()
    this.amount.dispose()
    this.search.dispose()

    clearInterval(this._itemAmountRefreshIntervalId)
  }

  render(): HTMLDivElement {
    const {container, search, item, amount, currentAmount} = this

    const searchDom = search.render()
    searchDom.placeholder = 'Search Item'
    searchDom.addEventListener('change', this._onKeywordChange, true)
    container.append(searchDom)

    container.append(item.render())
    container.append(amount.render())
    container.append(currentAmount.render())

    this._onChange()

    return container
  }

}
