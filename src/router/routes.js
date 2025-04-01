const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true }, // <-- Ensure this meta field exists
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'day/:dayName', component: () => import('pages/DayPage.vue') },
      { path: 'summary', component: () => import('pages/SummaryPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
