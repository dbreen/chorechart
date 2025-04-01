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
            :readonly="otpSent"
          />
          <q-input
            v-if="otpSent"
            dark dense standout
            v-model="otpCode"
            label="OTP Code"
            type="text"
            class="q-ml-sm"
            bg-color="primary"
            label-color="white"
            input-style="color: white;"
            @keyup.enter="handleLogin"
            style="min-width: 200px;"
          />
          <q-btn
            flat dense
            :label="otpSent ? 'Verify' : 'Send OTP'"
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
    const baseUrl = inject('baseUrl') // Inject base URL

    const email = ref('')
    const loading = ref(false)
    const otpSent = ref(false)
    const otpCode = ref('')

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
        
        if (!otpSent.value) {
          // Phase 1: Send OTP
          const { error } = await $supabase.auth.signInWithOtp({
            email: email.value
          })
          
          if (error) throw error
          otpSent.value = true
          $q.notify({ 
            type: 'positive', 
            message: 'OTP sent! Check your email for the verification code.',
            timeout: 5000
          })
        } else {
          // Phase 2: Verify OTP
          const { error } = await $supabase.auth.verifyOtp({
            email: email.value,
            token: otpCode.value,
            type: 'email'
          })
          
          if (error) throw error
          otpSent.value = false
          otpCode.value = ''
          $q.notify({ 
            type: 'positive', 
            message: 'Successfully logged in!',
            timeout: 2000
          })
        }
      } catch (error) {
        console.error('Auth Error:', error)
        $q.notify({
          type: 'negative',
          message: error.message || 'Authentication failed',
          timeout: 5000
        })
        
        // Reset on invalid OTP
        if (otpSent.value) {
          otpCode.value = ''
        }
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
      handleLogout,
      baseUrl,
      otpSent,
      otpCode
    }
  }
})
</script>

<style lang="scss" scoped>
/* Optional: Add specific styles if needed */
</style>
