import { Renderer } from '../../core/renderer'
import AmountSelector from '../AmountSelector'
import FilterableScrollSelect from '../FilterableScrollSelect'

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

  private readonly container = document.createElement('div')

  protected abstract readonly scrollSelector: FilterableScrollSelect<T>
  protected abstract readonly amountSelector: AmountSelector
  protected abstract readonly currentAmountSelector: AmountSelector

  private readonly _valueRefreshIntervalId: number = -1

  protected get current(): T {
    return this.scrollSelector.value
  }

  constructor(props: IProps<T>) {
    super()
    if (props.enableValueIntervalRefresh) {
      this._valueRefreshIntervalId = setInterval(() => {
        const current = this.scrollSelector?.value
        if (current) {
          this.currentAmountSelector.value = props.currentAmountProvider(this.scrollSelector.value)
        }
      }, 100) as unknown as number
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
