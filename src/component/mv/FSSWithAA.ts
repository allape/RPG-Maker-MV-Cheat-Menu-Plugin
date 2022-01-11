import { Renderer } from '../../core/renderer'
import AmountSelector from '../AmountSelector'
import FilterableScrollSelect from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export interface IProps<T> {
  currentAmountProvider: (value: T) => any
  // enable an interval to reload current amount value
  enableValueIntervalRefresh?: boolean
}

/**
 * FSS = {@link FilterableScrollSelect};
 * AA = two {@link AmountSelector}s, one for select value, one current value
 */
export default abstract class FSSWithAA<T> extends Renderer<HTMLDivElement> {

  private readonly props: IProps<T>

  private readonly container = document.createElement('div')

  protected abstract readonly scrollSelector: FilterableScrollSelect<T>
  protected abstract readonly amountSelector: AmountSelector | ScrollSelect
  protected abstract readonly currentAmountSelector: AmountSelector | ScrollSelect

  private readonly _valueRefreshIntervalId: number = -1

  protected get current(): T {
    return this.scrollSelector.value
  }

  protected readonly _triggerValueChange = () => {
    const current = this.scrollSelector?.value
    if (current) {
      this.currentAmountSelector.value = this.props.currentAmountProvider(current)
    }
  }

  constructor(props: IProps<T>) {
    super()
    this.props = props
    if (props.enableValueIntervalRefresh) {
      this._valueRefreshIntervalId = setInterval(() => {
        this._triggerValueChange()
      }, 500) as unknown as number
    }
  }

  dispose() {
    super.dispose()

    this.scrollSelector.dispose()
    this.amountSelector.dispose()
    this.currentAmountSelector.dispose()

    clearInterval(this._valueRefreshIntervalId)
  }

  render(): HTMLDivElement {
    const {container, scrollSelector, amountSelector, currentAmountSelector} = this

    container.append(scrollSelector.render())
    container.append(amountSelector.render())
    container.append(currentAmountSelector.render())

    return container
  }

}
