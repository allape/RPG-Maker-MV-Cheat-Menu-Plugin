import './App.scss'
import {IKeyMap, KEY_MAPS, Renderer} from './core/renderer'
import GodMode from './module/GodMode'
import MV from './core/mv'
import {createKeyMapLabel, space2line} from './core/dom'
import Items from './module/Items'
import Gold from './module/Gold'
import MoveSpeed from './module/MoveSpeed'
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
import SpeedHack from './module/SpeedHack'
import SaveGame from './module/SaveGame'
import ClearStates from './module/ClearStates'

// eslint-disable-next-line
export type RenderClass<T extends Renderer = any> = T
export interface IModule {
  keymap?: IKeyMap
  // css width
  width?: string
  module: RenderClass
}

export default class App extends Renderer<HTMLDivElement> {

  static KeyMap = {
    toggle: KEY_MAPS.Digit1,
    back: KEY_MAPS.Digit2,
    prev: KEY_MAPS.Backquote,
    next: KEY_MAPS.Equal,
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
  ]

  static Modules: IModule[] = [
    {
      module: GodMode as RenderClass,
    },
    {
      module: MoveSpeed as RenderClass,
    },
    {
      module: Gold as RenderClass,
    },
    {
      module: Items as RenderClass,
    },
    {
      module: Variables as RenderClass,
    },
    {
      module: Stat as RenderClass,
    },
    {
      module: Translate as RenderClass,
    },
    {
      module: SpeedHack as RenderClass,
    },
    {
      module: EnemyHP as RenderClass,
    },
    {
      module: PartyHP as RenderClass,
    },
    {
      module: PartyMP as RenderClass,
    },
    {
      module: PartyTP as RenderClass,
    },
    {
      module: Teleport as RenderClass,
    },
    {
      module: NoClip as RenderClass,
    },
    {
      module: GiveExp as RenderClass,
    },
    {
      module: Switches as RenderClass,
    },
    {
      module: Weapons as RenderClass,
    },
    {
      module: Armors as RenderClass,
    },
    {
      module: ClearStates as RenderClass,
    },
    {
      module: SaveGame as RenderClass,
    },
  ]

  private readonly wrapper = document.createElement('div')
  private readonly navBackButton = document.createElement('div')
  private readonly navShiftButton = document.createElement('div')
  private readonly navPrevButton = document.createElement('div')
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
    this.navPrevButton.style.display = 'none'
    this.navNextButton.style.display = 'none'
    this.navTextContainer.innerHTML = 'Cheat Menu'

    this.container.innerHTML = ''
    this.container.append(this._buildHome())

    SoundManager.playSystemSound(0)
  }

  private _prevModule = () => {
    if (this._currentModule) {
      let currentIndex = App.Modules.findIndex(i => i.module === (this._currentModule as unknown as typeof Function).constructor)
      currentIndex = (currentIndex <= 0 ? App.Modules.length : currentIndex) - 1
      this._buildModule(App.Modules[currentIndex])
    }
  }

  private _nextModule = () => {
    if (this._currentModule) {
      let currentIndex = App.Modules.findIndex(i => i.module === (this._currentModule as unknown as typeof Function).constructor)
      currentIndex = (currentIndex >= App.Modules.length - 1 ? -1 : currentIndex) + 1
      this._buildModule(App.Modules[currentIndex])
    }
  }

  private _buildModule = (module: IModule) => {
    if (MV.singleton().visible) {
      const {module: m, width} = module

      this._currentModule?.dispose()

      SoundManager.playSystemSound(1)

      this.navBackButton.style.display = 'block'
      this.navShiftButton.style.display = 'none'
      this.navPrevButton.style.display = 'block'
      this.navNextButton.style.display = 'block'
      this.navTextContainer.innerHTML = m.MyName

      this._currentModule = new m()
      const moduleWrapper = document.createElement('div')
      moduleWrapper.style.width = width || '500px'
      moduleWrapper.append(this._currentModule.render())
      
      this.container.innerHTML = ''
      this.container.append(moduleWrapper)
    }
  }

  private _onToggle = () => {
    const mv = MV.singleton()
    mv.visible = !mv.visible

    const wc = this.wrapper.classList
    if (mv.visible) {
      wc.add('shown')
    } else {
      wc.remove('shown')
    }

    SoundManager.playSystemSound(mv.visible ? 1 : 0)
  }

  private _shiftShortcuts = () => {
    const ml = App.Modules.length
    const mkl = App.ModulesKeymaps.length
    const maxFactor =  Math.floor(ml / mkl) - (ml % mkl === 0 ? 1 : 0)
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
        case App.KeyMap.prev.code:
          this._prevModule()
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
          const m = App.Modules.find(i => i.keymap?.code === e.code)
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
    navBack.append(createKeyMapLabel(App.KeyMap.back, '↩', 'Back Home', { namePosition: 'left' }))
    navBack.addEventListener('click', this._showHome)
    nav.append(navBack)

    const navShift = this.navShiftButton
    navShift.classList.add('nav-button')
    navShift.append(createKeyMapLabel(App.KeyMap.back, '⟳', 'Shift Shortcuts', { namePosition: 'left' }))
    navShift.addEventListener('click', this._shiftShortcuts)
    nav.append(navShift)

    const navTitle = this.navTextContainer
    navTitle.classList.add('nav-title')
    navTitle.innerHTML = ''
    nav.append(navTitle)

    const navPrev = this.navPrevButton
    navPrev.classList.add('nav-button')
    navPrev.append(createKeyMapLabel(App.KeyMap.prev, '←', 'Previous Module', { namePosition: 'left' }))
    navPrev.addEventListener('click', this._prevModule)
    nav.append(navPrev)

    const navNext = this.navNextButton
    navNext.classList.add('nav-button')
    navNext.append(createKeyMapLabel(App.KeyMap.next, '→', 'Next Module'))
    navNext.addEventListener('click', this._nextModule)
    nav.append(navNext)

    const navClose = document.createElement('div')
    navClose.classList.add('nav-button')
    navClose.append(createKeyMapLabel(App.KeyMap.toggle, '✕', 'Close or Open'))
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
      mItemContainer.innerHTML = space2line(`${m.module.MyName}`) +
        (m.keymap ? `<div>${createKeyMapLabel(m.keymap).outerHTML}</div>` : '<br>')
      mItemContainer.setAttribute('data-index', `${i}`)
      mItemContainer.addEventListener('click', () => {
        this._buildModule(m)
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
