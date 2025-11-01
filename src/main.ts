import './styles/tokens.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Mock Server Worker setup for development and test environments
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function prepareApp() {
  const { worker } = await import('./mocks/browser')
  return await worker.start({
    serviceWorker: {
      // Respect Vite’s base in case you changed it
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// prepareApp().then(() => app.mount('#app'))
app.mount('#app')
