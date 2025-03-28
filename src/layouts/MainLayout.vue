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
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { Dark } from 'quasar'

export default defineComponent({
  name: 'MainLayout',
  
  setup() {
    const darkMode = ref(Dark.isActive)
    
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value
      Dark.set(darkMode.value)
      localStorage.setItem('darkMode', darkMode.value)
    }
    
    onMounted(() => {
      // Ensure the dark mode ref matches the actual state
      darkMode.value = Dark.isActive
    })
    
    return {
      darkMode,
      toggleDarkMode
    }
  }
})
</script>