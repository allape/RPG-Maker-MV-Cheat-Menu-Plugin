import {IKeyMap} from './renderer'

export function space2line(text: string): string {
  return (text || '').split(/\s/gi).map(i => `<div>${i}</div>`).join('')
}

export function createText(text: string, type: '' | 'warning' | 'fatal' = ''): HTMLDivElement {
  const container = div()
  switch (type) {
  case 'warning': container.style.color = 'gold'; break
  case 'fatal': container.style.color = 'red'; break
  }
  container.innerHTML = text
  return container
}

export interface IKeyMapLabelOptions {
  namePosition?: 'right' | 'left'
}

export function createKeyMapLabel(key: string | IKeyMap, name = '', description?: string, options?: IKeyMapLabelOptions): HTMLSpanElement {
  const wrapper = span()
  wrapper.title = description

  const label = span()
  const keyText = span()
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
  const container = div()
  container.style.height = '10px'
  return container
}

export function hr(): HTMLElement {
  const container = div()
  container.style.borderTop = '1px solid white'
  return container
}

export function div(): HTMLDivElement {
  return document.createElement('div')
}

export function span(): HTMLSpanElement {
  return document.createElement('span')
}
