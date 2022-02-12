import {IKeyMap} from './renderer'

export function space2line(text: string): string {
  return (text || '').split(/\s/gi).map(i => `<div>${i}</div>`).join('')
}

export function createText(text: string, type: '' | 'warning' | 'fatal' = ''): HTMLDivElement {
  const div = document.createElement('div')
  switch (type) {
  case 'warning': div.style.color = 'gold'; break
  case 'fatal': div.style.color = 'red'; break
  }
  div.innerHTML = text
  return div
}

export interface IKeyMapLabelOptions {
  namePosition?: 'right' | 'left'
}

export function createKeyMapLabel(key: string | IKeyMap, name = '', description?: string, options?: IKeyMapLabelOptions): HTMLSpanElement {
  const wrapper = document.createElement('span')
  wrapper.title = description

  const label = document.createElement('span')
  const keyText = document.createElement('span')
  keyText.innerHTML = typeof key === 'string' ? key : key.key
  keyText.style.padding = '0 2px'
  label.append(
    '[',
    keyText,
    ']',
  )

  if (name) {
    if (options?.namePosition === 'left') {
      label.style.paddingLeft = '10px'
      wrapper.append(
        `${name}`,
        label,
      )
    } else {
      label.style.paddingRight = '10px'
      wrapper.append(
        label,
        `${name}`,
      )
    }
  } else {
    wrapper.append(
      label,
    )
  }

  return wrapper
}

export function br(): HTMLElement {
  const div = document.createElement('div')
  div.style.height = '10px'
  return div
}

export function hr(): HTMLElement {
  const div = document.createElement('div')
  div.style.borderTop = '1px solid white'
  return div
}
