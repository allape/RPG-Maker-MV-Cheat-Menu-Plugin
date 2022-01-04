import './App.scss'
import {Renderer} from './core/renderer'
import GodMode from './module/GodMode'
import MV from './core/mv'
import {space2line} from './core/dom'
import Items from './module/Items'
import Gold from './module/Gold'
import Speed from './module/Speed'

export type SubRenderer<T extends Renderer = any> = T

export default class App extends Renderer<HTMLDivElement> {

  static KeyMap = {
    toggle: {
      key: '1',
      code: 'Digit1',
    },
    back: {
      key: '2',
      code: 'Digit2',
    },
  }

  static Modules: SubRenderer[] = [
    GodMode as SubRenderer,
    Speed as SubRenderer,
    Gold as SubRenderer,
    Items as SubRenderer,
  ]

  private readonly wrapper = document.createElement('div')
  private readonly navBackButton = document.createElement('div')
  private readonly navTextContainer = document.createElement('div')
  private readonly container = document.createElement('div')
  private readonly homeContainer = document.createElement('div')

  private _currentModule?: Renderer = undefined

  private _showHome = () => {
    SoundManager.playSystemSound(0)

    this._currentModule?.dispose()
    this._currentModule = undefined

    this.navBackButton.style.opacity = '0'
    this.navTextContainer.innerHTML = ''

    this.container.innerHTML = ''
    this.container.append(this.homeContainer)
  }

  private _buildModule = (m: SubRenderer) => {
    if (MV.singleton().visible) {
      this._currentModule?.dispose()

      SoundManager.playSystemSound(1)

      this.navBackButton.style.opacity = '1'
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

  private _onKeydown = (e: KeyboardEvent) => {
    switch (e.code) {
      case App.KeyMap.toggle.code: this._onToggle(); break
      case App.KeyMap.back.code:
        if (MV.singleton().visible && this._currentModule) {
          this._showHome();
        }
        break
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

    const navTitle = this.navTextContainer
    navTitle.classList.add('nav-title')
    navTitle.innerHTML = ''
    nav.append(navTitle)

    const navClose = document.createElement('div')
    navClose.classList.add('nav-button')
    navClose.innerHTML = `x [${App.KeyMap.toggle.key}]`
    navClose.addEventListener('click', this._onToggle)
    nav.append(navClose)

    return nav
  }

  private _buildHome() {
    const container = this.homeContainer
    container.classList.add('cheater-items-wrapper')
    container.append(...(App.Modules.map((m, i) => {
      const mItemContainer = document.createElement('div')
      mItemContainer.classList.add('cheater-item-wrapper')
      mItemContainer.innerHTML = space2line(m.MyName)
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

    this._buildHome()

    container.classList.add('as-cheater-container')
    wrapper.append(container)

    this._showHome()

    return wrapper
  }

}
