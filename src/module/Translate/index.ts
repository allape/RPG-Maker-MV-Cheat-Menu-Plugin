import { Renderer } from '../../core/renderer'
import 'whatwg-fetch'
import FilterableScrollSelect from '../../component/FilterableScrollSelect'
import Input from '../../component/Input'

interface ILanguage {
  code: string
  name: string
}

export const _cache: Record<string, Record<string, string>> = {}

export default class Translate extends Renderer<HTMLDivElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static stringifyError(e: any): string {
    return e ? ('message' in e ? e.message : e) : 'unknown error'
  }

  private _languages: ILanguage[] = []

  private translatorServerBaseURL = 'https://translate.mentality.rip'
  private sourceLanguage = 'ja'
  private targetLanguage = 'en'

  private readonly urlInput = new Input()
  private readonly retry = document.createElement('button')

  private readonly sourceLanguageSelector = new FilterableScrollSelect<ILanguage>({
    listProvider: keyword => this._languages.filter(i => i.name?.toLowerCase().includes(keyword)),
    nameProvider: v => v.name,
    placeholder: 'Search Language by Name',
    onChange: v => {
      if (v) this.sourceLanguage = v.code
    },
  })

  private readonly targetLanguageSelector = new FilterableScrollSelect<ILanguage>({
    listProvider: keyword => this._languages.filter(i => i.name?.toLowerCase().includes(keyword)),
    nameProvider: v => v.name,
    placeholder: 'Search Language by Name',
    onChange: v => {
      if (v) this.targetLanguage = v.code
    },
  })

  constructor() {
    super()

    this.init().then()
  }

  private async init() {
    this._languages = await this.fetchLanguages()
  }

  private async fetchLanguages(): Promise<ILanguage[]> {
    try {
      const res = await fetch(`${this.translatorServerBaseURL}/languages`)
      return await res.json()
    } catch (e) {
      alert('failed to load support language, please retry: ' + Translate.stringifyError(e))
    }
    return []
  }

  private buildComponent(): HTMLDivElement {
    const { urlInput, retry, sourceLanguageSelector, targetLanguageSelector } = this

    const container = document.createElement('div')
    container.classList.add('module-translate-wrapper')

    const urlRow = document.createElement('div')
    urlRow.classList.add('url-row-wrapper')
    container.append(urlRow)

    const inputCol = document.createElement('div')
    inputCol.classList.add('input-col')
    urlRow.append(inputCol)

    const inputRef = urlInput.render()
    inputRef.addEventListener('change', () => {
      this.translatorServerBaseURL = urlInput.value
    })
    inputCol.append(inputRef)

    retry.innerHTML = 'retry'
    retry.style.display = 'none'
    retry.addEventListener('click', () => {
      this.init().then()
    })
    urlRow.append(retry)

    const languageSelectorRow = document.createElement('div')
    languageSelectorRow.classList.add('language-selector-row')
    container.append(languageSelectorRow)

    // sls = source language selector
    const slsWrapper = document.createElement('div')
    slsWrapper.classList.add('language-selector')
    slsWrapper.append(sourceLanguageSelector.render())
    languageSelectorRow.classList.add('language-selector-row')

    // tls = target language selector
    const tlsWrapper = document.createElement('div')
    tlsWrapper.classList.add('language-selector')
    tlsWrapper.append(targetLanguageSelector.render())

    return container
  }

  public dispose(): void {
    super.dispose()
    this.urlInput.dispose()
    this.sourceLanguageSelector.dispose()
    this.targetLanguageSelector.dispose()
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
