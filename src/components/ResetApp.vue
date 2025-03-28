<template>
  <div class="row justify-center q-mt-md">
    <q-btn 
      label="Reset App" 
      color="negative" 
      icon="delete_forever"
      @click="confirm"
      class="q-ma-md"
    />
  </div>
</template>

<script>
export default {
  name: 'ResetApp',
  
  methods: {
    confirm() {
      if (confirm("⚠️ WARNING: This will completely reset the app and clear ALL data. This cannot be undone. Continue?")) {
        this.resetApp();
      }
    },
    
    resetApp() {
      try {
        // Clear localStorage
        localStorage.clear();
        
        // Add timestamp for cache busting
        const timestamp = new Date().getTime();
        const url = new URL(window.location.href);
        url.searchParams.set('reset', timestamp);
        
        // Reload page with cache busting
        window.location.href = url.toString();
      } catch (error) {
        console.error('Failed to reset app:', error);
        alert('Error resetting app. Try refreshing the page.');
      }
    }
  }
}
</script>