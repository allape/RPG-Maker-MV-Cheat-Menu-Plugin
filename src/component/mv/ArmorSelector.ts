import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export default class ArmorSelector extends FilterableScrollSelect<Game_Armor> {
  constructor(props?: Pick<IFilterableScrollSelectProps, 'onChange'>) {
    super({
      ...props,
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword => $dataArmors?.filter(i => !!i && i.name?.toLowerCase().includes(keyword)) || [],
      nameProvider: item => item?.name,
      placeholder: 'Search Armor by Name',
    })
  }
}
