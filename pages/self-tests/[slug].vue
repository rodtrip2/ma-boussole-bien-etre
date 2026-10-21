<template>
  <div class="mybg transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <div class="py-8 pt-20">
        <div class="sektion mx-auto max-w-3xl">
          <NuxtLink
            :to="localePath('/self-tests')"
            class="no-print mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <Icon name="ph:arrow-left" /> Tous les questionnaires
          </NuxtLink>

          <h1 class="mb-2 text-3xl font-bold text-gray-800 dark:text-slate-100">{{ def.title }}</h1>
          <p class="mb-8 text-gray-500 dark:text-slate-400">
            {{ def.topic }} · {{ def.items.length }} questions · {{ def.duration }}
          </p>

          <div
            v-if="locale !== 'fr'"
            class="mb-6 border border-blue-200 bg-blue-50 p-4 text-gray-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-slate-300"
          >
            {{ $t('selfTests.onlyFrench') }}
          </div>

          <!-- Présentation -->
          <section v-if="step === 'intro'" class="space-y-6">
            <div class="border border-gray-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
              <p class="mb-4 text-lg leading-relaxed text-gray-700 dark:text-slate-200">{{ def.instruction }}</p>
              <p v-if="def.note" class="mb-4 text-sm text-gray-600 dark:text-slate-300">
                <Icon name="ph:info" class="mr-1 align-[-2px]" />{{ def.note }}
              </p>
              <ul class="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-slate-300">
                <li>Répondez spontanément : il n’y a pas de bonne ou de mauvaise réponse.</li>
                <li>Vous pouvez revenir à la question précédente à tout moment.</li>
                <li>Rien n’est enregistré : vos réponses disparaissent quand vous quittez la page.</li>
                <li>Ce questionnaire aide à faire le point ; il ne pose pas de diagnostic.</li>
              </ul>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 bg-blue-600 px-6 py-3 text-lg font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              @click="start"
            >
              <Icon name="ph:play-fill" /> Commencer
            </button>
          </section>

          <!-- Questions -->
          <section v-else-if="step === 'questions'" aria-live="polite">
            <div class="mb-2 flex justify-between text-sm text-gray-500 dark:text-slate-400">
              <span>Question {{ current + 1 }} sur {{ def.items.length }}</span>
              <span>{{ progress }} %</span>
            </div>
            <div class="mb-6 h-1.5 w-full bg-gray-200 dark:bg-slate-700">
              <div class="h-1.5 bg-blue-600 transition-all duration-300" :style="{ width: progress + '%' }" />
            </div>

            <div class="border border-gray-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
              <p class="mb-1 text-sm text-gray-500 dark:text-slate-400">{{ def.instruction }}</p>
              <p v-if="def.note && current < 3" class="mb-3 text-xs text-gray-500 dark:text-slate-400">{{ def.note }}</p>
              <h2 :id="`q-${current}`" class="mb-6 text-xl font-semibold leading-snug text-gray-800 dark:text-slate-100">
                {{ def.items[current].text }}
              </h2>
              <div role="radiogroup" :aria-labelledby="`q-${current}`" class="grid gap-3">
                <button
                  v-for="(opt, k) in optionsFor(def, current)"
                  :key="opt.label"
                  type="button"
                  role="radio"
                  :aria-checked="answers[current] === opt.value"
                  class="flex items-center gap-3 border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  :class="
                    answers[current] === opt.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                  "
                  @click="answer(opt.value)"
                >
                  <span
                    class="flex h-7 w-7 flex-shrink-0 items-center justify-center border text-sm font-semibold"
                    :class="answers[current] === opt.value ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-500 dark:border-slate-500 dark:text-slate-300'"
                  >
                    {{ k + 1 }}
                  </span>
                  <span>{{ opt.label }}</span>
                </button>
              </div>
            </div>

            <div v-if="support" class="mt-6"><CrisisNotice strong /></div>

            <div class="mt-6 flex items-center justify-between">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-40 dark:text-slate-300"
                :disabled="history.length === 0"
                @click="back"
              >
                <Icon name="ph:arrow-left" /> Précédent
              </button>
              <span class="hidden text-xs text-gray-400 sm:inline">Astuce : touches 1 à {{ optionsFor(def, current).length }}</span>
            </div>
          </section>

          <!-- Question complémentaire (non comptée) -->
          <section v-else-if="step === 'extra'">
            <div class="border border-gray-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
              <h2 class="mb-6 text-xl font-semibold leading-snug text-gray-800 dark:text-slate-100">{{ def.extra.text }}</h2>
              <div class="grid gap-3">
                <button
                  v-for="opt in def.extra.options"
                  :key="opt.label"
                  type="button"
                  class="border border-gray-200 bg-white px-4 py-3 text-left text-gray-800 transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  @click="extraAnswer = opt; step = 'result'"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
            <div v-if="support" class="mt-6"><CrisisNotice strong /></div>
            <button type="button" class="mt-6 inline-flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-slate-300" @click="backFromExtra">
              <Icon name="ph:arrow-left" /> Précédent
            </button>
          </section>

          <!-- Résultat -->
          <section v-else-if="step === 'result' && result" class="space-y-6">
            <div v-if="support"><CrisisNotice strong /></div>

            <div class="border border-gray-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
              <p class="print-only mb-3 text-sm text-gray-600">Rempli le {{ new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }) }}<template v-if="reportName.trim()"> — {{ reportName.trim() }}</template></p>
              <p class="mb-1 text-sm uppercase tracking-wide text-gray-500 dark:text-slate-400">Votre score</p>
              <p class="mb-4 text-4xl font-bold text-gray-800 dark:text-slate-100">
                {{ result.score }}<span class="text-xl font-normal text-gray-500"> / {{ def.score.max }}{{ def.score.unit ? ' ' + def.score.unit : '' }}</span>
              </p>
              <div class="mb-4 h-3 w-full bg-gray-200 dark:bg-slate-700">
                <div class="h-3 transition-all duration-500" :class="barColor" :style="{ width: scorePercent + '%' }" />
              </div>
              <p v-if="result.band" class="mb-2 text-xl font-semibold" :class="bandText">{{ result.band.label }}</p>
              <p v-if="support" class="mb-2 font-medium leading-relaxed text-red-700 dark:text-red-300">
                Quel que soit le score total, votre réponse à la question 9 justifie d’en parler rapidement à un
                professionnel de santé.
              </p>
              <p v-if="def.resultText" class="mb-2 leading-relaxed text-gray-700 dark:text-slate-300">{{ def.resultText }}</p>
              <p v-if="result.band && result.band.advice" class="leading-relaxed text-gray-700 dark:text-slate-300">
                {{ result.band.advice }}
              </p>
              <p v-if="extraAnswer" class="mt-4 text-sm text-gray-600 dark:text-slate-300">
                Retentissement sur la vie quotidienne : <strong>{{ extraAnswer.label }}</strong>
              </p>
              <p class="mt-4 text-sm text-gray-500 dark:text-slate-400">{{ def.scoreNote }}</p>
            </div>

            <div class="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-relaxed text-gray-700 dark:bg-amber-900/20 dark:text-slate-300">
              Ce résultat n’est pas un diagnostic. Il reflète vos réponses à un moment donné. Si vous êtes
              inquiet(ète), ou si ce résultat vous interroge, parlez-en à votre médecin traitant ou à un
              professionnel de santé mentale.
            </div>

            <details ref="answersDetails" class="border border-gray-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800">
              <summary class="cursor-pointer font-medium text-gray-800 dark:text-slate-100">Revoir mes réponses</summary>
              <ol class="mt-4 space-y-3 text-sm">
                <li v-for="i in askedPath(def, answers)" :key="i" class="text-gray-700 dark:text-slate-300">
                  <span class="font-medium">{{ i + 1 }}. {{ def.items[i].text }}</span><br />
                  <span class="text-gray-500 dark:text-slate-400">→ {{ labelFor(i) }}</span>
                </li>
              </ol>
            </details>

            <!-- Export -->
            <div class="no-print border border-gray-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
              <h2 class="mb-1 text-lg font-semibold text-gray-800 dark:text-slate-100">Garder ou partager mes résultats</h2>
              <p class="mb-4 text-sm text-gray-600 dark:text-slate-300">
                Le document contient la date, le score, l’interprétation et toutes vos réponses. Il est créé sur votre
                appareil : rien n’est envoyé sur internet. Vous pouvez l’apporter à votre médecin ou à votre soignant.
              </p>
              <label for="report-name" class="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
                Nom ou initiales à faire figurer sur le document (facultatif)
              </label>
              <input
                id="report-name"
                v-model="reportName"
                type="text"
                maxlength="80"
                autocomplete="off"
                class="mb-4 w-full max-w-sm border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
              <div class="flex flex-wrap gap-3">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  :disabled="exporting"
                  @click="exportPdf"
                >
                  <Icon name="ph:file-pdf" /> {{ exporting ? 'Création du PDF…' : 'Télécharger en PDF' }}
                </button>
                <button type="button" class="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" @click="print">
                  <Icon name="ph:printer" /> Imprimer
                </button>
              </div>
              <p v-if="exportError" class="mt-3 text-sm text-red-700 dark:text-red-300">{{ exportError }}</p>
            </div>

            <div class="no-print flex flex-wrap gap-3">
              <button type="button" class="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" @click="restart">
                <Icon name="ph:arrow-counter-clockwise" /> Recommencer
              </button>
            </div>

            <CrisisNotice v-if="!support" class="no-print" />
          </section>

          <!-- Source -->
          <footer class="mt-10 border-t border-gray-200 pt-6 text-xs leading-relaxed text-gray-500 dark:border-slate-700 dark:text-slate-400">
            <p class="mb-1 font-semibold">Source : {{ def.source.version }}</p>
            <p class="mb-1">{{ def.source.authors }}</p>
            <p class="mb-1">{{ def.source.reference }}</p>
            <p class="mb-1">{{ def.source.licence }}</p>
            <a :href="def.source.url" target="_blank" rel="noopener noreferrer" class="underline">{{ def.source.url }}</a>
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { getAssessment } from '~/data/assessments'
import { optionsFor, nextIndex, askedPath, computeScore, needsSupport } from '~/utils/assessmentScoring'
import { buildReport, downloadReportPdf } from '~/utils/assessmentExport'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const def = getAssessment(route.params.slug)
if (!def) throw createError({ statusCode: 404, statusMessage: 'Questionnaire introuvable', fatal: true })

useSeoMeta({ title: def.title, description: def.summary })

const step = ref('intro')
const current = ref(0)
const answers = ref([])
const history = ref([]) // questions précédentes (gère les sauts de l'AUDIT)
const extraAnswer = ref(null)
let advanceTimer = null

const support = computed(() => needsSupport(def, answers.value))
const progress = computed(() => Math.round((current.value / def.items.length) * 100))
const result = computed(() => (step.value === 'result' ? computeScore(def, answers.value) : null))
const scorePercent = computed(() =>
  result.value ? Math.round(((result.value.score - def.score.min) / (def.score.max - def.score.min)) * 100) : 0
)

// Réponse positive à la question 9 du PHQ-9 : jamais de code couleur rassurant
const level = computed(() => (support.value ? Math.max(2, result.value?.band?.level ?? 0) : result.value?.band?.level ?? -1))
const barColor = computed(() => (['bg-green-500', 'bg-yellow-400', 'bg-orange-500', 'bg-red-500'][level.value] || 'bg-blue-500'))
const bandText = computed(
  () =>
    [
      'text-green-700 dark:text-green-400',
      'text-yellow-700 dark:text-yellow-400',
      'text-orange-700 dark:text-orange-400',
      'text-red-700 dark:text-red-400',
    ][level.value] || 'text-gray-800 dark:text-slate-100'
)

function start() {
  answers.value = []
  history.value = []
  current.value = 0
  extraAnswer.value = null
  step.value = 'questions'
}

function answer(value) {
  const copy = [...answers.value]
  copy[current.value] = value
  answers.value = copy
  clearTimeout(advanceTimer)
  advanceTimer = setTimeout(advance, 250)
}

function advance() {
  const next = nextIndex(def, answers.value, current.value)
  if (next < def.items.length) {
    history.value.push(current.value)
    current.value = next
  } else if (def.extra && def.extra.showIf(answers.value)) {
    step.value = 'extra'
  } else {
    extraAnswer.value = null
    step.value = 'result'
  }
}

function back() {
  clearTimeout(advanceTimer)
  if (history.value.length) current.value = history.value.pop()
}

function backFromExtra() {
  step.value = 'questions'
}

function restart() {
  step.value = 'intro'
  answers.value = []
  history.value = []
  extraAnswer.value = null
  reportName.value = ''
  window.scrollTo({ top: 0 })
}

function labelFor(i) {
  return optionsFor(def, i).find((o) => o.value === answers.value[i])?.label ?? '—'
}

const answersDetails = ref(null)
const reportName = ref('')
const exporting = ref(false)
const exportError = ref('')

async function exportPdf() {
  exporting.value = true
  exportError.value = ''
  try {
    const report = buildReport(def, answers.value, { extraAnswer: extraAnswer.value, name: reportName.value })
    await downloadReportPdf(report, def.shortName)
  } catch (e) {
    console.error(e)
    exportError.value = 'Le PDF n’a pas pu être créé. Utilisez « Imprimer », puis « Enregistrer au format PDF ».'
  } finally {
    exporting.value = false
  }
}

function print() {
  // affiche les réponses dans la version imprimée
  if (answersDetails.value) answersDetails.value.open = true
  window.print()
}

function onKey(e) {
  if (step.value !== 'questions' || e.metaKey || e.ctrlKey || e.altKey) return
  const n = Number.parseInt(e.key, 10)
  const opts = optionsFor(def, current.value)
  if (n >= 1 && n <= opts.length) answer(opts[n - 1].value)
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  clearTimeout(advanceTimer)
})
</script>

<style>
.print-only {
  display: none;
}
@media print {
  .print-only {
    display: block !important;
  }
  header,
  footer.app-footer,
  .no-print {
    display: none !important;
  }
}
</style>
