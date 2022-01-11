import App from './App'

setTimeout(() => {
  document.body.append(new App().render())
}, 1000)
