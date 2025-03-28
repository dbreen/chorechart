<template>
  <q-btn 
    label="NUCLEAR RESET" 
    color="negative"
    icon="delete_forever"
    @click="nukeEverything"
    class="q-mt-md"
  />
</template>

<script>
export default {
  name: 'NuclearReset',
  
  methods: {
    nukeEverything() {
      // First notify the user
      alert('WARNING: This will completely DESTROY all app data and refresh the page.')
      
      // Clear everything
      localStorage.clear()
      sessionStorage.clear()
      
      // Force clear cache and reload
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName)
          })
        })
      }
      
      // Add a timestamp to ensure complete reload
      const bustCache = Date.now()
      const url = new URL(window.location.href)
      url.searchParams.set('nuke', bustCache)
      
      // Reload with hard refresh
      setTimeout(() => {
        window.location.href = url.toString()
      }, 500)
    }
  }
}
</script>