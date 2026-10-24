/**
 * Installation du site sur l'écran d'accueil (application web).
 * - Android (Chrome, Edge…) : l'autorisation « beforeinstallprompt » est captée dès le chargement
 *   (script dans nuxt.config.ts) ; si elle est là, on propose un bouton « Installer ».
 * - Sinon (événement pas encore reçu, autre navigateur, iPhone) : on affiche les étapes à suivre.
 * Seul un choix « plus tard » est mémorisé dans le navigateur (30 jours), jamais de données personnelles.
 */
const DISMISS_KEY = 'mbb-install-dismissed-until'
let listening = false

export function usePwaInstall() {
  const state = useState('pwa-install', () => ({
    ready: false,
    canPrompt: false,
    isIos: false,
    isAndroid: false,
    isStandalone: false,
    isMobile: false,
    visible: false,
  }))

  function dismissedRecently() {
    try {
      return Number(localStorage.getItem(DISMISS_KEY) || 0) > Date.now()
    } catch {
      return false
    }
  }

  function syncPrompt() {
    state.value.canPrompt = !!window.__mbbInstall
  }

  function detect() {
    if (import.meta.server) return
    if (!state.value.ready) {
      const ua = navigator.userAgent || ''
      const isIos = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
      const isAndroid = /Android/i.test(ua)
      const isStandalone =
        window.matchMedia?.('(display-mode: standalone)').matches ||
        window.matchMedia?.('(display-mode: fullscreen)').matches ||
        navigator.standalone === true
      const isMobile = isIos || isAndroid || (window.matchMedia?.('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 900)
      Object.assign(state.value, { ready: true, isIos, isAndroid, isStandalone, isMobile })
      syncPrompt()
      if (isMobile && !isStandalone && !dismissedRecently()) {
        setTimeout(() => (state.value.visible = true), 2500)
      }
    }
    if (!listening) {
      listening = true
      window.addEventListener('mbb-installable', syncPrompt)
      window.addEventListener('appinstalled', () => {
        window.__mbbInstall = null
        Object.assign(state.value, { canPrompt: false, visible: false, isStandalone: true })
      })
    }
  }

  async function install() {
    const e = window.__mbbInstall
    if (!e) return
    e.prompt()
    await e.userChoice.catch(() => null)
    window.__mbbInstall = null
    state.value.canPrompt = false
    state.value.visible = false
  }

  function dismiss() {
    state.value.visible = false
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 30 * 24 * 3600 * 1000))
    } catch {
      /* navigation privée : on ignore */
    }
  }

  function open() {
    syncPrompt()
    state.value.visible = true
  }

  // Proposé sur tout smartphone ou tablette, tant que le site n'est pas déjà installé
  const available = computed(() => state.value.ready && state.value.isMobile && !state.value.isStandalone)

  return { state, detect, install, dismiss, open, available }
}
