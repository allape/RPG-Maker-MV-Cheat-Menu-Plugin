
export default function setGuaranteedInterval(key: string, callback: () => void, ms?: number): number {
  const gi = window.__guaranteed_intervals = window.__guaranteed_intervals || {}

  const id = setInterval(callback, ms) as unknown as number

  const ids = gi[key]
  if (ids && ids instanceof Array) {
    ids.push(id)
  } else {
    gi[key] = [id]
  }

  return id
}

export function clearGuaranteedInterval(key: string) {
  const ids = window.__guaranteed_intervals?.[key]
  if (ids && ids instanceof Array) {
    ids.forEach(id => clearInterval(id))
  }
}
