import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export interface IStat {
  index: number
  name?: string
}

export interface IStatSelectorProps extends Pick<IFilterableScrollSelectProps, 'onChange'> {
  actor?: Game_Actor
}

export default class StatSelector extends FilterableScrollSelect<IStat> {
  constructor(props?: IStatSelectorProps) {
    super({
      ...props,
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
