const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'day/:dayName', component: () => import('pages/DayPage.vue') },
      { path: 'summary', component: () => import('pages/SummaryPage.vue') },
      { path: 'manage-chores', component: () => import('pages/ManageChores.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
