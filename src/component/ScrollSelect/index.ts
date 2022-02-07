import './index.scss'
import {IKeyMap, KEY_MAPS, KeyMaps, Renderer} from '../../core/renderer'
import MV from '../../core/mv'
import {createKeyMapLabel} from '../../core/dom'

export interface IScrollSelectKeyMap extends KeyMaps {
  left?: IKeyMap
  center?: IKeyMap
  right?: IKeyMap
}

export interface IScrollSelectProps {
  keymap?: IScrollSelectKeyMap
  valueProvider?: (value: string) => void
  leftText?: string
  rightText?: string
  centerPrefix?: HTMLElement | string
  center?: HTMLElement | string
  centerSuffix?: HTMLElement | string
  onLeft?: (e?: Event) => boolean | void
  onRight?: (e?: Event) => boolean | void
  onCenter?: (e?: Event) => boolean | void
}

export default class ScrollSelect extends Renderer<HTMLDivElement> {

  static KeyMap34: IScrollSelectKeyMap = {
    left: KEY_MAPS.Digit3,
    right: KEY_MAPS.Digit4,
  }

  static KeyMap56: IScrollSelectKeyMap = {
    left: KEY_MAPS.Digit5,
    right: KEY_MAPS.Digit6,
  }

  static KeyMap78: IScrollSelectKeyMap = {
    left: KEY_MAPS.Digit7,
    right: KEY_MAPS.Digit8,
  }

  static KeyMap90: IScrollSelectKeyMap = {
    left: KEY_MAPS.Digit9,
    right: KEY_MAPS.Digit0,
  }

  static readonly DEFAULT_LEFT_ARROW = '←'
  static readonly DEFAULT_RIGHT_ARROW = '→'

  private readonly props: IScrollSelectProps

  private readonly row = document.createElement('div')
  private readonly left = document.createElement('div')
  private readonly text = document.createElement('div')
  private readonly right = document.createElement('div')

  set value(v: string) {
    if (this.props.valueProvider) {
      this.props.valueProvider(v)
    } else {
      this.text.innerHTML = v
      this.text.title = v
    }
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
        SoundManager.playSystemSound(0)
      }
    }
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (MV.singleton().visible) {
      const {left, center, right} = this.props.keymap
      if (left && e.code === left.code) {
        this._onLeft(e)
      }
      if (center && e.code === center.code) {
        this._onCenter(e)
      }
      if (right && e.code === right.code) {
        this._onRight(e)
      }
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
      centerPrefix,
      center,
      centerSuffix,
    }} = this

    row.classList.add('row-select-wrapper')

    left.classList.add('button')
    left.append(
      keymap.left ?
        createKeyMapLabel(keymap.left, leftText || ScrollSelect.DEFAULT_LEFT_ARROW)
        :
        (leftText || ScrollSelect.DEFAULT_LEFT_ARROW)
    )
    left.addEventListener('click', this._onLeft)
    row.append(left)

    text.classList.add('text')
    text.addEventListener('click', this._onCenter)
    if (centerPrefix) {
      text.append(centerPrefix)
    }
    if (center) {
      text.append(center)
    }
    if (centerSuffix) {
      text.append(centerSuffix)
    }
    row.append(text)

    right.classList.add('button')
    right.append(
      keymap.right ?
        createKeyMapLabel(keymap.right, rightText || ScrollSelect.DEFAULT_RIGHT_ARROW, 'left')
        :
        (rightText || ScrollSelect.DEFAULT_RIGHT_ARROW)
    )
    right.addEventListener('click', this._onRight)
    row.append(right)

    return row
  }

}
