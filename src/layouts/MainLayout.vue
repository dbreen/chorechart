<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          ChoreChart
        </q-toolbar-title>
        <q-space />

        <!-- Only show dark mode toggle and nav when logged in -->
        <template v-if="userSession">
          <q-btn flat round dense icon="home" to="/" />
          <q-btn flat round dense icon="summarize" to="/summary" />
          <q-btn flat round dense icon="edit" to="/manage-chores" />
          <q-btn
            flat dense
            label="Logout"
            @click="handleLogout"
            :loading="loading"
            class="q-ml-sm"
          />
        </template>

        <!-- Dark Mode Toggle (always visible) -->
        <q-btn
          flat round dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="$q.dark.toggle()"
          class="q-ml-md"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-if="userSession" />
      <div v-else class="flex flex-center" style="height: 100vh">
        <q-card class="q-pa-xl" style="width: 100%; max-width: 400px">
          <q-card-section class="text-center">
            <div class="text-h4 q-mb-md">Welcome to ChoreChart</div>
            <div class="text-subtitle1 q-mb-xl">Please sign in to continue</div>
            
            <div class="q-gutter-y-md">
              <q-input
                outlined
                v-model="email"
                label="Email"
                type="email"
                :readonly="otpSent"
                @keyup.enter="handleLogin"
              />
              <q-input
                v-if="otpSent"
                outlined
                v-model="otpCode"
                label="OTP Code"
                type="text"
                @keyup.enter="handleLogin"
              />
              <q-btn
                color="primary"
                :label="otpSent ? 'Verify Code' : 'Send OTP'"
                @click="handleLogin"
                :loading="loading"
                class="full-width"
                size="lg"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
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
