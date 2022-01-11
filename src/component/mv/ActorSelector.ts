import FilterableScrollSelect from '../FilterableScrollSelect'
import ScrollSelect from '../ScrollSelect'

export default class ActorSelector extends FilterableScrollSelect<Game_Actor> {
  constructor() {
    super({
      keymap: ScrollSelect.KeyMap34,
      listProvider: keyword => $gameActors._data.filter(i => !!i && i._name?.toLowerCase().includes(keyword)) || [],
      nameProvider: item => item?._name,
      placeholder: 'Search Hero by Name',
    })
  }
}
