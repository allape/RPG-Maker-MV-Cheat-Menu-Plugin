import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export default class MapSelector extends FilterableScrollSelect<Game_Map> {
  constructor(props?: Pick<IFilterableScrollSelectProps<Game_Map>, 'onChange'>) {
    super({
      ...props,
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword => $dataMapInfos.filter(i => !!i && i.name?.toLowerCase().includes(keyword)) || [],
      nameProvider: item => item?.name,
      placeholder: 'Search Map by Name',
    })
  }
}
