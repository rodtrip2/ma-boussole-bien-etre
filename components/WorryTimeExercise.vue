<template>
  <section class="sektion">
    <div class="mb-8 text-center">
      <Icon name="ph:hourglass-medium-fill" class="mx-auto mb-4 text-6xl text-amber-600 dark:text-amber-400" />
      <h1 class="ptitle">{{ $t('techniques.worryTime.name') }}</h1>
      <p class="mx-auto mb-2 max-w-2xl leading-relaxed text-gray-600 dark:text-slate-300">{{ $t('worryTime.tool.intro') }}</p>
      <p class="mx-auto max-w-2xl text-sm text-gray-500 dark:text-slate-400">
        <Icon name="ph:lock-simple" class="mr-1 align-[-2px]" />{{ $t('worryTime.tool.privacy') }}
      </p>
    </div>

    <div class="mx-auto max-w-3xl space-y-6">
      <!-- 1. Noter -->
      <div class="border border-gray-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-slate-100">
          <Icon name="ph:note-pencil" class="text-amber-600 dark:text-amber-400" /> {{ $t('worryTime.tool.step1') }}
        </h2>
        <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="addWorry">
          <label for="worry-input" class="sr-only">{{ $t('worryTime.tool.step1') }}</label>
          <input
            id="worry-input"
            v-model="draft"
            type="text"
            maxlength="200"
            autocomplete="off"
            :placeholder="$t('worryTime.tool.placeholder')"
            class="flex-1 border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <button type="submit" class="bg-amber-600 px-5 py-2 font-medium text-white hover:bg-amber-700 disabled:opacity-50" :disabled="!draft.trim()">
            {{ $t('worryTime.tool.add') }}
          </button>
        </form>
        <ul class="mt-4 space-y-2">
          <li v-if="!worries.length" class="text-sm text-gray-500 dark:text-slate-400">{{ $t('worryTime.tool.empty') }}</li>
          <li
            v-for="w in worries"
            :key="w.id"
            class="flex items-start justify-between gap-3 border border-amber-100 bg-amber-50 px-3 py-2 text-gray-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-slate-100"
          >
            <span :class="w.resolved ? 'text-gray-400 line-through' : ''">{{ w.text }}</span>
            <button type="button" class="no-print text-gray-400 hover:text-red-600" :aria-label="$t('worryTime.tool.remove')" @click="removeWorry(w.id)">
              <Icon name="ph:trash" />
            </button>
          </li>
        </ul>
      </div>

      <!-- 2. Donner rendez-vous -->
      <div class="border border-gray-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
        <h2 class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-slate-100">
          <Icon name="ph:calendar-check" class="text-amber-600 dark:text-amber-400" /> {{ $t('worryTime.tool.step2') }}
        </h2>
        <p class="mb-4 leading-relaxed text-gray-700 dark:text-slate-300">{{ $t('worryTime.tool.step2Text') }}</p>
        <label for="worry-time" class="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">{{ $t('worryTime.tool.timeLabel') }}</label>
        <input
          id="worry-time"
          v-model="appointment"
          type="time"
          class="mb-4 border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        <p class="mb-3 text-sm leading-relaxed text-gray-600 dark:text-slate-300">{{ $t('worryTime.tool.untilThen') }}</p>
        <p class="no-print text-sm text-gray-600 dark:text-slate-300">
          {{ $t('worryTime.tool.backToPresent') }}
          <NuxtLink :to="localePath('/grounding')" class="text-amber-700 underline dark:text-amber-300">{{ $t('techniques.grounding.name') }}</NuxtLink>
          ·
          <NuxtLink :to="localePath('/breathing')" class="text-amber-700 underline dark:text-amber-300">{{ $t('techniques.breathing.name') }}</NuxtLink>
        </p>
      </div>

      <!-- 3. Le moment d'inquiétude -->
      <div class="border border-gray-200 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
        <h2 class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-slate-100">
          <Icon name="ph:hourglass-medium" class="text-amber-600 dark:text-amber-400" /> {{ $t('worryTime.tool.step3') }}
        </h2>
        <p class="mb-4 leading-relaxed text-gray-700 dark:text-slate-300">{{ $t('worryTime.tool.step3Text') }}</p>

        <div v-if="!running && !finished" class="no-print flex flex-wrap items-center gap-3">
          <span class="text-sm text-gray-600 dark:text-slate-300">{{ $t('worryTime.tool.duration') }} :</span>
          <button
            v-for="m in [10, 15, 20, 30]"
            :key="m"
            type="button"
            class="border px-3 py-1.5 text-sm"
            :class="minutes === m ? 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' : 'border-gray-300 text-gray-700 dark:border-slate-600 dark:text-slate-300'"
            @click="minutes = m"
          >
            {{ m }} {{ $t('worryTime.tool.minutes') }}
          </button>
          <button type="button" class="ml-auto inline-flex items-center gap-2 bg-amber-600 px-5 py-2 font-medium text-white hover:bg-amber-700" @click="start">
            <Icon name="ph:play-fill" /> {{ $t('worryTime.tool.start') }}
          </button>
        </div>

        <div v-if="running" class="mb-4 flex items-center justify-between border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-900/20" aria-live="polite">
          <span class="font-mono text-2xl text-amber-800 dark:text-amber-200">{{ clock }}</span>
          <span class="text-sm text-gray-600 dark:text-slate-300">{{ $t('worryTime.tool.remaining') }}</span>
          <button type="button" class="inline-flex items-center gap-2 bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800" @click="finish">
            <Icon name="ph:stop-fill" /> {{ $t('worryTime.tool.stop') }}
          </button>
        </div>

        <ul v-if="running || finished" class="space-y-4">
          <li v-for="w in worries" :key="w.id" class="border border-gray-200 p-4 dark:border-slate-600">
            <p class="mb-2 font-medium text-gray-800 dark:text-slate-100" :class="w.resolved ? 'text-gray-400 line-through' : ''">{{ w.text }}</p>
            <p class="mb-2 text-xs text-gray-500 dark:text-slate-400">{{ $t('worryTime.tool.stillWorried') }}</p>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="border px-3 py-1 text-sm" :class="w.resolved ? 'border-green-600 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'border-gray-300 text-gray-700 dark:border-slate-600 dark:text-slate-300'" @click="w.resolved = !w.resolved; w.act = false">
                <Icon name="ph:check-circle" class="mr-1 align-[-2px]" />{{ $t('worryTime.tool.noLonger') }}
              </button>
              <button type="button" class="border px-3 py-1 text-sm" :class="w.act ? 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' : 'border-gray-300 text-gray-700 dark:border-slate-600 dark:text-slate-300'" @click="w.act = !w.act; w.resolved = false">
                <Icon name="ph:footprints" class="mr-1 align-[-2px]" />{{ $t('worryTime.tool.canAct') }}
              </button>
            </div>
            <div v-if="w.act" class="mt-3">
              <label :for="`step-${w.id}`" class="mb-1 block text-sm text-gray-700 dark:text-slate-300">{{ $t('worryTime.tool.firstStep') }}</label>
              <input
                :id="`step-${w.id}`"
                v-model="w.step"
                type="text"
                maxlength="200"
                :placeholder="$t('worryTime.tool.firstStepPlaceholder')"
                class="w-full border border-gray-300 bg-white px-3 py-2 text-gray-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </li>
        </ul>

        <div v-if="finished" class="mt-4 border-l-4 border-green-500 bg-green-50 p-4 text-gray-700 dark:bg-green-900/20 dark:text-slate-200">
          {{ $t('worryTime.tool.done') }}
        </div>
      </div>

      <div v-if="worries.length" class="no-print text-center">
        <button type="button" class="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" @click="print">
          <Icon name="ph:printer" /> {{ $t('worryTime.tool.print') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
// Tout reste en mémoire dans la page : aucune inquiétude n'est enregistrée ni envoyée.
const localePath = useLocalePath()

const draft = ref('')
const worries = ref([])
const appointment = ref('18:00')
const minutes = ref(15)
const running = ref(false)
const finished = ref(false)
const remainingMs = ref(0)
let timer = null
let nextId = 1

function addWorry() {
  const text = draft.value.trim()
  if (!text) return
  worries.value.push({ id: nextId++, text, resolved: false, act: false, step: '' })
  draft.value = ''
}

function removeWorry(id) {
  worries.value = worries.value.filter((w) => w.id !== id)
}

const clock = computed(() => {
  const s = Math.max(0, Math.ceil(remainingMs.value / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
})

function start() {
  finished.value = false
  running.value = true
  remainingMs.value = minutes.value * 60000
  const end = Date.now() + remainingMs.value
  clearInterval(timer)
  timer = setInterval(() => {
    remainingMs.value = end - Date.now()
    if (remainingMs.value <= 0) finish()
  }, 500)
}

function finish() {
  clearInterval(timer)
  running.value = false
  finished.value = true
}

function print() {
  window.print()
}

onUnmounted(() => clearInterval(timer))
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
