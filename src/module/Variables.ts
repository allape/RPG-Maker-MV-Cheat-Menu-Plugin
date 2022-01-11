import {Renderer} from '../core/renderer'
import Input from '../component/Input'
import ScrollSelect from '../component/ScrollSelect'
import AmountSelector from '../component/AmountSelector'
import MV from '../core/mv'

export interface IVariable {
  index: number
  name?: string
}

export default class Variables extends Renderer<HTMLDivElement> {

  static MyName = 'Variables'

  static KeyMap = ScrollSelect.KeyMap34

  private readonly container = document.createElement('div')

  private readonly search: Input
  private readonly variable: ScrollSelect
  private readonly amount: AmountSelector
  private readonly currentVariableValue: Input
  private readonly currentVariableValueWrapper: ScrollSelect

  private readonly _variableValueTimer: number

  private _keyword = ''
  private _index = 0

  private get filteredVariables(): IVariable[] {
    return ($dataSystem.variables || []).map((name, index) => ({
      name,
      index,
    })).filter(i => i.name?.toLowerCase().includes(this._keyword))
  }

  private readonly _onChange = () => {
    const variables = this.filteredVariables
    const variable = variables[this._index]
    this.variable.value = `[${this._index + 1}/${variables.length}]: ${variable?.name || '(null)'}`
    this._onVariableValueChange()
  }

  private readonly _onVariableValueChange = () => {
    const variable = this.filteredVariables[this._index]
    this.currentVariableValue.value = variable ? $gameVariables.value(variable.index) : ''
  }

  private _onKeywordChange = (e: Event) => {
    e.stopPropagation()
    this._index = 0
    this._keyword = this.search.value.toLowerCase()
    this._onChange()
  }

  private _onPrev = () => {
    if (MV.singleton().visible) {
      const items = this.filteredVariables
      this._index = (this._index <= 0 ? items.length : this._index) - 1
      this._onChange()
    }
  }

  private _onNext = () => {
    if (MV.singleton().visible) {
      const items = this.filteredVariables
      this._index = (this._index >= items.length - 1 ? -1 : this._index) + 1
      this._onChange()
    }
  }

  constructor() {
    super()

    this.search = new Input()

    this.variable = new ScrollSelect({
      keymap: Variables.KeyMap,
      onLeft: this._onPrev,
      onRight: this._onNext,
    })

    this.amount = new AmountSelector({
      default: 1,
      precision: 0,
      min: 1,
      max: Number.MAX_SAFE_INTEGER,
    })

    this.currentVariableValue = new Input({
      type: 'textarea',
    })
    this.currentVariableValueWrapper = new ScrollSelect({
      keymap: ScrollSelect.KeyMap78,
      onLeft: () => {
        const variable = this.filteredVariables[this._index]
        if (variable)
          MV.setNumberVariable(variable.index, -this.amount.value)
      },
      onRight: () => {
        const variable = this.filteredVariables[this._index]
        if (variable)
          MV.setNumberVariable(variable.index, this.amount.value)
      },
    })

    this._variableValueTimer = setInterval(() => {
      this._onVariableValueChange()
    }, 500) as unknown as number

    this._onChange()
  }

  dispose() {
    super.dispose()

    this.search.dispose()
    this.variable.dispose()
    this.amount.dispose()
    this.currentVariableValue.dispose()
    this.currentVariableValueWrapper.dispose()

    clearInterval(this._variableValueTimer)
  }

  render(): HTMLDivElement {
    const {
      container,
      search,
      variable,
      amount,
      currentVariableValue,
      currentVariableValueWrapper,
    } = this

    const searchDom = search.render()
    searchDom.placeholder = 'Search Variable'
    searchDom.addEventListener('change', this._onKeywordChange, true)
    container.append(searchDom)

    container.append(variable.render())

    container.append(amount.render())

    const wrapper = currentVariableValueWrapper.render()
    container.append(wrapper)

    const value = currentVariableValue.render() as HTMLTextAreaElement
    value.addEventListener('change', () => {
      const variable = this.filteredVariables[this._index]
      if (variable) {
        MV.setVariable(variable.index, currentVariableValue.value)
        this._onVariableValueChange()
      }
    })
    value.rows = 5
    currentVariableValueWrapper.text.append(value)

    return container
  }
}
