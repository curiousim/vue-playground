import './styles/tokens.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Mock Server Worker setup for development and test environments

async function prepareApp() {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const { worker } = await import('./mocks/browser')
    return await worker.start({
      serviceWorker: {
        // Respect Vite’s base in case you changed it
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    })
  }

  return Promise.resolve()
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

prepareApp().then(() => app.mount('#app'))
// app.mount('#app')
