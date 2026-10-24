/**
 * Installation du site sur l'écran d'accueil (application web).
 * - Android / Chrome / Edge : on garde l'événement « beforeinstallprompt » pour afficher
 *   notre propre bouton « Installer ».
 * - iPhone / iPad : Apple ne propose pas de bouton automatique ; on affiche les étapes.
 * Seul un choix « plus tard » est mémorisé dans le navigateur (30 jours), jamais de données personnelles.
 */
const DISMISS_KEY = 'mbb-install-dismissed-until'
let deferredPrompt = null
let listening = false

export function usePwaInstall() {
  const state = useState('pwa-install', () => ({
    ready: false, // l'environnement a été détecté (côté navigateur)
    canPrompt: false, // bouton natif disponible (Android…)
    isIos: false,
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

  function detect() {
    if (import.meta.server || state.value.ready) return
    const ua = navigator.userAgent || ''
    const isIos = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
    const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true
    const isMobile = window.matchMedia?.('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 900
    Object.assign(state.value, { ready: true, isIos, isStandalone, isMobile })

    if (!listening) {
      listening = true
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e
        state.value.canPrompt = true
        if (state.value.isMobile && !dismissedRecently()) state.value.visible = true
      })
      window.addEventListener('appinstalled', () => {
        deferredPrompt = null
        Object.assign(state.value, { canPrompt: false, visible: false, isStandalone: true })
      })
    }
    // Sur iPhone, l'invitation s'affiche d'elle-même (pas d'événement natif)
    if (isIos && isMobile && !isStandalone && !dismissedRecently()) {
      setTimeout(() => (state.value.visible = true), 2500)
    }
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice.catch(() => null)
    deferredPrompt = null
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

  // Ouverture volontaire depuis le menu : on ignore le « plus tard »
  function open() {
    state.value.visible = true
  }

  const available = computed(() => state.value.ready && !state.value.isStandalone && (state.value.canPrompt || state.value.isIos))

  return { state, detect, install, dismiss, open, available }
}
