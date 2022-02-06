import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export interface ISwitch {
  index: number
  name?: string
}

export default class SwitchSelector extends FilterableScrollSelect<ISwitch> {
  constructor(props?: Pick<IFilterableScrollSelectProps<ISwitch>, 'onChange'>) {
    super({
      ...props,
      key: 'SwitchSelector',
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword =>
        $dataSystem.switches.map((i, ii) => ({
          index: ii,
          name: i,
        })).filter(i => !!i && i.name?.toLowerCase().includes(keyword)) || [],
      nameProvider: item => item?.name,
      placeholder: 'Search Switch by Name',
    })
  }
}
