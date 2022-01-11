import './index.scss'
import {IKeyMap, KeyMaps, Renderer} from '../../core/renderer'

export interface IScrollSelectKeyMap extends KeyMaps {
  left?: IKeyMap
  center?: IKeyMap
  right?: IKeyMap
}

export interface IScrollSelectProps {
  leftText?: string
  rightText?: string
  keymap?: IScrollSelectKeyMap,
  onLeft?: (e?: Event) => boolean | void
  onRight?: (e?: Event) => boolean | void
  onCenter?: (e?: Event) => boolean | void
}

export default class ScrollSelect extends Renderer<HTMLDivElement> {

  static KeyMap34: IScrollSelectKeyMap = {
    left: {
      key: '3',
      code: 'Digit3',
    },
    right: {
      key: '4',
      code: 'Digit4',
    },
  }

  static KeyMap56: IScrollSelectKeyMap = {
    left: {
      key: '5',
      code: 'Digit5',
    },
    right: {
      key: '6',
      code: 'Digit6',
    },
  }

  static KeyMap78: IScrollSelectKeyMap = {
    left: {
      key: '7',
      code: 'Digit7',
    },
    right: {
      key: '8',
      code: 'Digit8',
    },
  }

  static KeyMap90: IScrollSelectKeyMap = {
    left: {
      key: '9',
      code: 'Digit9',
    },
    right: {
      key: '0',
      code: 'Digit0',
    },
  }

  private readonly props: IScrollSelectProps

  readonly row = document.createElement('div')
  readonly left = document.createElement('div')
  readonly text = document.createElement('div')
  readonly right = document.createElement('div')

  set value(v: string) {
    this.text.innerHTML = v
    this.text.title = v
  }

  private readonly _onLeft = (e?: Event) => {
    if (this.props.onLeft) {
      if (!this.props.onLeft(e)) {
        SoundManager.playSystemSound(1)
      }
    }
  }

  private readonly _onCenter = (e?: Event) => {
    if (this.props.onCenter) {
      if (!this.props.onCenter(e)) {
        SoundManager.playSystemSound(0)
      }
    }
  }

  private readonly _onRight = (e?: Event) => {
    if (this.props.onRight) {
      if (!this.props.onRight(e)) {
        SoundManager.playSystemSound(2)
      }
    }
  }

  private _onKeydown = (e: KeyboardEvent) => {
    const {left, center, right} = this.props.keymap
    if (left && e.code === left.code) {
      this._onLeft(e);
    }
    if (center && e.code === center.code) {
      this._onCenter(e);
    }
    if (right && e.code === right.code) {
      this._onRight(e);
    }
  }

  constructor(props?: IScrollSelectProps) {
    super()

    this.props = props || {}
    this.props.keymap = this.props.keymap || {}

    window.addEventListener('keydown', this._onKeydown)
  }

  dispose() {
    super.dispose()
    window.removeEventListener('keydown', this._onKeydown)
  }

  render(): HTMLDivElement {
    const {row, left, text, right, props: {
      leftText,
      rightText,
      keymap,
    }} = this

    row.classList.add('row-select-wrapper')

    left.classList.add('button')
    left.innerHTML = `${keymap.left ? `[${keymap.left.key}] ` : ''}${leftText || '<'}`
    left.addEventListener('click', this._onLeft)
    row.append(left)

    text.classList.add('text')
    text.addEventListener('click', this._onCenter)
    row.append(text)

    right.classList.add('button')
    right.innerHTML = `${rightText || '>'}${keymap.right ? ` [${keymap.right.key}]` : ''}`
    right.addEventListener('click', this._onRight)
    row.append(right)

    return row
  }

}
