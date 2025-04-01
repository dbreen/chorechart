import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { userSession } from '../boot/supabase' // Use relative path import

const router = createRouter({
  history: createWebHashHistory('/chorechart/'), // Base path for hash mode
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = userSession.value !== null // Check reactive session state

  if (requiresAuth && !isAuthenticated) {
    // If route needs auth and user isn't logged in, redirect to root.
    // MainLayout will handle showing the login prompt there.
    next('/')
  } else {
    // Otherwise, proceed with navigation.
    next()
  }
})

export default router
