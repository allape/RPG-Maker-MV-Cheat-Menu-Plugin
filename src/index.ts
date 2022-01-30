import App from './App'
import MV from './core/mv'

setTimeout(() => {
  try {
    console.log(MV.singleton())
  } finally {
    document.body.append(new App().render())
  }
}, 1000)
