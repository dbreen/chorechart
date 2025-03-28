module.exports = function (ctx) {
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
        'QTabs',
        'QTab',
        'QTabPanels',
        'QTabPanel',
        'QChip',
        'QDialog'
      ],
      directives: ['Ripple', 'ClosePopup'],
      plugins: ['Notify', 'LocalStorage']
    },
    build: {
      vueRouterMode: 'hash',
      publicPath: '/chorechart/',
      env: {
        APP_VERSION: JSON.stringify(require('./package.json').version)
      }
    },
    devServer: {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    pwa: {
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [{
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate'
        }]
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