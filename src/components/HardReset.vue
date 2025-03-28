<template>
  <div class="q-mt-xl text-center">
    <q-btn 
      label="Hard Reset App" 
      color="negative" 
      @click="confirmReset"
      class="q-my-md"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { resetAppData } from 'src/utils/storage-reset'

export default defineComponent({
  name: 'HardReset',
  
  setup() {
    const $q = useQuasar()
    
    const reset = () => {
      if (resetAppData()) {
        // Show success notification
        $q.notify({
          message: 'All app data has been reset. Refreshing...',
          color: 'positive',
          timeout: 2000
        })
        
        // Force a hard reload of the page with cache bypassing
        setTimeout(() => {
          const timestamp = new Date().getTime()
          window.location.href = window.location.origin + 
            window.location.pathname + 
            '?v=' + timestamp + 
            window.location.hash
        }, 1000)
      } else {
        $q.notify({
          message: 'Error resetting app data.',
          color: 'negative',
          timeout: 2000
        })
      }
    }
    
    const confirmReset = () => {
      $q.dialog({
        title: 'Hard Reset',
        message: 'This will completely reset ALL app data and refresh the page. This action CANNOT be undone. Are you absolutely sure?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        reset()
      })
    }
    
    return {
      confirmReset
    }
  }
})
</script>