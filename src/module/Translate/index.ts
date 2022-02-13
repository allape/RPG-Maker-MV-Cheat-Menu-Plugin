import {KEY_MAPS, KeyMaps, Renderer} from '../../core/renderer'
import FilterableScrollSelect from '../../component/FilterableScrollSelect'
import Input from '../../component/Input'
import ScrollSelect from '../../component/ScrollSelect'
import MV from '../../core/mv'
import './index.scss'
import {createText} from '../../core/dom'

export interface ILanguage {
  code: string
  name: string
}

export type HTMLString = string

export type TranslateMapper = Record<string, string>

export const _cache: Record<string, Record<string, string>> = {}

abstract class TranslateCore extends Renderer<HTMLDivElement> {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected static stringifyError(e: any): string {
    return e ? ('message' in e ? e.message : e) : 'unknown error'
  }

  private static readonly STORAGE_KEY = 'Translate_permission_network'

  protected translatorServerBaseURL = 'https://translate.mentality.rip'
  protected sourceLanguage = 'ja'
  protected targetLanguage = 'en'

  protected _loading = false
  protected _languages: ILanguage[] = []

  protected get permitted(): boolean {
    return !!MV.singleton().storage[Translate.STORAGE_KEY]
  }
  protected set permitted(p: boolean) {
    MV.singleton().storage[Translate.STORAGE_KEY] = p
  }

  protected getCurrentLanguageCache (): Record<string, string> {
    const key = `${this.sourceLanguage}>${this.targetLanguage}`
    _cache[key] = _cache[key] || {}
    return _cache[key]
  }

  protected async fetchLanguages(): Promise<ILanguage[]> {
    try {
      if (!this.permitted) return []
      this._loading = true
      const res = await fetch(`${this.translatorServerBaseURL}/languages`)
      return await res.json()
    } catch (e) {
      alert('failed to fetch supported language, please retry: ' + Translate.stringifyError(e))
    } finally {
      this._loading = false
    }
    return []
  }

  protected async translate(source: string): Promise<HTMLString> {
    if (!this.permitted) return source
    if (!source || !source.trim()) return source
    const cache = this.getCurrentLanguageCache()
    if (cache[source]) {
      return cache[source]
    }
    try {
      const res = await fetch(
        `${this.translatorServerBaseURL}/translate?${new URLSearchParams({
          q: source,
          source: this.sourceLanguage,
          target: this.targetLanguage,
          format: 'text',
        }).toString()}`,
        {
          method: 'POST',
        }
      )
      const result = await res.json()
      if (result.error) {
        // noinspection ExceptionCaughtLocallyJS
        throw result.error
      }
      cache[source] = result.translatedText
      return cache[source]
    } catch (e) {
      return `<span style="color:red;">failed: ${Translate.stringifyError(e)}</span>`
    }
  }

}

/**
 * sls = source language selector
 * tls = target language selector
 */
export default class Translate extends TranslateCore {

  private static readonly makeAMessageRow = (): [HTMLElement, HTMLElement, HTMLElement] => {
    const messageRow = document.createElement('div')
    messageRow.classList.add('message-row')

    const sourceMessage = document.createElement('div')
    sourceMessage.classList.add('source-message')
    messageRow.append(sourceMessage)

    const translatedMessage = document.createElement('div')
    translatedMessage.classList.add('translated-message')
    messageRow.append(translatedMessage)

    return [messageRow, sourceMessage, translatedMessage]
  }

  static MyName = 'Translate'

  static KeyMap: KeyMaps = {
    reload: KEY_MAPS.Minus,
  }

  private readonly urlInput = new Input()
  private readonly retry = document.createElement('button')

  private readonly sls = new FilterableScrollSelect<ILanguage>({
    keymap: ScrollSelect.KeyMap34,
    hideFilter: true,
    disableResetOnGameStarted: true,
    listProvider: () => this._languages,
    nameProvider: v => v?.name,
    onChange: v => {
      if (v) this.sourceLanguage = v.code
    },
  })
  private readonly tls = new FilterableScrollSelect<ILanguage>({
    keymap: ScrollSelect.KeyMap56,
    hideFilter: true,
    disableResetOnGameStarted: true,
    listProvider: () => this._languages,
    nameProvider: v => v?.name,
    onChange: v => {
      if (v) this.targetLanguage = v.code
    },
  })

  private readonly messagesContainer = document.createElement('div')
  private readonly choicesContainer = document.createElement('div')

  private _onKeydown = (e: KeyboardEvent) => {
    if (MV.singleton().visible) {
      switch (e.code) {
      case Translate.KeyMap.reload.code: this.init().then(); break
      }
    }
  }

  private gameMessages: TranslateMapper = {}
  private lastGameMessageAppendedTime = Date.now()

  private readonly init = async () => {
    if (this._loading) return
    this._languages = await this.fetchLanguages()
    this.sls.index = this._languages.findIndex(i => i.code === this.sourceLanguage)
    this.tls.index = this._languages.findIndex(i => i.code === this.targetLanguage)
  }

  private readonly reload = async () => {
    await this.init()
    Object.keys(_cache).forEach(key => {
      delete _cache[key]
    })
    const sources = Object.keys(this.gameMessages)
    sources.forEach(i => this.translateGameMessage(i))
    this.translateChoices($gameMessage._choices).then()
  }

  private readonly translateGameMessage = async (source: string): Promise<void> => {
    if (Date.now() - this.lastGameMessageAppendedTime > 10) {
      this.gameMessages = {}
      this.messagesContainer.innerHTML = ''
    }
    this.gameMessages[source] = undefined
    this.lastGameMessageAppendedTime = Date.now()

    const [messageRow, sourceMessage, translatedMessage] = Translate.makeAMessageRow()
    this.messagesContainer.append(messageRow)
    sourceMessage.innerHTML = source
    translatedMessage.innerHTML = '...'

    if (MV.singleton().visible) {
      this.gameMessages[source] = await this.translate(source)
      translatedMessage.innerHTML = this.gameMessages[source]
    }
  }

  public readonly translateChoices = async (choices: string[]): Promise<void> => {
    this.choicesContainer.innerHTML = ''
    if (choices.length > 0) {
      for (const choice of choices) {
        const [messageRow, sourceMessage, translatedMessage] = Translate.makeAMessageRow()
        this.choicesContainer.append(messageRow)
        sourceMessage.innerHTML = choice
        translatedMessage.innerHTML = '...'
        if (MV.singleton().visible) {
          this.translate(choice).then(translated => {
            translatedMessage.innerHTML = translated
          })
        }
      }
    }
  }

  constructor() {
    super()

    window.addEventListener('keydown', this._onKeydown)

    MV.singleton().on('onNewMessage', this.translateGameMessage)
    MV.singleton().on('onChoicesChange', this.translateChoices)
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
    retry.addEventListener('click', this.reload)
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

    this.messagesContainer.classList.add('messages-container')
    container.append(this.messagesContainer)
    this.choicesContainer.classList.add('messages-container')
    container.append(this.choicesContainer)

    return container
  }

  public dispose(): void {
    MV.singleton().off('onNewMessage', this.translateGameMessage)
    MV.singleton().off('onChoicesChange', this.translateChoices)

    super.dispose()
    this.urlInput.dispose()
    this.sls.dispose()
    this.tls.dispose()
    window.removeEventListener('keydown', this._onKeydown)
  }

  render(): HTMLDivElement {
    if (!('fetch' in window)) {
      alert('This game does NOT support network operations')
    } if (this.permitted || confirm('This function requires NETWORK to operate, BE AWARE WITH YOUR PRIVACY, continue?')) {
      this.permitted = true
      this.init().then()
      return this.buildComponent()
    }
    return createText('Network permission is not granted.', 'warning')
  }

}
