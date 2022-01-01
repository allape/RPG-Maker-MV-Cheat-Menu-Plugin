
export abstract class Renderer<T extends HTMLElement = HTMLElement> {

  /**
   * dispose current rendered obj
   */
  public dispose(): void {}

  /**
   * render content
   */
  abstract render(): T

}
