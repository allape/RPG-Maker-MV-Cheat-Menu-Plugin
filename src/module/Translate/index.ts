import { KeyMaps, KEY_MAPS, Renderer } from '../../core/renderer'
import 'whatwg-fetch'
import FilterableScrollSelect from '../../component/FilterableScrollSelect'
import Input from '../../component/Input'
import ScrollSelect from '../../component/ScrollSelect'
import './index.scss'

export interface ILanguage {
  code: string
  name: string
}

export type HTMLString = string

export type TranslateMapper = Record<string, string>

export const _cache: Record<string, Record<string, string>> = {}

abstract class TranslateCore  extends Renderer<HTMLDivElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected static stringifyError(e: any): string {
    return e ? ('message' in e ? e.message : e) : 'unknown error'
  }

  protected translatorServerBaseURL = 'https://translate.mentality.rip'
  protected sourceLanguage = 'ja'
  protected targetLanguage = 'en'

  protected _loading = false
  protected _languages: ILanguage[] = []


  protected getCurrentLanguageCache (): Record<string, string> {
    const key = `${this.sourceLanguage}>${this.targetLanguage}`
    _cache[key] = _cache[key] || {}
    return _cache[key]
  }

  protected async fetchLanguages(): Promise<ILanguage[]> {
    try {
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
    if (!source || !source.trim()) return source
    const cache = this.getCurrentLanguageCache()
    if (cache[source]) {
      return cache[source]
    }
    try {
      const res = await fetch(
        `${this.translatorServerBaseURL}/translate?${(new URLSearchParams({
          q: source,
          source: this.sourceLanguage,
          target: this.targetLanguage,
          format: 'text',
        })).toString()}`,
        {
          method: 'POST',
        }
      )
      const result = (await res.json()).translatedText
      cache[source] = result
      return result
    } catch (e) {
      return `<span style="color:red;">failed to translate: ${Translate.stringifyError(e)}</span>`
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
    reload: KEY_MAPS.Equal,
  }

  private readonly urlInput = new Input()
  private readonly retry = document.createElement('button')

  private readonly sls = new FilterableScrollSelect<ILanguage>({
    keymap: ScrollSelect.KeyMap34,
    disableResetOnGameStarted: true,
    listProvider: keyword => this._languages.filter(i => i.name?.toLowerCase().includes(keyword)),
    nameProvider: v => v?.name,
    placeholder: 'Search Source Language by Name',
    onChange: v => {
      if (v) this.sourceLanguage = v.code
    },
  })
  private readonly tls = new FilterableScrollSelect<ILanguage>({
    keymap: ScrollSelect.KeyMap56,
    disableResetOnGameStarted: true,
    listProvider: keyword => this._languages.filter(i => i.name?.toLowerCase().includes(keyword)),
    nameProvider: v => v?.name,
    placeholder: 'Search Target Language by Name',
    onChange: v => {
      if (v) this.targetLanguage = v.code
    },
  })

  private readonly messagesContainer = document.createElement('div')
  private readonly choicesContainer = document.createElement('div')

  private _onKeydown = (e: KeyboardEvent) => {
    switch (e.code) {
    case Translate.KeyMap.reload.code: this.init().then(); break
    }
  }

  private gameMessages: TranslateMapper = {}
  private lastGameMessageAppendedTime = Date.now()

  private init = async () => {
    if (this._loading) return
    this._languages = await this.fetchLanguages()
    this.sls.index = this._languages.findIndex(i => i.code === this.sourceLanguage)
    this.tls.index = this._languages.findIndex(i => i.code === this.targetLanguage)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const translator = this
    Game_Message.prototype.__add_proxy = Game_Message.prototype.add
    Game_Message.prototype.add = function (text) {
      this.__add_proxy(text)
      translator.translateGameMessage(text).then()
    }
    Object.defineProperties(Game_Message.prototype, {
      _choices: {
        configurable: true,
        set: function (value) {
          value = value || []
          if (value instanceof Array) {
            translator.translateChoices(value).then()
          }
          this._wrappedChoices = value
        },
        get: function () {
          return this._wrappedChoices || []
        }
      }
    })
  }

  private translateGameMessage = async (source: string): Promise<void> => {
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

    this.gameMessages[source] = await this.translate(source)
    translatedMessage.innerHTML = this.gameMessages[source]
  }

  public translateChoices = async (choices: string[]): Promise<void> => {
    if (choices.length === 0) {
      this.choicesContainer.innerHTML = ''
    } else {
      for (const choice of choices) {
        const [messageRow, sourceMessage, translatedMessage] = Translate.makeAMessageRow()
        this.choicesContainer.append(messageRow)
        sourceMessage.innerHTML = choice
        translatedMessage.innerHTML = '...'
        this.translate(choice).then(translated => {
          translatedMessage.innerHTML = translated
        })
      }
    }
  }

  constructor() {
    super()

    this.init().then()
    window.addEventListener('keydown', this._onKeydown)
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
      Object.keys(_cache).forEach(key => {
        delete _cache[key]
      })
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

    this.messagesContainer.classList.add('messages-container')
    container.append(this.messagesContainer)
    this.choicesContainer.classList.add('messages-container')
    container.append(this.choicesContainer)

    return container
  }

  public dispose(): void {
    if (Game_Message.prototype.__add_proxy) {
      Game_Message.prototype.add = Game_Message.prototype.__add_proxy
      delete Game_Message.prototype.__add_proxy
    }
    Object.defineProperties(Game_Message.prototype, {
      _choices: {
        configurable: true,
        value: [],
      },
    })

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
