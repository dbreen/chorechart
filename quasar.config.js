module.exports = function (ctx) {
  // Read package.json to get current version
  const packageJson = require('./package.json')
  const version = packageJson.version
  
  return {
    boot: [],
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
        'QDialog',
        'QToggle',
        'QSpinner'
      ],
      directives: ['Ripple', 'ClosePopup'],
      plugins: ['Notify', 'LocalStorage', 'Dialog']
    },
    build: {
      vueRouterMode: 'hash',
      publicPath: '/chorechart/',
      env: {
        PACKAGE_VERSION: version
      }
    },
    pwa: {
      // Disable service worker caching
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [],
        // Disable precaching
        precacheManifest: [],
        // No offline support
        navigateFallback: null,
      },
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