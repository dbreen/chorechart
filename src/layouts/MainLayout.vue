<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          ChoreChart
        </q-toolbar-title>
        <q-space />
        <!-- CHANGE 1: Update button icon condition and click handler -->
        <q-btn
          flat round dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="$q.dark.toggle()"
        />
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
// CHANGE 2: Update imports - remove ref, onMounted; add useQuasar, watch
import { defineComponent, watch } from 'vue'
import { useQuasar } from 'quasar' // <-- Import useQuasar
// Remove Dark import if no longer needed directly: import { Dark } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    // CHANGE 3: Get $q instance
    const $q = useQuasar()

    // CHANGE 4: Remove darkMode ref, toggleDarkMode function, onMounted hook
    // const darkMode = ref(Dark.isActive) // <-- REMOVE
    // const toggleDarkMode = () => { ... } // <-- REMOVE
    // onMounted(() => { ... }) // <-- REMOVE

    // CHANGE 5: Add watcher to save preference
    watch(() => $q.dark.isActive, (isDark) => {
      const preference = isDark ? 'dark' : 'light'
      // Use the same key as in the boot file
      $q.localStorage.set('darkModePreference', preference)
    })

    // CHANGE 6: Return $q
    return {
      $q // <-- Return $q for template access
    }
  }
})
</script>
