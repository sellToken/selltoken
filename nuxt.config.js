export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'SellToken Defi 5.0',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'swiper/dist/css/swiper.css',
    'element-ui/lib/theme-chalk/index.css',
    '~/static/css/style.css',
    '~/static/css/element.css',
    '~/static/css/mobile.css'
  ],

  styleResources: {
    scss: '~/assets/global.scss'
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/vue-swiper',
    '@/plugins/vue-clipboard2'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/style-resources',
    // https://go.nuxtjs.dev/axios
    [
      '@nuxtjs/axios',
      {
        baseURL: ''
      }
    ],
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://i18n.nuxtjs.org/
    [
      '@nuxtjs/i18n',
      // i18n module options
      {
        defaultLocale: 'en',
        locales: [
          {
            code: 'en',
            file: 'en.json',
            name: 'English'
          },
          {
            code: 'zhHK',
            file: 'zhHK.json',
            name: '繁體中文'
          },
          {
            code: 'Kr', // 韩文
            file: 'Kr.json',
            name: '한국어'
          },
          {
            code: 'JP', // 日语
            file: 'JP.json',
            name: '日本語'
          },
          {
            code: 'AR', // 阿拉伯语
            file: 'AR.json',
            name: 'اللغة العربية'
          },
          {
            code: 'PH', // 菲律宾
            file: 'PH.json',
            name: 'Pilipino'
          },
          {
            code: 'VNF', // 越南语
            file: 'VNF.json',
            name: 'Tiếng Việt'
          }
        ],
        lazy: true,
        langDir: 'lang/'
      },
    ]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/,/^swiper/,/^web3/]
  }
}
