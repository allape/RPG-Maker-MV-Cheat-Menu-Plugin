import {KEY_MAPS, Renderer} from '../core/renderer'
import ScrollSelect from '../component/ScrollSelect'
import AmountSelector from '../component/AmountSelector'
import Switch from '../component/Switch'

export default class MoveSpeed extends Renderer<HTMLDivElement> {

  static KeyMap = {
    speedLock: KEY_MAPS.Digit7,
  }

  static MyName = 'Move Speed'

  private static readonly DEFAULT_SPEED = 4

  private readonly amount: AmountSelector
  private readonly currentAmount: AmountSelector
  private readonly speedLocker: Switch

  private readonly _intervalId: number

  private readonly _onInterval = () => {
    this._inject()
  }

  private _onSpeedChange = () => {
    this.currentAmount.value = $gamePlayer._moveSpeed
  }

  private _inject = (force = false) => {
    if (!$gamePlayer._speedCheatInjected || force) {
      $gamePlayer._speedCheatInjected = true
      // Speed.speed = $gamePlayer._moveSpeed
      Object.defineProperty($gamePlayer, '_moveSpeed', {
        configurable: true,
        get: () => window.__cheat_speed || MoveSpeed.DEFAULT_SPEED,
        set: (value: number) => {
          if (!window.__cheat_speedLocked) {
            window.__cheat_speed = value
          }
        },
      })
    }
  }

  constructor() {
    super()

    if (window.__cheat_speed === undefined) {
      window.__cheat_speed = $gamePlayer._moveSpeed || MoveSpeed.DEFAULT_SPEED
    }

    this.amount = new AmountSelector({
      precision: 2,
      min: 0.01,
      max: 10,
      default: 1,
      increaseFn: v => v + 0.5,
      decreaseFn: v => v - 0.5,
      keymap: ScrollSelect.KeyMap34,
    })

    this.currentAmount = new AmountSelector({
      precision: 2,
      readOnly: true,
      keymap: ScrollSelect.KeyMap56,
      onLess: () => {
        window.__cheat_speed -= this.amount.value
        this._onSpeedChange()
        return true
      },
      onMore: () => {
        window.__cheat_speed += this.amount.value
        this._onSpeedChange()
        return true
      },
    })

    this.speedLocker = new Switch({
      label: 'Lock Speed',
      default: window.__cheat_speedLocked,
      keymap: MoveSpeed.KeyMap.speedLock,
      onHTML: 'locked',
      offHTML: 'unlocked',
      onChange: value => {
        window.__cheat_speedLocked = value
        this.speedLocker.value = value
        SoundManager.playSystemSound(value ? 1 : 2)
        if (value) {
          this._inject(true)
        }
      },
    })

    this._intervalId = setInterval(() => {
      this._onInterval()
      this._onSpeedChange()
    }, 100) as unknown as number
  }

  dispose() {
    super.dispose()

    this.amount.dispose()
    this.currentAmount.dispose()
    this.speedLocker.dispose()

    // Speed.speedLocked = false

    clearInterval(this._intervalId)
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')
    container.append(this.amount.render())
    container.append(this.currentAmount.render())
    container.append(this.speedLocker.render())

    this._onSpeedChange()

    return container
  }

}
