import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export interface IVariable {
  index: number
  name?: string
}

export default class VariableSelector extends FilterableScrollSelect<IVariable> {
  constructor(props?: Pick<IFilterableScrollSelectProps<IVariable>, 'onChange'>) {
    super({
      ...props,
      key: 'VariableSelector',
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword => ($dataSystem.variables || []).map((name, index) => ({
        name,
        index,
      })).filter(i => i.name?.toLowerCase().includes(keyword) || (`${$gameVariables.value(i.index) ?? ''}` === keyword)),
      nameProvider: item => item?.name,
      placeholder: 'Search Variable implicitly by Name or explicitly by Value',
    })
  }
}
