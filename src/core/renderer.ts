
export interface IKeyMap {
  key: string
  code: string
}

export type KeyMaps = Record<string, IKeyMap>

export abstract class Renderer<T extends HTMLElement = HTMLElement> {

  static MyIcon = ''

  static MyName: string = ''

  static KeyMap: KeyMaps = {}

  constructor() {
  }

  /**
   * dispose current rendered obj
   */
  public dispose(): void {}

  /**
   * render content
   */
  abstract render(): T

}
