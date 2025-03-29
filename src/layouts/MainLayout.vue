<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          ChoreChart
        </q-toolbar-title>
        
        <!-- Version Badge -->
        <div class="text-caption" style="min-width:60px;text-align:center;">
          v0.2.0
        </div>
        
        <q-btn flat round dense :icon="darkMode ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode" />
        <q-btn flat round dense icon="home" to="/" />
        <q-btn flat round dense icon="summarize" to="/summary" />
        <q-btn v-if="showResetButton" flat round dense icon="restart_alt" @click="doReset" color="negative" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { Dark, useQuasar } from 'quasar'
import { resetApp } from '../utils/reset'

export default defineComponent({
  name: 'MainLayout',
  
  setup() {
    const $q = useQuasar()
    const darkMode = ref(Dark.isActive)
    const showResetButton = ref(window.location.search.includes('debug=true'))
    
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value
      Dark.set(darkMode.value)
      localStorage.setItem('darkMode', darkMode.value)
    }
    
    const doReset = () => {
      $q.dialog({
        title: 'Reset Application',
        message: 'This will delete ALL application data and reset the app. This cannot be undone. Continue?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        resetApp()
      })
    }
    
    onMounted(() => {
      // Ensure the dark mode ref matches the actual state
      darkMode.value = Dark.isActive
      
      // Enable reset in dev mode
      document.addEventListener('keydown', (e) => {
        // Alt+Shift+R shortcut to show reset button
        if (e.altKey && e.shiftKey && e.key === 'R') {
          showResetButton.value = true
        }
      })
    })
    
    return {
      darkMode,
      toggleDarkMode,
      showResetButton,
      doReset
    }
  }
})
</script>