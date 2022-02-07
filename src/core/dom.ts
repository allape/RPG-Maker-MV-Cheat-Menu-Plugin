
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
