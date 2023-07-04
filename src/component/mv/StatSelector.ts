import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export interface IStat {
  index: number
  name?: string
}

export default class StatSelector extends FilterableScrollSelect<IStat> {
  constructor(props?: Pick<IFilterableScrollSelectProps<IStat>, 'onChange'>) {
    super({
      ...props,
      key: 'StatSelector',
      keymap: ScrollSelect.KeyMap56,
      listProvider: keyword =>
        $dataSystem.terms.params.map((i, ii) => ({
          index: ii,
          name: i,
        })).filter(i => !!i && i.name?.toLowerCase().includes(keyword)) || [],
      nameProvider: item => item?.name,
      placeholder: 'Search Stat by Name',
    })
  }
}