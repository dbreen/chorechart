<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <span class="text-h6">ChoreChart</span>
        </q-toolbar-title>
        
        <!-- Version badge in separate section to ensure it's always visible -->
        <q-btn flat no-caps class="version-btn" @click="versionClicks++">
          v0.2.0
        </q-btn>
        <q-space />
        <q-btn flat round dense :icon="darkMode ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode" />
        <q-btn flat round dense icon="home" to="/" />
        <q-btn flat round dense icon="summarize" to="/summary" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    
    <!-- Dialog for reset feature - shows after clicking version 5 times -->
    <q-dialog v-model="showReset" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Developer Options</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-center q-pa-md">
            <ResetApp />
            <p class="text-caption q-mt-md">Version 0.2.0</p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { Dark, useQuasar } from 'quasar'
import ResetApp from 'src/components/ResetApp.vue'

export default defineComponent({
  components: {
    ResetApp
  },
  name: 'MainLayout',
  
  setup() {
    const $q = useQuasar()
    const darkMode = ref(Dark.isActive)
    const versionClicks = ref(0)
    const showReset = ref(false)
    
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value
      Dark.set(darkMode.value)
      localStorage.setItem('darkMode', darkMode.value)
    }
    
    // Watch for version click easter egg
    watch(versionClicks, (newVal) => {
      if (newVal >= 5) {
        showReset.value = true
        versionClicks.value = 0
      }
    })
    
    onMounted(() => {
      // Ensure the dark mode ref matches the actual state
      darkMode.value = Dark.isActive
    })
    
    return {
      darkMode,
      toggleDarkMode,
      versionClicks,
      showReset
    }
  }
})
</script>

<style scoped>
.version-btn {
  min-width: 60px;
  padding: 0 10px;
  margin: 0 4px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>