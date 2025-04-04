import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { userSession } from '../boot/supabase'

const router = createRouter({
  history: createWebHashHistory('/chorechart/'),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = userSession.value !== null // Check reactive session state

  if (requiresAuth && !isAuthenticated) {
    // If route requires auth and user is not logged in...

    if (to.path === '/') {
      // ...and we are already trying to navigate to the root path,
      // allow the navigation. MainLayout will handle showing the login prompt.
      next()
    } else {
      // ...and we are trying to navigate to a different protected path,
      // redirect to the root path.
      next('/')
    }

  } else {
    // Otherwise (route doesn't require auth OR user is authenticated), proceed.
    next()
  }
})

export default router
