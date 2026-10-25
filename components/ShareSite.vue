<template>
  <!-- Fenêtre « Partager le site » -->
  <Transition name="fade">
    <div
      v-if="open"
      class="no-print fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      @click.self="close"
    >
      <div
        ref="dialogRef"
        class="flex max-h-[92vh] w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-slate-800 sm:rounded"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        tabindex="-1"
        style="padding-bottom: env(safe-area-inset-bottom)"
      >
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-slate-700">
          <h2 id="share-title" class="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-slate-100">
            <Icon name="ph:share-network" class="text-xl text-pink-600" />
            {{ $t('share.title') }}
          </h2>
          <button type="button" class="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200" :aria-label="$t('share.close')" @click="close">
            <Icon name="ph:x" class="text-xl" />
          </button>
        </div>

        <div class="overflow-y-auto px-5 py-4">
          <p class="text-sm text-gray-600 dark:text-slate-300">{{ $t('share.intro') }}</p>

          <!-- Lien -->
          <div class="mt-3 flex items-center gap-2 border border-gray-200 bg-gray-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-900">
            <span class="flex-1 truncate text-sm text-gray-700 dark:text-slate-200">{{ shownUrl }}</span>
            <button type="button" class="flex items-center gap-1 text-sm font-medium text-pink-700 hover:text-pink-900 dark:text-pink-300" @click="copyLink">
              <Icon :name="copied ? 'ph:check' : 'ph:copy'" class="text-base" />
              {{ copied ? $t('share.copied') : $t('share.copyLink') }}
            </button>
          </div>
          <button
            v-if="canShareLink"
            type="button"
            class="mt-2 flex w-full items-center justify-center gap-2 bg-pink-600 px-4 py-2.5 font-medium text-white hover:bg-pink-700"
            @click="shareLink"
          >
            <Icon name="ph:share-network" class="text-lg" />
            {{ $t('share.shareLink') }}
          </button>

          <!-- QR code plein écran -->
          <section class="mt-5 border-t border-gray-200 pt-4 dark:border-slate-700">
            <h3 class="flex items-center gap-2 font-semibold text-gray-800 dark:text-slate-100">
              <Icon name="ph:qr-code" class="text-lg text-pink-600" />
              {{ $t('share.qrTitle') }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-slate-300">{{ $t('share.qrText') }}</p>
            <button
              type="button"
              class="mt-2 flex items-center gap-2 border border-pink-600 px-4 py-2 font-medium text-pink-700 hover:bg-pink-50 disabled:opacity-50 dark:text-pink-300 dark:hover:bg-slate-700"
              :disabled="!qrPath"
              @click="openFullscreen"
            >
              <Icon name="ph:arrows-out" class="text-lg" />
              {{ $t('share.qrOpen') }}
            </button>
          </section>

          <!-- Carte JPG -->
          <section class="mt-5 border-t border-gray-200 pt-4 dark:border-slate-700">
            <h3 class="flex items-center gap-2 font-semibold text-gray-800 dark:text-slate-100">
              <Icon name="ph:image" class="text-lg text-pink-600" />
              {{ $t('share.cardTitle') }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-slate-300">{{ $t('share.cardText') }}</p>
            <div class="mt-2 aspect-[85/55] w-full overflow-hidden border border-gray-200 bg-gray-50 dark:border-slate-600">
              <img v-if="cardPreview" :src="cardPreview" :alt="$t('share.preview')" class="h-full w-full object-contain" />
              <div v-else class="flex h-full items-center justify-center text-sm text-gray-400">{{ $t('share.generating') }}</div>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-if="canShareFile"
                type="button"
                class="flex items-center gap-2 bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700 disabled:opacity-50"
                :disabled="!cardBlob"
                @click="shareCard"
              >
                <Icon name="ph:share-network" class="text-lg" />
                {{ $t('share.cardShare') }}
              </button>
              <button
                type="button"
                class="flex items-center gap-2 border border-pink-600 px-4 py-2 font-medium text-pink-700 hover:bg-pink-50 disabled:opacity-50 dark:text-pink-300 dark:hover:bg-slate-700"
                :disabled="!cardBlob"
                @click="downloadCard"
              >
                <Icon name="ph:download-simple" class="text-lg" />
                {{ $t('share.cardDownload') }}
              </button>
            </div>
          </section>

          <!-- Planche PDF -->
          <section class="mt-5 border-t border-gray-200 pt-4 dark:border-slate-700">
            <h3 class="flex items-center gap-2 font-semibold text-gray-800 dark:text-slate-100">
              <Icon name="ph:file-pdf" class="text-lg text-pink-600" />
              {{ $t('share.sheetTitle') }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-slate-300">{{ $t('share.sheetText') }}</p>
            <button
              type="button"
              class="mt-2 flex items-center gap-2 border border-pink-600 px-4 py-2 font-medium text-pink-700 hover:bg-pink-50 disabled:opacity-50 dark:text-pink-300 dark:hover:bg-slate-700"
              :disabled="!cardCanvas || pdfBusy"
              @click="downloadSheet"
            >
              <Icon name="ph:printer" class="text-lg" />
              {{ pdfBusy ? $t('share.generating') : $t('share.sheetDownload') }}
            </button>
          </section>

          <p v-if="error" class="mt-4 text-sm text-red-700 dark:text-red-400" role="alert">{{ error }}</p>
        </div>
      </div>
    </div>
  </Transition>

  <!-- QR code en plein écran -->
  <div
    v-if="fullscreen"
    ref="fsRef"
    class="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-white p-6 text-center"
    role="dialog"
    aria-modal="true"
    :aria-label="$t('share.qrTitle')"
  >
    <div class="flex items-center gap-3 text-gray-800">
      <AATLogo class-name="w-10 h-10" />
      <p class="text-2xl font-semibold">{{ $t('header.title') }}</p>
    </div>
    <svg
      v-if="qrPath"
      :viewBox="`-4 -4 ${qrSize + 8} ${qrSize + 8}`"
      class="h-auto w-[min(82vw,68vh)] bg-white"
      shape-rendering="crispEdges"
      role="img"
      :aria-label="$t('share.scan')"
    >
      <rect x="-4" y="-4" :width="qrSize + 8" :height="qrSize + 8" fill="#fff" />
      <path :d="qrPath" fill="#111827" />
    </svg>
    <p class="text-lg text-gray-700">{{ $t('share.scan') }}</p>
    <p class="break-all text-base font-semibold text-pink-700">{{ shownUrl }}</p>
    <button type="button" class="mt-2 flex items-center gap-2 border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100" @click="closeFullscreen">
      <Icon name="ph:x" class="text-lg" />
      {{ $t('share.close') }}
    </button>
  </div>
</template>

<script setup>
import { asset } from '~/utils/asset.js'
import {
  siteUrl,
  displayUrl,
  makeQr,
  qrSvgPath,
  renderCard,
  canvasToJpeg,
  downloadBlob,
  buildSheetPdf,
} from '~/utils/shareCard.js'

const { t, locale } = useI18n()
const open = useState('share-open', () => false)

const url = ref('')
const shownUrl = computed(() => displayUrl(url.value))
const qrPath = ref('')
const qrSize = ref(0)
const cardCanvas = shallowRef(null)
const cardBlob = shallowRef(null)
const cardPreview = ref('')
const copied = ref(false)
const pdfBusy = ref(false)
const error = ref('')
const fullscreen = ref(false)
const fsRef = ref(null)
const dialogRef = ref(null)
const canShareLink = ref(false)
const canShareFile = ref(false)
let wakeLock = null
let builtFor = ''

const fileBase = computed(() => t('share.fileName'))

async function prepare() {
  error.value = ''
  url.value = siteUrl(window.location.origin + asset('/'), locale.value)
  canShareLink.value = typeof navigator.share === 'function'
  const key = `${locale.value}|${url.value}`
  if (builtFor === key) return
  builtFor = key
  if (cardPreview.value) URL.revokeObjectURL(cardPreview.value)
  cardPreview.value = ''
  cardBlob.value = null
  cardCanvas.value = null
  try {
    const qr = await makeQr(url.value)
    qrSize.value = qr.size
    qrPath.value = qrSvgPath(qr)
    const canvas = await renderCard({
      url: url.value,
      qr,
      t: {
        title: t('header.title'),
        tagline: t('hero.title'),
        subtitle: t('header.subtitle'),
        features: t('share.features'),
        scan: t('share.scan'),
      },
    })
    cardCanvas.value = canvas
    cardBlob.value = await canvasToJpeg(canvas)
    cardPreview.value = URL.createObjectURL(cardBlob.value)
    try {
      const file = new File([cardBlob.value], `${fileBase.value}.jpg`, { type: 'image/jpeg' })
      canShareFile.value = !!navigator.canShare?.({ files: [file] })
    } catch {
      canShareFile.value = false
    }
  } catch (e) {
    console.error(e)
    builtFor = ''
    error.value = t('share.error')
  }
}

function close() {
  open.value = false
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(url.value)
  } catch {
    // Ancien navigateur : sélection manuelle
    const ta = document.createElement('textarea')
    ta.value = url.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

async function shareLink() {
  try {
    await navigator.share({ title: t('header.title'), text: t('share.shareText'), url: url.value })
  } catch {
    /* partage annulé */
  }
}

async function shareCard() {
  if (!cardBlob.value) return
  const file = new File([cardBlob.value], `${fileBase.value}.jpg`, { type: 'image/jpeg' })
  try {
    await navigator.share({ files: [file], title: t('header.title'), text: `${t('share.shareText')} ${url.value}` })
  } catch (e) {
    if (e?.name !== 'AbortError') downloadCard()
  }
}

function downloadCard() {
  if (cardBlob.value) downloadBlob(cardBlob.value, `${fileBase.value}.jpg`)
}

async function downloadSheet() {
  if (!cardCanvas.value) return
  pdfBusy.value = true
  error.value = ''
  try {
    const blob = await buildSheetPdf(cardCanvas.value, `${t('header.title')} — ${t('share.sheetHeader')}`)
    downloadBlob(blob, `${t('share.sheetFileName')}.pdf`)
  } catch (e) {
    console.error(e)
    error.value = t('share.error')
  } finally {
    pdfBusy.value = false
  }
}

async function openFullscreen() {
  fullscreen.value = true
  await nextTick()
  // Plein écran réel quand le navigateur le permet (pas sur iPhone : la page couvre alors l'écran)
  try {
    await fsRef.value?.requestFullscreen?.()
  } catch {
    /* non disponible */
  }
  // Garder l'écran allumé pendant qu'on montre le QR code
  try {
    wakeLock = await navigator.wakeLock?.request('screen')
  } catch {
    wakeLock = null
  }
}

async function closeFullscreen() {
  fullscreen.value = false
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
  } catch {
    /* rien */
  }
  try {
    await wakeLock?.release()
  } catch {
    /* rien */
  }
  wakeLock = null
}

function onFullscreenChange() {
  if (!document.fullscreenElement && fullscreen.value) closeFullscreen()
}

function onKey(e) {
  if (e.key !== 'Escape') return
  if (fullscreen.value) closeFullscreen()
  else if (open.value) close()
}

watch(open, async (v) => {
  if (v) {
    await nextTick()
    dialogRef.value?.focus()
    prepare()
  } else if (fullscreen.value) {
    closeFullscreen()
  }
})
watch(locale, () => {
  if (open.value) prepare()
})

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
