import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  sourcemap: {
    client: false,
    server: false
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_SITE_URL || 'http://localhost:3000'
    }
  },

  nitro: {
    preset: "static",
    logLevel: 4,
    prerender: {
      autoSubfolderIndex: true,
      crawlLinks: true,
      failOnError: false,
      routes: ['/']
    }
  },
  vite: {
    server: {
      allowedHosts: true
    },
    define: {
      // URL de base (sous-dossier éventuel), utilisée par utils/asset.js
      __APP_BASE_URL__: JSON.stringify(process.env.NUXT_APP_BASE_URL || '/'),
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxtjs/device",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/seo",
    "@nuxtjs/i18n",
    "@vite-pwa/nuxt",
  ],

  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.ts",
    exposeConfig: false,
    viewer: true,
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  image: {
    provider: process.env.NODE_ENV === 'production' ? 'ipxStatic' : 'ipx',
    quality: 80,
    format: ["webp"],
    domains: [],
    dir: 'public',
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    densities: [1, 2],
    presets: {
      blog: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 800,
          height: 450
        }
      }
    }
  },

  // Police Inter embarquée localement (aucun appel à Google Fonts)
  css: ['@fontsource-variable/inter'],

  // Icônes intégrées au bundle (aucun appel à l'API Iconify)
  icon: {
    provider: 'none',
    fallbackToApi: false,
    clientBundle: {
      scan: { globInclude: ['components/**', 'pages/**', 'composables/**', 'layouts/**', 'utils/**', 'data/**', '*.vue'] },
      icons: ['material-symbols:landscape', 'ph:bell-ringing', 'ph:warning', 'ph:arrows-clockwise', 'ph:lightning', 'ph:door', 'ph:hand-heart', 'ph:first-aid-kit'],
    },
  },

  site: {
    url: process.env.NUXT_SITE_URL || 'http://localhost:3000',
    name: 'Ma boussole bien-être',
  },

  ogImage: {
    enabled: false,
    defaults: {
      component: 'NuxtSeo',
    },
  },

  seo: {
    meta: {
      ogImage: '/og.png',
      twitterCard: 'summary_large_image',
      themeColor: '#9333ea',
      robots: 'index, follow',
    }
  },

  // robots.txt impossible à générer quand le site est dans un sous-dossier
  robots: {
    robotsTxt: !process.env.NUXT_APP_BASE_URL || process.env.NUXT_APP_BASE_URL === '/',
  },

  schemaOrg: {
    identity: 'Organization',
  },

  i18n: {
    baseUrl: process.env.NUXT_SITE_URL || 'http://localhost:3000',
    compilation: {
      strictMessage: false,
    },
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        files: [
          'en/navigation.json',
          'en/techniques.json',
          'en/pages.json',
          'en/meta.json',
          'en/legal.json',
          'en/breathing.json',
          'en/guided-breathing.json',
          'en/grounding.json',
          'en/peaceful-visualization.json',
          'en/progressive-muscle-relaxation.json',
          'en/sound-therapy.json',
          'en/stress-relief-bubbles.json',
          'en/thought-labeling.json',
          'en/fidget-spinner.json',
          'en/self-tests.json',
          'en/worry-time.json',
          'en/leaves.json',
          'en/self-compassion.json',
          'en/understanding.json'
        ]
      },
      {
        code: 'fr',
        language: 'fr',
        name: 'Français',
        files: [
          'fr/navigation.json',
          'fr/techniques.json',
          'fr/pages.json',
          'fr/meta.json',
          'en/legal.json',
          'fr/breathing.json',
          'fr/guided-breathing.json',
          'fr/grounding.json',
          'fr/peaceful-visualization.json',
          'fr/progressive-muscle-relaxation.json',
          'fr/sound-therapy.json',
          'fr/stress-relief-bubbles.json',
          'fr/thought-labeling.json',
          'fr/fidget-spinner.json',
          'fr/self-tests.json',
          'fr/worry-time.json',
          'fr/leaves.json',
          'fr/self-compassion.json',
          'fr/understanding.json'
        ]
      },
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default'
  },

  compatibilityDate: "2024-12-26",

  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      // Hors ligne : uniquement les pages françaises et les ressources communes
      globIgnores: ['en/**', '**/_payload.json', '200.html', '404.html'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
    client: {
      installPrompt: true,
    },
    manifest: {
      name: 'Ma boussole bien-être',
      short_name: 'Ma boussole',
      description: "Exercices d'apaisement et questionnaires d'auto-évaluation",
      theme_color: '#9333ea',
      background_color: '#ffffff',
      display: 'standalone',
      scope: process.env.NUXT_APP_BASE_URL || '/',
      start_url: process.env.NUXT_APP_BASE_URL || '/',
      icons: [
        {
          src: 'aat.svg',
          sizes: 'any',
          type: 'image/svg+xml'
        },
        {
          src: 'web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: 'web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    }
  },
});
