import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export default class ItemSelector extends FilterableScrollSelect<Game_Item> {
  constructor(props?: Pick<IFilterableScrollSelectProps, 'onChange'>) {
    super({
      ...props,
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword => $dataItems?.filter(i => !!i && i.name?.toLowerCase().includes(keyword)) || [],
      nameProvider: item => item?.name,
      placeholder: 'Search Item by Name',
    })
  }
}
