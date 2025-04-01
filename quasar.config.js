module.exports = function (ctx) {
  return {
    boot: [
      'dark-mode',
      'supabase'
    ],
    css: ['app.scss'],
    extras: [
      'material-icons'
    ],
    framework: {
      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QCheckbox',
        'QSeparator',
        'QBadge',
        'QSpace',
        'QInput'
      ],
      directives: ['Ripple'],
      plugins: ['Notify', 'LocalStorage', 'Dialog']
    },
    build: {
      vueRouterMode: 'hash',
      publicPath: '/chorechart/',
      env: {
        SUPABASE_URL: 'https://mxvldqwpwjeiothsudfy.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dmxkcXdwd2plaW90aHN1ZGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTEzNDQsImV4cCI6MjA1OTA4NzM0NH0.Z69W0OarxOYTvZCJs3CAB6thhznpgE00DAOeuBHiSuE',
        PUBLIC_PATH: '/chorechart/'
      }
    },
    pwa: {
      workboxOptions: {},
      manifest: {
        name: 'ChoreChart',
        short_name: 'ChoreChart',
        description: 'Chore tracking app for kids',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        start_url: '/chorechart/',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }
  }
}
