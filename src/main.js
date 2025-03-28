import { createApp } from 'vue'
import { Quasar, Notify, LocalStorage, Dark } from 'quasar'

// Import Quasar css
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

import App from './App.vue'
import router from './router'

// Import global CSS
import './css/app.scss'

// Check if dark mode was previously enabled
const darkModeEnabled = localStorage.getItem('darkMode') === 'true'
Dark.set(darkModeEnabled)

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify,
    LocalStorage,
    Dark
  },
  config: {
    brand: {
      primary: '#1976D2',
      secondary: '#26A69A',
      accent: '#9C27B0',
      dark: '#1d1d1d',
      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    },
    dark: darkModeEnabled
  }
})

app.use(router)
app.mount('#app')