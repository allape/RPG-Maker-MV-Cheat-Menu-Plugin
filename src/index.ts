// polyfill
import 'core-js/stable/array'
import 'core-js/stable/promise'
import 'regenerator-runtime/runtime'

import App from './App'
import MV, {errorEnhancement} from './core/mv'

setTimeout(() => {
  try {
    errorEnhancement()
    console.log(MV.singleton())
  } finally {
    document.body.append(new App().render())
  }
}, 1000)
