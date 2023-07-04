import FilterableScrollSelect, {IFilterableScrollSelectProps} from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export default class MapSelector extends FilterableScrollSelect<Game_Map_Info> {
  constructor(props?: Pick<IFilterableScrollSelectProps<Game_Map_Info>, 'onChange'>) {
    super({
      ...props,
      key: 'MapSelector',
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword => $dataMapInfos.filter(i =>
        !!i
        &&
        (
          // id searching
          (() => {
            const id = $dataMapInfos.indexOf(i)
            return (id !== -1 && `${id}`.toLowerCase().includes(keyword))
          })()
          ||
          // name searching
          i.name?.toLowerCase().includes(keyword)
        )
      ) || [],
      nameProvider: item => item ? `${item.name} (${$dataMapInfos.indexOf(item)})` : undefined,
      placeholder: 'Search Map by Name or ID',
    })
  }
}