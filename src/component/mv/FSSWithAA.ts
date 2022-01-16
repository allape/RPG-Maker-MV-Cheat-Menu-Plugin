import {Renderer} from '../../core/renderer'
import AmountSelector from '../AmountSelector'
import FilterableScrollSelect from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export interface IProps {
  // disable an interval to reload current amount value
  disableIntervalRefresh?: boolean
}

/**
 * FSS = {@link FilterableScrollSelect};
 * AA = two {@link AmountSelector}s, one for select value, one current value
 */
export default abstract class FSSWithAA<T> extends Renderer<HTMLDivElement> {

  protected readonly container = document.createElement('div')

  protected abstract readonly scrollSelector: FilterableScrollSelect<T>
  protected abstract readonly amountSelector: AmountSelector | ScrollSelect
  protected abstract readonly currentAmountSelector: AmountSelector | ScrollSelect

  private readonly _valueRefreshIntervalId: number = -1

  protected readonly abstract currentAmountProvider: (value?: T) => any

  protected get current(): T {
    return this.scrollSelector?.value
  }

  protected readonly _triggerValueChange = (): void => {
    const current = this.current
    if (this.currentAmountSelector) {
      this.currentAmountSelector.value = this.currentAmountProvider(current)
    }
  }

  protected constructor(props: IProps = {}) {
    super()
    if (!props.disableIntervalRefresh) {
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
