import { defineNuxtConfig } from "nuxt/config";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

/** Liste des fichiers audio français, pour une mise hors ligne complète (utilisée par Mon PCC) */
function writeOfflineAudioList() {
  const root = join(process.cwd(), "public");
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(mp3|ogg|m4a|wav)$/i.test(name)) out.push(relative(root, p).split("\\").join("/"));
    }
  };
  walk(join(root, "audios"));
  const fr = out.filter((f) => !/\/en\//.test(f)).sort();
  writeFileSync(join(root, "audios", "offline-fr.json"), JSON.stringify({ files: fr }, null, 2) + "\n");
}

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
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
      script: [
        {
          // Capte au plus tôt l'autorisation d'installer envoyée par Chrome / Edge (Android),
          // avant le chargement de l'application ; utilisée par composables/usePwaInstall.js
          innerHTML: "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__mbbInstall=e;window.dispatchEvent(new Event('mbb-installable'))});",
          tagPosition: 'head',
        },
        {
          // Mode intégré : page affichée dans une autre application (ex. Mon PCC, même site).
          // On masque immédiatement l'en-tête, le pied de page et les bandeaux (attribut data-integre).
          innerHTML: "try{if(window.self!==window.top||/[?&]integre=1/.test(location.search))document.documentElement.setAttribute('data-integre','')}catch(e){document.documentElement.setAttribute('data-integre','')}",
          tagPosition: 'head',
        },
      ],
      meta: [
        // Installation sur l'écran d'accueil de l'iPhone
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Ma boussole' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      ],
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
      themeColor: '#ffffff',
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
          'en/understanding.json',
          'en/thought-record.json'
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
          'fr/legal.json',
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
          'fr/understanding.json',
          'fr/thought-record.json'
        ]
      },
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default'
  },

  compatibilityDate: "2024-12-26",

  hooks: {
    "build:before": writeOfflineAudioList,
  },

  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: null,
      // _i18n/fr/messages.json : textes français, indispensables hors ligne
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}', '_i18n/fr/*.json'],
      // Hors ligne : uniquement les pages françaises et les ressources communes
      globIgnores: ['en/**', '**/_payload.json', '200.html', '404.html'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      // ?integre=1 (mode intégré) ne doit pas empêcher l'usage hors ligne
      ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^integre$/],
      // Sons et narrations : gardés en mémoire au premier usage (hors ligne ensuite)
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.pathname.includes("/audios/") && !url.pathname.endsWith(".json"),
          handler: "CacheFirst",
          options: {
            cacheName: "mbb-audios",
            rangeRequests: true,
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    client: {
      // Invitation à l'installation gérée par components/InstallBanner.vue
      installPrompt: false,
    },
    manifest: {
      name: 'Ma boussole bien-être',
      short_name: 'Ma boussole',
      description: "Exercices d'apaisement et questionnaires d'auto-évaluation",
      id: process.env.NUXT_APP_BASE_URL || '/',
      lang: 'fr',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      scope: process.env.NUXT_APP_BASE_URL || '/',
      start_url: process.env.NUXT_APP_BASE_URL || '/',
      icons: [
        { src: 'web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: 'web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: 'web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        { src: 'aat.svg', sizes: 'any', type: 'image/svg+xml' }
      ]
    }
  },
});
