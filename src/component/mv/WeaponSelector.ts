import FilterableScrollSelect, { IFilterableScrollSelectProps } from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export default class WeaponSelector extends FilterableScrollSelect<Game_Weapon> {
  constructor(props?: Pick<IFilterableScrollSelectProps<Game_Weapon>, 'onChange'>) {
    super({
      ...props,
      key: 'WeaponSelector',
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword => $dataWeapons?.filter(i => !!i && i.name?.toLowerCase().includes(keyword)) || [],
      nameProvider: item => item?.name,
      placeholder: 'Search Weapon by Name',
    })
  }
}
