import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export interface IVariable {
  index: number
  name?: string
}

export default class VariableSelector extends FilterableScrollSelect<IVariable> {
  constructor(props?: Pick<IFilterableScrollSelectProps, 'onChange'>) {
    super({
      ...props,
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword => ($dataSystem.variables || []).map((name, index) => ({
        name,
        index,
      })).filter(i => i.name?.toLowerCase().includes(keyword)),
      nameProvider: item => item?.name,
      placeholder: 'Search Variable by Name',
    })
  }
}
