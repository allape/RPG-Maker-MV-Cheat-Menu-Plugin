import { KeyMaps, KEY_MAPS, Renderer } from '../../core/renderer'
import 'whatwg-fetch'
import FilterableScrollSelect from '../../component/FilterableScrollSelect'
import Input from '../../component/Input'
import ScrollSelect from '../../component/ScrollSelect'
import './index.scss'

interface ILanguage {
  code: string
  name: string
}

export const _cache: Record<string, Record<string, string>> = {}

/**
 * sls = source language selector
 * tls = target language selector
 */
export default class Translate extends Renderer<HTMLDivElement> {
  static MyName = 'Translate'

  static KeyMap: KeyMaps = {
    reload: KEY_MAPS.Equal,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static stringifyError(e: any): string {
    return e ? ('message' in e ? e.message : e) : 'unknown error'
  }

  private _loading = false
  private _languages: ILanguage[] = []

  private translatorServerBaseURL = 'https://translate.mentality.rip'
  private sourceLanguage = 'ja'
  private targetLanguage = 'en'

  private readonly urlInput = new Input()
  private readonly retry = document.createElement('button')

  // private readonly slsTitle = new Title({ title: 'Source Language' })
  private readonly sls = new FilterableScrollSelect<ILanguage>({
    keymap: ScrollSelect.KeyMap34,
    listProvider: keyword => this._languages.filter(i => i.name?.toLowerCase().includes(keyword)),
    nameProvider: v => v?.name,
    placeholder: 'Search Source Language by Name',
    onChange: v => {
      if (v) this.sourceLanguage = v.code
    },
  })

  // private readonly tlsTitle = new Title({ title: 'Target Language' })
  private readonly tls = new FilterableScrollSelect<ILanguage>({
    keymap: ScrollSelect.KeyMap56,
    listProvider: keyword => this._languages.filter(i => i.name?.toLowerCase().includes(keyword)),
    nameProvider: v => v?.name,
    placeholder: 'Search Target Language by Name',
    onChange: v => {
      if (v) this.targetLanguage = v.code
    },
  })

  private _onKeydown = (e: KeyboardEvent) => {
    switch (e.code) {
    case Translate.KeyMap.reload.code: this.init().then(); break
    }
  }

  constructor() {
    super()

    this.init().then()
    window.addEventListener('keydown', this._onKeydown)
  }

  private async init() {
    if (this._loading) return
    this._languages = await this.fetchLanguages()
    this.sls.index = this._languages.findIndex(i => i.code === this.sourceLanguage)
    this.tls.index = this._languages.findIndex(i => i.code === this.targetLanguage)
  }

  private async fetchLanguages(): Promise<ILanguage[]> {
    try {
      this._loading = true
      const res = await fetch(`${this.translatorServerBaseURL}/languages`)
      return await res.json()
    } catch (e) {
      alert('failed to load support language, please retry: ' + Translate.stringifyError(e))
    } finally {
      this._loading = false
    }
    return []
  }

  private buildComponent(): HTMLDivElement {
    const { urlInput, retry, sls, tls } = this

    const container = document.createElement('div')
    container.classList.add('module-translate-wrapper')

    const urlRow = document.createElement('div')
    urlRow.classList.add('url-row-wrapper')
    container.append(urlRow)

    const inputCol = document.createElement('div')
    inputCol.classList.add('input-col')
    urlRow.append(inputCol)

    const inputRef = urlInput.render()
    inputRef.placeholder = 'URL is required'
    inputRef.value = this.translatorServerBaseURL
    inputRef.addEventListener('change', () => {
      this.translatorServerBaseURL = urlInput.value
    })
    inputCol.append(inputRef)

    retry.innerHTML = `RELOAD [${Translate.KeyMap.reload.key}]`
    retry.addEventListener('click', () => {
      this.init().then()
    })
    urlRow.append(retry)

    const languageSelectorRow = document.createElement('div')
    languageSelectorRow.classList.add('language-selector-row')
    container.append(languageSelectorRow)

    const slsWrapper = document.createElement('div')
    slsWrapper.classList.add('language-selector')
    slsWrapper.append(sls.render())
    languageSelectorRow.append(slsWrapper)

    const tlsWrapper = document.createElement('div')
    tlsWrapper.classList.add('language-selector')
    tlsWrapper.append(tls.render())
    languageSelectorRow.append(tlsWrapper)

    return container
  }

  public dispose(): void {
    super.dispose()
    this.urlInput.dispose()
    this.sls.dispose()
    this.tls.dispose()
    window.removeEventListener('keydown', this._onKeydown)
  }

  render(): HTMLDivElement {
    if (!('fetch' in window)) {
      alert('This game is not support network operations')
    } if (window.__permission_network || confirm('This function requires NETWORK to operate, continue?')) {
      window.__permission_network = true
      return this.buildComponent()
    }
    return document.createElement('div')
  }

}
