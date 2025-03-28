<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          ChoreChart
        </q-toolbar-title>
        <q-space />
        <q-btn flat round dense :icon="darkMode ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode" />
        <q-btn flat round dense icon="home" to="/" />
        <q-btn flat round dense icon="summarize" to="/summary" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    
    <q-footer bordered class="bg-white text-grey-8 q-py-xs" v-if="showVersion">
      <q-toolbar>
        <q-space />
        <div class="text-caption">
          v{{ appVersion }} 
          <q-btn flat dense round size="xs" icon="refresh" @click="clearCache" class="q-ml-sm" />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { Dark, useQuasar } from 'quasar'
import { APP_VERSION } from 'src/config'

export default defineComponent({
  name: 'MainLayout',
  
  setup() {
    const $q = useQuasar()
    const darkMode = ref(Dark.isActive)
    const showVersion = ref(true)
    const appVersion = ref(APP_VERSION)
    
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value
      Dark.set(darkMode.value)
      localStorage.setItem('darkMode', darkMode.value)
    }
    
    const clearCache = () => {
      // Clear browser cache for the app
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name)
          })
        })
      }
      
      // Reload page to ensure fresh content
      location.reload(true)
    }
    
    onMounted(() => {
      // Ensure the dark mode ref matches the actual state
      darkMode.value = Dark.isActive
    })
    
    return {
      darkMode,
      toggleDarkMode,
      appVersion,
      showVersion,
      clearCache
    }
  }
})
</script>