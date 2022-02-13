// polyfill
import 'core-js/actual'
import 'regenerator-runtime/runtime'
import 'element-polyfill'
import 'whatwg-fetch'

// polyfill KeyboardEvent.code
(() => {
  window.KEY_CODE_TO_CHAR = {
    48: 'Digit0',
    49: 'Digit1',
    50: 'Digit2',
    51: 'Digit3',
    52: 'Digit4',
    53: 'Digit5',
    54: 'Digit6',
    55: 'Digit7',
    56: 'Digit8',
    57: 'Digit9',
    187: 'Equal',
    189: 'Minus',
    192: 'Backquote',
  }
  try {
    const ev = new KeyboardEvent('keydown')
    if (!('code' in ev)) {
      Object.defineProperty(
        KeyboardEvent.prototype,
        'code',
        {
          configurable: true,
          get: function () {
            return window.KEY_CODE_TO_CHAR[this.keyCode] || this.keyCode
          }
        }
      )
    }
  } catch (e) {
    console.error('unable to ')
  }
})()

// new Function('require(\'nw.gui\').Window.get().showDevTools()')()

import './index'
