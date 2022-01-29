import './App.scss'
import {IKeyMap, KEY_MAPS, Renderer} from './core/renderer'
import GodMode from './module/GodMode'
import MV from './core/mv'
import {space2line} from './core/dom'
import Items from './module/Items'
import Gold from './module/Gold'
import Speed from './module/Speed'
import Variables from './module/Variables'
import PartyHP from './module/PartyHP'
import PartyMP from './module/PartyMP'
import PartyTP from './module/PartyTP'
import EnemyHP from './module/EnemyHP'
import Stat from './module/Stat'
import Weapons from './module/Weapons'
import Armors from './module/Armors'
import NoClip from './module/NoClip'
import GiveExp from './module/GiveExp'
import Switches from './module/Switches'
import Teleport from './module/Teleport'
import Translate from './module/Translate'

// eslint-disable-next-line
export type SubRenderer<T extends Renderer = any> = T
export interface SubRenderers {
  keymap?: IKeyMap
  module: SubRenderer
}

export default class App extends Renderer<HTMLDivElement> {

  static KeyMap = {
    toggle: KEY_MAPS.Digit1,
    back: KEY_MAPS.Digit2,
    next: KEY_MAPS.Backquote,
  }

  static ModulesKeymaps = [
    KEY_MAPS.Digit3,
    KEY_MAPS.Digit4,
    KEY_MAPS.Digit5,
    KEY_MAPS.Digit6,
    KEY_MAPS.Digit7,
    KEY_MAPS.Digit8,
    KEY_MAPS.Digit9,
    KEY_MAPS.Digit0,
    KEY_MAPS.Minus,
    KEY_MAPS.Equal,
  ]

  static Modules: SubRenderers[] = [
    {
      module: GodMode as SubRenderer,
    },
    {
      module: Speed as SubRenderer,
    },
    {
      module: Gold as SubRenderer,
    },
    {
      module: Items as SubRenderer,
    },
    {
      module: Variables as SubRenderer,
    },
    {
      module: EnemyHP as SubRenderer,
    },
    {
      module: PartyMP as SubRenderer,
    },
    {
      module: PartyTP as SubRenderer,
    },
    {
      module: PartyHP as SubRenderer,
    },
    {
      module: Stat as SubRenderer,
    },
    {
      module: Weapons as SubRenderer,
    },
    {
      module: Armors as SubRenderer,
    },
    {
      module: NoClip as SubRenderer,
    },
    {
      module: GiveExp as SubRenderer,
    },
    {
      module: Switches as SubRenderer,
    },
    {
      module: Teleport as SubRenderer,
    },
    {
      module: Translate as SubRenderer,
    },
  ]

  private readonly wrapper = document.createElement('div')
  private readonly navBackButton = document.createElement('div')
  private readonly navShiftButton = document.createElement('div')
  private readonly navNextButton = document.createElement('div')
  private readonly navTextContainer = document.createElement('div')
  private readonly container = document.createElement('div')

  private _currentModule?: Renderer = undefined

  /**
   * used for shifting shortcut for modules
   */
  private _moduleIndexFactor = 0

  private _showHome = () => {
    if (this._currentModule) {
      this._currentModule.dispose()
      this._currentModule = undefined
    }

    this.navBackButton.style.display = 'none'
    this.navShiftButton.style.display = 'block'
    this.navNextButton.style.display = 'none'
    this.navTextContainer.innerHTML = ''

    this.container.innerHTML = ''
    this.container.append(this._buildHome())

    SoundManager.playSystemSound(0)
  }

  private _nextModule = () => {
    if (this._currentModule) {
      let currentIndex = App.Modules.findIndex(i => i.module === (this._currentModule as unknown as typeof Function).constructor)
      currentIndex = (currentIndex >= App.Modules.length - 1 ? -1 : currentIndex) + 1
      this._buildModule(App.Modules[currentIndex].module)
    }
  }

  private _buildModule = (m: SubRenderer) => {
    if (MV.singleton().visible) {
      this._currentModule?.dispose()

      SoundManager.playSystemSound(1)

      this.navBackButton.style.display = 'block'
      this.navShiftButton.style.display = 'none'
      this.navNextButton.style.display = 'block'
      this.navTextContainer.innerHTML = m.MyName

      this._currentModule = new m()

      this.container.innerHTML = ''
      this.container.append(this._currentModule.render())
    }
  }

  private _onToggle = () => {
    const mv = MV.singleton()
    mv.visible = !mv.visible

    this.wrapper.style.transform = mv.visible ? 'translateY(0)' : 'translateY(-100%)'

    SoundManager.playSystemSound(mv.visible ? 1 : 0)
  }

  private _shiftShortcuts = () => {
    const maxFactor = Math.floor(App.Modules.length / App.ModulesKeymaps.length)
    this._moduleIndexFactor = this._moduleIndexFactor >= maxFactor ? 0 : (this._moduleIndexFactor + 1)
    this._showHome()
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (MV.singleton().visible) {
      if (this._currentModule) {
        // not at home, then show home
        switch (e.code) {
        case App.KeyMap.back.code:
          this._showHome()
          break
        case App.KeyMap.next.code:
          this._nextModule()
          break
        }
      } else {
        if (e.code === App.KeyMap.back.code) {
          // shift shortcuts
          this._shiftShortcuts()
        } else {
          // module select
          const m = App.Modules.find(i => i.keymap?.code === e.code)?.module
          if (m) this._buildModule(m)
        }
      }
    }
    switch (e.code) {
    case App.KeyMap.toggle.code: this._onToggle(); break
    }
  }

  constructor() {
    super()
    window.addEventListener('keydown', this._onKeydown)
  }

  private _buildNav() {
    const nav = document.createElement('nav')
    nav.classList.add('cheater-nav')

    const navBack = this.navBackButton
    navBack.classList.add('nav-button')
    navBack.innerHTML = `← [${App.KeyMap.back.key}]`
    navBack.addEventListener('click', this._showHome)
    nav.append(navBack)

    const navShift = this.navShiftButton
    navShift.classList.add('nav-button')
    navShift.innerHTML = `[${App.KeyMap.back.key}] Shift Shortcuts`
    navShift.addEventListener('click', this._shiftShortcuts)
    nav.append(navShift)

    const navNext = this.navNextButton
    navNext.classList.add('nav-button')
    navNext.innerHTML = `[${App.KeyMap.next.key}] Next`
    navNext.addEventListener('click', this._nextModule)
    nav.append(navNext)

    const navTitle = this.navTextContainer
    navTitle.classList.add('nav-title')
    navTitle.innerHTML = ''
    nav.append(navTitle)

    const navClose = document.createElement('div')
    navClose.classList.add('nav-button')
    navClose.innerHTML = `[${App.KeyMap.toggle.key}] ✕`
    navClose.addEventListener('click', this._onToggle)
    nav.append(navClose)

    return nav
  }

  private _buildHome() {
    const container = document.createElement('div')
    container.classList.add('cheater-items-wrapper')

    const keymapLength = App.ModulesKeymaps.length

    container.append(...(App.Modules.map((m, i) => {
      // shortcut apples to shift
      m.keymap = Math.floor(i / keymapLength) === this._moduleIndexFactor ?
        App.ModulesKeymaps[i % keymapLength] : undefined

      const mItemContainer = document.createElement('div')
      mItemContainer.classList.add('cheater-item-wrapper')
      mItemContainer.innerHTML = space2line(`${m.module.MyName}${m.keymap ? ` [${m.keymap.key}]` : ' <br>'}`)
      mItemContainer.setAttribute('data-index', `${i}`)
      mItemContainer.addEventListener('click', () => {
        this._buildModule(m.module)
      })
      return mItemContainer
    })))
    return container
  }

  dispose() {
    super.dispose()
    window.removeEventListener('keydown', this._onKeydown)
  }

  render(): HTMLDivElement {
    const {wrapper, container} = this

    wrapper.addEventListener('click', e => {
      e.stopPropagation()
    })

    wrapper.classList.add('as-cheater-container-wrapper')
    wrapper.style.zIndex = `${Number.MAX_SAFE_INTEGER}`

    wrapper.append(this._buildNav())

    container.classList.add('as-cheater-container')
    wrapper.append(container)

    this._showHome()

    wrapper.addEventListener('mousedown', e => {
      e.stopImmediatePropagation()
    }, true)

    return wrapper
  }

}
