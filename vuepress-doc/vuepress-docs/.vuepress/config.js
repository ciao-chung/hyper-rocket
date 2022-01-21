// 參考: https://vuepress.vuejs.org/config/#basic-config
const isProduction = process.env.NODE_ENV === 'production'
const baseUrl = !isProduction ? '/' : '/hyper-rocket/'

// 參考: https://vuepress.vuejs.org/config/#basic-config
module.exports = {
  base: baseUrl,
  dest: 'dist',
  themeConfig: {
    // 參考: https://vuepress.vuejs.org/theme/default-theme-config.html#sidebar
    sidebar: [
      '/',
      {
        title: '佈署',
        children: [
          '/deploy/execute',
          '/deploy/executeEnv',
          '/deploy/executeVue',
          '/deploy/executeNuxt',
          '/deploy/executeLaravel',
          '/deploy/execute/hooks',
          '/deploy/execute/commandArray',
        ]
      },
    ]
  },

  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: !isProduction ? `/manifest-dev.json` : `/manifest.json` }],
    ['meta', { name: 'theme-color', content: '#1bd5e3' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'mask-icon', href: '/icon.png', color: '#1bd5e3' }],
    ['link', { rel: 'apple-touch-icon', href: `/icon.png` }],
    ['meta', { name: 'msapplication-TileImage', content: `${baseUrl}icon.png` }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1.0' }],

    ['meta', { name: 'keywords', content: 'Hyper Rocket' }],
    ['meta', { name: 'description', content: 'Hyper Rocket' }],
    ['meta', { name: 'og:title', content: 'Hyper Rocket' }],
    ['meta', { name: 'og:site_name', content: 'Hyper Rocket' }],
    ['meta', { name: 'og:image', content: `https://ciao-chung.github.io${baseUrl}logo.png` }],
    ['meta', { name: 'og:description', content: 'Hyper Rocket' }],
  ],

  plugins: [
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: true,
    }],
    ['@vuepress/active-header-links', {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor'
    }]
  ],
}
