import GodMode from './module/GodMode'

setTimeout(() => {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '0'
  container.style.minWidth = '300px'
  container.style.padding = '10px'
  container.style.background = 'rgba(0, 0, 0, .3)'
  // container.style.background = 'red'
  container.style.color = 'white'
  container.style.zIndex = `${Number.MAX_SAFE_INTEGER}`

  container.append(new GodMode().render())

  document.body.append(container)
}, 5000)
