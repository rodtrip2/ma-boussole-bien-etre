<template>
  <section class="sektion">
    <div class="mb-6 text-center">
      <Icon name="ph:magnifying-glass-fill" class="mx-auto mb-4 text-6xl text-sky-600 dark:text-sky-400" />
      <h1 class="ptitle">{{ $t('techniques.thoughtRecord.name') }}</h1>
      <p class="mx-auto mb-2 max-w-2xl leading-relaxed text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.intro') }}</p>
      <p class="mx-auto max-w-2xl text-sm text-gray-500 dark:text-slate-400">
        <Icon name="ph:lock-simple" class="mr-1 align-[-2px]" />{{ $t('thoughtRecord.tool.privacy') }}
      </p>
    </div>

    <div class="mx-auto max-w-3xl border border-sky-200 bg-white p-6 dark:border-sky-800 dark:bg-slate-800 sm:p-8">
      <div class="no-print mb-2 flex justify-between text-sm text-gray-500 dark:text-slate-400">
        <span>{{ $t('thoughtRecord.tool.stepOf', { n: step, total: TOTAL }) }}</span>
        <span>{{ Math.round((step / TOTAL) * 100) }} %</span>
      </div>
      <div class="no-print mb-6 h-1.5 w-full bg-gray-200 dark:bg-slate-700">
        <div class="h-1.5 bg-sky-600 transition-all duration-300" :style="{ width: (step / TOTAL) * 100 + '%' }" />
      </div>

      <!-- 1. Situation -->
      <div v-if="step === 1">
        <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-slate-100">{{ $t('thoughtRecord.tool.s1.title') }}</h2>
        <label for="tr-situation" class="mb-3 block text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.s1.help') }}</label>
        <textarea id="tr-situation" v-model="r.situation" rows="4" maxlength="800" :placeholder="$t('thoughtRecord.tool.s1.placeholder')" :class="field" />
      </div>

      <!-- 2. Émotions -->
      <div v-else-if="step === 2">
        <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-slate-100">{{ $t('thoughtRecord.tool.s2.title') }}</h2>
        <p class="mb-3 text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.s2.help') }}</p>
        <div class="mb-3 flex flex-wrap gap-2" role="group" :aria-label="$t('thoughtRecord.tool.s2.title')">
          <button
            v-for="e in emotionList"
            :key="e"
            type="button"
            :aria-pressed="r.emotions.includes(e)"
            class="border px-3 py-1.5 text-sm"
            :class="r.emotions.includes(e) ? chipOn : chipOff"
            @click="toggle(r.emotions, e)"
          >
            {{ e }}
          </button>
        </div>
        <label for="tr-other" class="sr-only">{{ $t('thoughtRecord.tool.s2.other') }}</label>
        <input id="tr-other" v-model="otherEmotion" type="text" maxlength="40" :placeholder="$t('thoughtRecord.tool.s2.other')" :class="[field, 'mb-5']" @keydown.enter.prevent="addOther" @blur="addOther" />
        <RangeField v-model="r.intensityBefore" :label="$t('thoughtRecord.tool.s2.intensity')" id="tr-int" />
      </div>

      <!-- 3. Pensée -->
      <div v-else-if="step === 3">
        <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-slate-100">{{ $t('thoughtRecord.tool.s3.title') }}</h2>
        <label for="tr-thought" class="mb-3 block text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.s3.help') }}</label>
        <textarea id="tr-thought" v-model="r.thought" rows="3" maxlength="500" :placeholder="$t('thoughtRecord.tool.s3.placeholder')" :class="[field, 'mb-5']" />
        <RangeField v-model="r.beliefBefore" :label="$t('thoughtRecord.tool.s3.belief')" id="tr-bel" />
      </div>

      <!-- 4. Pièges -->
      <div v-else-if="step === 4">
        <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-slate-100">
          {{ $t('thoughtRecord.tool.s4.title') }} <span class="text-sm font-normal text-gray-500">{{ $t('thoughtRecord.tool.optional') }}</span>
        </h2>
        <p class="mb-2 text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.s4.help') }}</p>
        <p v-if="r.thought" class="mb-4 border-l-4 border-sky-300 bg-sky-50 p-3 italic text-gray-700 dark:bg-sky-900/20 dark:text-slate-200">« {{ r.thought }} »</p>
        <div class="grid gap-2 sm:grid-cols-2">
          <button
            v-for="trap in trapList"
            :key="trap.name"
            type="button"
            :aria-pressed="r.traps.includes(trap.name)"
            class="border p-3 text-left"
            :class="r.traps.includes(trap.name) ? chipOn : chipOff"
            @click="toggle(r.traps, trap.name)"
          >
            <span class="block font-medium">{{ trap.name }}</span>
            <span class="block text-xs opacity-80">{{ trap.desc }}</span>
          </button>
        </div>
      </div>

      <!-- 5. Faits -->
      <div v-else-if="step === 5">
        <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-slate-100">{{ $t('thoughtRecord.tool.s5.title') }}</h2>
        <p class="mb-4 text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.s5.help') }}</p>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="tr-for" class="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">{{ $t('thoughtRecord.tool.s5.for') }}</label>
            <textarea id="tr-for" v-model="r.evidenceFor" rows="5" maxlength="800" :placeholder="$t('thoughtRecord.tool.s5.placeholderFor')" :class="field" />
          </div>
          <div>
            <label for="tr-against" class="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">{{ $t('thoughtRecord.tool.s5.against') }}</label>
            <textarea id="tr-against" v-model="r.evidenceAgainst" rows="5" maxlength="800" :placeholder="$t('thoughtRecord.tool.s5.placeholderAgainst')" :class="field" />
          </div>
        </div>
      </div>

      <!-- 6. Autre regard -->
      <div v-else-if="step === 6">
        <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-slate-100">{{ $t('thoughtRecord.tool.s6.title') }}</h2>
        <p class="mb-2 text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.s6.help') }}</p>
        <ul class="mb-4 list-disc space-y-1 pl-6 text-sm text-gray-700 dark:text-slate-300">
          <li v-for="(q, i) in tm('thoughtRecord.tool.s6.questions')" :key="i">{{ rt(q) }}</li>
        </ul>
        <label for="tr-alt" class="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">{{ $t('thoughtRecord.tool.s6.alternative') }}</label>
        <textarea id="tr-alt" v-model="r.alternative" rows="4" maxlength="600" :placeholder="$t('thoughtRecord.tool.s6.placeholder')" :class="[field, 'mb-5']" />
        <RangeField v-model="r.beliefAlternative" :label="$t('thoughtRecord.tool.s6.belief')" id="tr-belalt" />
      </div>

      <!-- 7. Bilan -->
      <div v-else>
        <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-slate-100">{{ $t('thoughtRecord.tool.s7.title') }}</h2>
        <p class="mb-3 text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.s7.help') }}</p>
        <p v-if="r.alternative" class="mb-5 border-l-4 border-sky-400 bg-sky-50 p-3 italic text-gray-800 dark:bg-sky-900/20 dark:text-slate-100">« {{ r.alternative }} »</p>
        <RangeField v-model="r.intensityAfter" :label="$t('thoughtRecord.tool.s7.intensityNow')" id="tr-after" />

        <div class="my-6 grid grid-cols-2 gap-4 text-center">
          <div class="border border-gray-200 p-4 dark:border-slate-600">
            <p class="text-sm text-gray-500 dark:text-slate-400">{{ $t('thoughtRecord.tool.s7.before') }}</p>
            <p class="text-3xl font-bold text-gray-800 dark:text-slate-100">{{ r.intensityBefore }}<span class="text-base font-normal text-gray-500">/100</span></p>
          </div>
          <div class="border border-sky-300 bg-sky-50 p-4 dark:border-sky-700 dark:bg-sky-900/20">
            <p class="text-sm text-gray-500 dark:text-slate-400">{{ $t('thoughtRecord.tool.s7.after') }}</p>
            <p class="text-3xl font-bold text-sky-700 dark:text-sky-300">{{ r.intensityAfter }}<span class="text-base font-normal text-gray-500">/100</span></p>
          </div>
        </div>
        <p v-if="r.intensityBefore - r.intensityAfter < 10" class="mb-4 text-sm text-gray-600 dark:text-slate-300">{{ $t('thoughtRecord.tool.s7.noChange') }}</p>

        <details class="mb-5 border border-gray-200 p-4 dark:border-slate-600" open>
          <summary class="cursor-pointer font-medium text-gray-800 dark:text-slate-100">{{ $t('thoughtRecord.tool.s7.summary') }}</summary>
          <dl class="mt-3 space-y-3 text-sm">
            <div v-for="[label, value] in report.sections" :key="label">
              <dt class="font-semibold text-gray-800 dark:text-slate-100">{{ label }}</dt>
              <dd class="whitespace-pre-line text-gray-700 dark:text-slate-300">{{ value }}</dd>
            </div>
          </dl>
        </details>

        <div class="no-print flex flex-wrap gap-3">
          <button type="button" class="inline-flex items-center gap-2 bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 disabled:opacity-60" :disabled="exporting" @click="exportPdf">
            <Icon name="ph:file-pdf" /> {{ $t('thoughtRecord.tool.s7.download') }}
          </button>
          <button type="button" class="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-100" @click="printPage">
            <Icon name="ph:printer" /> {{ $t('thoughtRecord.tool.s7.print') }}
          </button>
          <button type="button" class="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-100" @click="restart">
            <Icon name="ph:arrow-counter-clockwise" /> {{ $t('thoughtRecord.tool.restart') }}
          </button>
        </div>
        <p v-if="exportError" class="mt-3 text-sm text-red-700 dark:text-red-300">{{ $t('thoughtRecord.tool.s7.pdfError') }}</p>
      </div>

      <!-- Navigation -->
      <div v-if="step < TOTAL" class="no-print mt-6 flex items-center justify-between">
        <button type="button" class="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-40 dark:text-slate-300" :disabled="step === 1" @click="step--">
          <Icon name="ph:arrow-left" /> {{ $t('thoughtRecord.tool.prev') }}
        </button>
        <button type="button" class="inline-flex items-center gap-2 bg-sky-600 px-5 py-2 font-medium text-white hover:bg-sky-700" @click="next">
          {{ step === TOTAL - 1 ? $t('thoughtRecord.tool.finish') : $t('thoughtRecord.tool.next') }} <Icon name="ph:arrow-right" />
        </button>
      </div>
      <div v-else class="no-print mt-4">
        <button type="button" class="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-slate-300" @click="step--">
          <Icon name="ph:arrow-left" /> {{ $t('thoughtRecord.tool.prev') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { buildThoughtRecord, downloadThoughtRecordPdf } from '~/utils/thoughtRecordExport'

// Toutes les réponses restent en mémoire dans la page : rien n'est enregistré ni envoyé.
const { tm, rt } = useI18n()
const TOTAL = 7
const step = ref(1)
const otherEmotion = ref('')
const exporting = ref(false)
const exportError = ref(false)

const blank = () => ({
  situation: '',
  emotions: [],
  intensityBefore: 70,
  thought: '',
  beliefBefore: 70,
  traps: [],
  evidenceFor: '',
  evidenceAgainst: '',
  alternative: '',
  beliefAlternative: 50,
  intensityAfter: null,
})
const r = reactive(blank())

const emotionList = computed(() => [...tm('thoughtRecord.tool.s2.emotions').map((e) => rt(e)), ...r.emotions.filter((e) => !tm('thoughtRecord.tool.s2.emotions').map((x) => rt(x)).includes(e))])
const trapList = computed(() => tm('thoughtRecord.tool.s4.traps').map((t) => ({ name: rt(t.name), desc: rt(t.desc) })))
const labels = computed(() => Object.fromEntries(Object.entries(tm('thoughtRecord.tool.pdf')).map(([k, v]) => [k, rt(v)])))
const report = computed(() => buildThoughtRecord(r, labels.value))

const field =
  'w-full border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100'
const chipOn = 'border-sky-600 bg-sky-50 text-sky-900 dark:border-sky-400 dark:bg-sky-900/30 dark:text-sky-100'
const chipOff = 'border-gray-300 text-gray-700 hover:border-sky-300 dark:border-slate-600 dark:text-slate-300'

function toggle(list, value) {
  const i = list.indexOf(value)
  if (i === -1) list.push(value)
  else list.splice(i, 1)
}

function addOther() {
  const v = otherEmotion.value.trim()
  if (v && !r.emotions.includes(v)) r.emotions.push(v)
  otherEmotion.value = ''
}

function next() {
  if (step.value === 6 && r.intensityAfter === null) r.intensityAfter = r.intensityBefore
  step.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function restart() {
  Object.assign(r, blank())
  step.value = 1
}

async function exportPdf() {
  exporting.value = true
  exportError.value = false
  try {
    await downloadThoughtRecordPdf(report.value)
  } catch (e) {
    console.error(e)
    exportError.value = true
  } finally {
    exporting.value = false
  }
}

function printPage() {
  window.print()
}

// Curseur 0-100 réutilisable
const RangeField = defineComponent({
  props: { modelValue: Number, label: String, id: String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('div', [
        h('label', { for: props.id, class: 'mb-1 flex justify-between text-sm font-medium text-gray-700 dark:text-slate-300' }, [
          h('span', props.label),
          h('span', { class: 'font-mono text-sky-700 dark:text-sky-300' }, `${props.modelValue}/100`),
        ]),
        h('input', {
          id: props.id,
          type: 'range',
          min: 0,
          max: 100,
          step: 5,
          value: props.modelValue,
          class: 'w-full accent-sky-600',
          onInput: (e) => emit('update:modelValue', Number(e.target.value)),
        }),
      ])
  },
})
</script>

<style>
@media print {
  header,
  footer.app-footer,
  .no-print {
    display: none !important;
  }
}
</style>
