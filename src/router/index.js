import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
// vvv CHANGE THIS LINE vvv
import { userSession } from '../boot/supabase' // Use relative path
// ^^^ CHANGE THIS LINE ^^^

const router = createRouter({
  history: createWebHashHistory('/chorechart/'),
  routes
})

// vvv ADD NAVIGATION GUARD vvv
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = userSession.value !== null // Check if user session exists

  // console.log(`Navigating to: ${to.path}, Requires Auth: ${requiresAuth}, Is Authenticated: ${isAuthenticated}`); // Optional: for debugging

  if (requiresAuth && !isAuthenticated) {
    // If route requires auth and user is not logged in,
    // redirect to the root path. MainLayout will show the login prompt.
    // console.log('Redirecting to / (login)'); // Optional: for debugging
    next('/')
  } else {
    // Otherwise, allow navigation
    next()
  }
})
// ^^^ ADD NAVIGATION GUARD ^^^

export default router
