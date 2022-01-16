
export interface IKeyMap {
  key: string
  code: string
}

export type KeyMaps = Record<string, IKeyMap>

export abstract class Renderer<T extends HTMLElement = HTMLElement> {

  static MyIcon = ''

  static MyName = ''

  static KeyMap: KeyMaps = {}

  /**
   * dispose current rendered obj
   */
  public dispose(): void {
    // nothing here
  }

  /**
   * render content
   */
  abstract render(): T

}

export const KEY_MAPS = {
  // ...(new Array(10).fill(1).reduce((p, _, index) => {
  //   const code = `Digit${index}`
  //   return {
  //     ...p,
  //     [code]: {
  //       key: `${index}`,
  //       code,
  //     },
  //   }
  // }, {})),
  Backquote: {
    key: '`',
    code: 'Backquote',
  },
  Digit1: {
    key: '1',
    code: 'Digit1',
  },
  Digit2: {
    key: '2',
    code: 'Digit2',
  },
  Digit3: {
    key: '3',
    code: 'Digit3',
  },
  Digit4: {
    key: '4',
    code: 'Digit4',
  },
  Digit5: {
    key: '5',
    code: 'Digit5',
  },
  Digit6: {
    key: '6',
    code: 'Digit6',
  },
  Digit7: {
    key: '7',
    code: 'Digit7',
  },
  Digit8: {
    key: '8',
    code: 'Digit8',
  },
  Digit9: {
    key: '9',
    code: 'Digit9',
  },
  Digit0: {
    key: '0',
    code: 'Digit0',
  },
  Minus: {
    key: '-',
    code: 'Minus',
  },
  Equal: {
    key: '=',
    code: 'Equal',
  },
}
