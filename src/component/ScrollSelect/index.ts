import './index.scss'
import {IKeyMap, KeyMaps, Renderer} from '../../core/renderer'

export interface IRowSelectKeyMap extends KeyMaps {
  left?: IKeyMap
  center?: IKeyMap
  right?: IKeyMap
}

export interface IRowSelectProps {
  leftText?: string
  rightText?: string
  keymap?: IRowSelectKeyMap,
  onLeft?: (e?: Event) => void
  onRight?: (e?: Event) => void
  onCenter?: (e?: Event) => void
}

export default class RowSelect extends Renderer<HTMLDivElement> {

  static KeyMap34: IRowSelectKeyMap = {
    left: {
      key: '3',
      code: 'Digit3',
    },
    right: {
      key: '4',
      code: 'Digit4',
    },
  }

  static KeyMap56: IRowSelectKeyMap = {
    left: {
      key: '5',
      code: 'Digit5',
    },
    right: {
      key: '6',
      code: 'Digit6',
    },
  }

  static KeyMap78: IRowSelectKeyMap = {
    left: {
      key: '7',
      code: 'Digit7',
    },
    right: {
      key: '8',
      code: 'Digit8',
    },
  }

  static KeyMap90: IRowSelectKeyMap = {
    left: {
      key: '9',
      code: 'Digit9',
    },
    right: {
      key: '0',
      code: 'Digit0',
    },
  }

  private readonly props: IRowSelectProps

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
      SoundManager.playSystemSound(1)
      this.props.onLeft(e)
    }
  }

  private readonly _onCenter = (e?: Event) => {
    if (this.props.onCenter) {
      SoundManager.playSystemSound(0)
      this.props.onCenter(e)
    }
  }

  private readonly _onRight = (e?: Event) => {
    if (this.props.onRight) {
      SoundManager.playSystemSound(2)
      this.props.onRight(e)
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

  constructor(props?: IRowSelectProps) {
    super()

    this.props = props || {}
    this.props.keymap = this.props.keymap || {}

    window.addEventListener('keydown', this._onKeydown, true)
  }

  dispose() {
    super.dispose()
    window.removeEventListener('keydown', this._onKeydown, true)
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
