import './index.scss'
import {Renderer} from '../../core/renderer'

export interface ITitleProps {
  title?: string
}

export default class Title extends Renderer<HTMLDivElement> {

  private readonly text = document.createElement('div')

  set title(v: string) {
    this.text.innerHTML = v
    this.text.title = v
  }

  constructor(props?: ITitleProps) {
    super()

    if (props.title) this.title = props.title

    this.text.classList.add('title-wrapper')
  }

  render(): HTMLDivElement {
    return this.text
  }
}
