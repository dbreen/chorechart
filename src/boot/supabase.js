import { boot } from 'quasar/wrappers'
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Create base URL for redirects
const baseUrl = window.location.origin + process.env.PUBLIC_PATH

// Create a reactive variable for the user session
const userSession = ref(null)

// Listen for authentication state changes and update the ref
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase Auth Event:', event, session) // Optional: for debugging
  userSession.value = session
})

export default boot(async ({ app, router }) => {
  // Attempt to fetch the initial session
  const { data } = await supabase.auth.getSession()
  userSession.value = data.session

  // Make Supabase client available globally
  app.config.globalProperties.$supabase = supabase

  // Make the reactive user session available globally
  app.config.globalProperties.$userSession = userSession
  app.config.globalProperties.$baseUrl = baseUrl

  // Provide for Composition API inject()
  app.provide('$supabase', supabase)
  app.provide('userSession', userSession)
  app.provide('baseUrl', baseUrl)
})

// Export the client, reactive session, and baseUrl for direct import
export { supabase, userSession, baseUrl }
