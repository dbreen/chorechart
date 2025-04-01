<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat dense round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm"
        />
        <q-toolbar-title>ChoreChart</q-toolbar-title>
        
        <!-- Version on right -->
        <div class="text-caption q-mr-md">v1.0.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :width="250"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'"
    >
      <q-list padding>
        <q-item-label header class="text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
          Navigation
        </q-item-label>

        <!-- Show these only when logged in -->
        <template v-if="userSession">
          <q-item clickable v-ripple exact to="/" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/summary" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
            <q-item-section avatar>
              <q-icon name="summarize" />
            </q-item-section>
            <q-item-section>Weekly Summary</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/manage-chores" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
            <q-item-section avatar>
              <q-icon name="edit" />
            </q-item-section>
            <q-item-section>Manage Chores</q-item-section>
          </q-item>

          <q-separator class="q-my-md" />
        </template>

        <!-- Always show theme toggle -->
        <q-item clickable v-ripple @click="$q.dark.toggle()" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
          <q-item-section avatar>
            <q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" />
          </q-item-section>
          <q-item-section>
            {{ $q.dark.isActive ? 'Light Mode' : 'Dark Mode' }}
          </q-item-section>
        </q-item>

        <!-- Show logout only when logged in -->
        <q-item 
          v-if="userSession"
          clickable 
          v-ripple 
          @click="handleLogout" 
          :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Log Out</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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
import { useRouter } from 'vue-router'
import { getStandardChores } from '../data/chores'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const $q = useQuasar()
    const $supabase = inject('$supabase') // Inject Supabase client
    const userSession = inject('userSession') // Inject reactive user session
    const baseUrl = inject('baseUrl') // Inject base URL
    const router = useRouter()

    const email = ref('')
    const loading = ref(false)
    const otpSent = ref(false)
    const otpCode = ref('')
    const leftDrawerOpen = ref(false)
    const hasCheckedInitialChores = ref(false)
    const initialCheckLoading = ref(false)

    // Watch for dark mode changes and save preference
    watch(() => $q.dark.isActive, (isDark) => {
      const preference = isDark ? 'dark' : 'light'
      $q.localStorage.set('darkModePreference', preference)
    })

    // Watch for user session changes to check if user has chores
    watch(userSession, async (newSession) => {
      if (newSession?.user?.id && !hasCheckedInitialChores.value) {
        initialCheckLoading.value = true
        try {
          const chores = await getStandardChores(newSession.user.id)
          if (chores.length === 0) {
            if (router.currentRoute.value.path !== '/manage-chores') {
              router.push('/manage-chores')
            }
          }
          hasCheckedInitialChores.value = true
        } catch (error) {
          console.error('Chore check error:', error)
        } finally {
          initialCheckLoading.value = false
        }
      }
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
            email: email.value,
            options: {
                emailRedirectTo: `${baseUrl}`
            }
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
      otpCode,
      leftDrawerOpen,
      initialCheckLoading,
      hasCheckedInitialChores
    }
  }
})
</script>

<style lang="scss" scoped>
/* Optional: Add specific styles if needed */
</style>
