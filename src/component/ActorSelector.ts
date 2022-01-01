import {Renderer} from '../core/renderer'

export interface IActorSelectorProps {
  onChange?: (actor?: Game_Actor) => void
}

export class ActorSelector extends Renderer {

  private readonly prevButton: HTMLElement = document.createElement('div')
  private readonly nameContainer: HTMLElement = document.createElement('div')
  private readonly nextButton: HTMLElement = document.createElement('div')

  private readonly props: IActorSelectorProps

  private index: number = 0
  private current?: Game_Actor

  private _selectPrev = () => {
    SoundManager.playSystemSound(0)
    this.index = this.index <= 0 ? $gameActors._data.length : (this.index - 1)
    this._onChange()
  }

  private _selectNext = () => {
    SoundManager.playSystemSound(0)
    this.index = this.index >= ($gameActors._data.length - 1) ? 0 : (this.index + 1)
    this._onChange()
  }

  constructor(props: IActorSelectorProps) {
    super()
    this.props = props
    this._onChange()
  }

  private _onChange() {
    this.current = $gameActors._data[this.index]
    this.props.onChange?.(this.current)

    const {index, current, nameContainer} = this
    nameContainer.innerHTML = `${index}: ${current?._name || '(null)'}`
  }

  private static _styleButton(button: HTMLElement) {
    const { style } = button
    style.padding = '0 10px'
    style.color = 'white'
    style.minWidth = '80px'
    style.display = 'flex'
    style.justifyContent = 'center'
    style.alignItems = 'center'
    style.cursor = 'pointer'
  }

  dispose() {
    super.dispose()
    const { prevButton, nextButton } = this
    prevButton.removeEventListener('click', this._selectPrev)
    nextButton.removeEventListener('click', this._selectNext)
  }

  render(): HTMLElement {
    const { prevButton, nameContainer, nextButton } = this

    const container = document.createElement('div')

    container.style.padding = '10px 0'
    container.style.display = 'flex'

    ActorSelector._styleButton(prevButton)
    prevButton.innerHTML = '<'
    prevButton.addEventListener('click', this._selectPrev)
    container.append(prevButton)

    const nameStyle = nameContainer.style
    nameStyle.flex = '1'
    nameStyle.color = 'white'
    nameStyle.textAlign = 'center'
    container.append(nameContainer)

    ActorSelector._styleButton(nextButton)
    nextButton.innerHTML = '>'
    nextButton.addEventListener('click', this._selectNext)
    container.append(nextButton)

    return container
  }
}
