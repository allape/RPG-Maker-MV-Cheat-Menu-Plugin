import FSSWithAA from './FSSWithAA'
import FilterableScrollSelect from '../FilterableScrollSelect'

/**
 * FT = First T
 * ST = Second T
 */
export default abstract class DualFSSWithAA<FT, ST> extends FSSWithAA<FT> {

  protected abstract readonly secondScrollSelector: FilterableScrollSelect<ST>

  protected readonly abstract amountProvider: (f?: FT, s?: ST) => any

  protected readonly currentAmountProvider = () => {
    throw new Error('Do not implement this method!')
  }

  protected get first(): FT | undefined {
    return this.current
  }

  protected get second(): ST | undefined {
    return this.secondScrollSelector?.value
  }

  protected readonly _triggerValueChange = (): void => {
    const f = this.first
    const s = this.second
    if (this.currentAmountSelector) {
      this.currentAmountSelector.value = this.amountProvider(f, s)
    }
  }

  dispose() {
    super.dispose()

    this.secondScrollSelector.dispose()
  }

  render(): HTMLDivElement {
    const {container, scrollSelector, secondScrollSelector, amountSelector, currentAmountSelector} = this

    container.append(scrollSelector.render())
    container.append(secondScrollSelector.render())
    container.append(amountSelector.render())
    container.append(currentAmountSelector.render())

    return container
  }

}
