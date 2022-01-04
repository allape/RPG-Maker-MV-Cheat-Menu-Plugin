import {Renderer} from '../core/renderer'
import RowSelect from '../component/ScrollSelect'
import AmountSelector from '../component/AmountSelector'
import Switch from '../component/Switch'

export default class Speed extends Renderer<HTMLDivElement> {

  static KeyMap = {
    speedLock: {
      key: '7',
      code: 'Digit7',
    },
  }

  static MyName = 'Speed'

  private static speed = 4
  private static speedLocked = false

  private readonly amount: AmountSelector
  private readonly currentAmount: AmountSelector
  private readonly speedLocker: Switch

  private readonly _intervalId: number

  constructor() {
    super()

    if (!$gamePlayer._speedCheatInjected) {
      $gamePlayer._speedCheatInjected = true
      Speed.speed = $gamePlayer._moveSpeed
      Object.defineProperty($gamePlayer, "_moveSpeed", {
        get: () => Speed.speed,
        set: (value: number) => {
          if (!Speed.speedLocked) {
            Speed.speed = value
          }
        },
      })
    }

    this.amount = new AmountSelector({
      precision: 2,
      min: 0.01,
      max: 10,
      default: 1,
      increaseFn: v => v + 0.5,
      decreaseFn: v => v - 0.5,
      keymap: RowSelect.KeyMap34,
    })
    this.currentAmount = new AmountSelector({
      readOnly: true,
      keymap: RowSelect.KeyMap56,
      onLess: () => {
        Speed.speed -= this.amount.value
        return true
      },
      onMore: () => {
        Speed.speed += this.amount.value
        return true
      },
    })

    this.speedLocker = new Switch({
      default: Speed.speedLocked,
      keymap: Speed.KeyMap.speedLock,
      onHTML: 'locked',
      offHTML: 'unlocked',
      onChange: value => {
        Speed.speedLocked = value
        this.speedLocker.value = value
      },
    })

    this._intervalId = setInterval(() => {
      this.currentAmount.value = $gamePlayer._moveSpeed
    }, 100) as unknown as number
  }

  dispose() {
    super.dispose()

    this.amount.dispose()
    this.currentAmount.dispose()

    Speed.speedLocked = false

    clearInterval(this._intervalId)
  }

  render(): HTMLDivElement {
    const container = document.createElement('div')
    container.append(this.amount.render())
    container.append(this.currentAmount.render())
    container.append(this.speedLocker.render())
    return container
  }

}
