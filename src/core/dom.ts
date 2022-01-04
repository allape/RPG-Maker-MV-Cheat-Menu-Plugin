
export function space2line(text: string): string {
  return (text || '').split(/\s/gi).map(i => `<div>${i}</div>`).join('')
}
