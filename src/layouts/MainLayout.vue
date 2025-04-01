<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          ChoreChart
        </q-toolbar-title>
        <q-space />

        <!-- Login/Logout Section -->
        <div v-if="!userSession" class="q-gutter-sm row items-center no-wrap">
          <q-input
            dark dense standout
            v-model="email"
            label="Email"
            type="email"
            class="q-ml-sm"
            bg-color="primary"
            label-color="white"
            input-style="color: white;"
            @keyup.enter="handleLogin"
            style="min-width: 200px;"
          />
          <q-btn
            flat dense
            label="Login"
            @click="handleLogin"
            :loading="loading"
          />
        </div>
        <q-btn
          v-else
          flat dense
          label="Logout"
          @click="handleLogout"
          :loading="loading"
        />

        <!-- Dark Mode Toggle -->
        <q-btn
          flat round dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="$q.dark.toggle()"
          class="q-ml-md"
        />

        <!-- Navigation Buttons (only shown if logged in) -->
        <template v-if="userSession">
          <q-btn flat round dense icon="home" to="/" />
          <q-btn flat round dense icon="summarize" to="/summary" />
        </template>
      </q-toolbar>
    </q-header>

    <!-- Page Container (conditionally rendered) -->
    <q-page-container v-if="userSession">
      <router-view />
    </q-page-container>
    <q-page-container v-else>
       <q-page padding class="flex flex-center text-center">
         <div>
           <div class="text-h5">Please log in</div>
           <div class="q-mt-md">Enter your email above and click Login to receive a magic link.</div>
         </div>
       </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, watch, ref, inject } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const $q = useQuasar()
    const $supabase = inject('$supabase') // Inject Supabase client
    const userSession = inject('userSession') // Inject reactive user session

    const email = ref('')
    const loading = ref(false)

    // Watch for dark mode changes and save preference
    watch(() => $q.dark.isActive, (isDark) => {
      const preference = isDark ? 'dark' : 'light'
      $q.localStorage.set('darkModePreference', preference)
    })

    // Login Handler
    const handleLogin = async () => {
      if (!email.value) {
        $q.notify({ type: 'negative', message: 'Please enter your email address.' })
        return
      }
      try {
        loading.value = true
        const { error } = await $supabase.auth.signInWithOtp({
          email: email.value,
          options: {
            // Optional: Define redirect URL after magic link click
            // emailRedirectTo: window.location.origin + '/chorechart/'
          }
        })
        if (error) throw error
        $q.notify({ type: 'positive', message: 'Check your email for the login link!' })
        email.value = '' // Clear email field
      } catch (error) {
        console.error('Login Error:', error)
        $q.notify({ type: 'negative', message: error.error_description || error.message })
      } finally {
        loading.value = false
      }
    }

    // Logout Handler
    const handleLogout = async () => {
      try {
        loading.value = true
        const { error } = await $supabase.auth.signOut()
        if (error) throw error
        $q.notify({ type: 'info', message: 'Logged out successfully.' })
        // Session updates via onAuthStateChange in boot file
      } catch (error) {
        console.error('Logout Error:', error)
        $q.notify({ type: 'negative', message: 'Error logging out.' })
      } finally {
        loading.value = false
      }
    }

    return {
      $q,
      userSession,
      email,
      loading,
      handleLogin,
      handleLogout
    }
  }
})
</script>

<style lang="scss" scoped>
/* Optional: Add specific styles if needed */
</style>
