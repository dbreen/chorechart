<template>
  <div>
    <q-btn
      label="Reset App Data"
      color="negative"
      @click="confirmReset"
      class="q-my-md"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ResetStorage',
  
  setup() {
    const $q = useQuasar()
    
    const resetAllData = () => {
      // Clear all app data
      localStorage.removeItem('choreData')
      localStorage.removeItem('darkMode')
      
      // Show success notification
      $q.notify({
        message: 'All app data has been reset. Refreshing...',
        color: 'positive',
        timeout: 2000
      })
      
      // Force a hard reload to clear any cached state
      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname + '?refresh=' + Date.now() + '#/'
      }, 2000)
    }
    
    const confirmReset = () => {
      $q.dialog({
        title: 'Reset All Data',
        message: 'This will reset ALL app data including chores and settings. This action cannot be undone. Are you sure?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        resetAllData()
      })
    }
    
    return {
      confirmReset
    }
  }
})
</script>