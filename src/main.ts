import './app.css'
import App from './App.svelte'
import 'virtual:uno.css'
// import '@unocss/reset/normalize.css'
// import '@unocss/reset/sanitize/sanitize.css'
// import '@unocss/reset/sanitize/assets.css'
// import '@unocss/reset/eric-meyer.css'
// import '@unocss/reset/tailwind.css'
// import '@unocss/reset/tailwind-compat.css'


const app = new App({
  target: document.getElementById('app')!,
})

export default app
