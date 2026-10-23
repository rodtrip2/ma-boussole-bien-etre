<template>
  <section class="sektion">
    <div class="mb-6 text-center">
      <Icon name="ph:leaf-fill" class="mx-auto mb-4 text-6xl text-emerald-600 dark:text-emerald-400" />
      <h1 class="ptitle">{{ $t('techniques.leavesOnStream.name') }}</h1>
      <p class="mx-auto mb-2 max-w-2xl leading-relaxed text-gray-600 dark:text-slate-300">{{ $t('leaves.tool.intro') }}</p>
      <p class="mx-auto max-w-2xl text-sm text-gray-500 dark:text-slate-400">
        <Icon name="ph:lock-simple" class="mr-1 align-[-2px]" />{{ $t('leaves.tool.privacy') }}
      </p>
    </div>

    <div class="mx-auto max-w-4xl">
      <!-- Rivière -->
      <div
        class="river relative h-72 overflow-hidden border border-emerald-200 dark:border-emerald-800 sm:h-80"
        role="img"
        :aria-label="$t('leaves.tool.river')"
      >
        <div class="bank bank-top" />
        <div class="water">
          <div class="ripple r1" /><div class="ripple r2" /><div class="ripple r3" />
        </div>
        <div class="bank bank-bottom" />
        <div
          v-for="leaf in leaves"
          :key="leaf.id"
          class="leaf"
          :class="reducedMotion ? 'leaf-fade' : 'leaf-drift'"
          :style="{ top: leaf.top + '%', animationDuration: leaf.duration + 's' }"
          @animationend="removeLeaf(leaf.id)"
        >
          <svg viewBox="0 0 120 60" class="leaf-shape" aria-hidden="true">
            <path d="M4 30 C 30 2, 90 2, 116 30 C 90 58, 30 58, 4 30 Z" :fill="leaf.color" />
            <path d="M8 30 L 112 30" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" fill="none" />
          </svg>
          <span v-if="leaf.text" class="leaf-text">{{ leaf.text }}</span>
        </div>
      </div>
      <p v-if="reducedMotion" class="mt-2 text-xs text-gray-500 dark:text-slate-400">{{ $t('leaves.tool.reduced') }}</p>

      <!-- Saisie -->
      <form class="mt-4 flex flex-col gap-3 sm:flex-row" @submit.prevent="addLeaf(true)">
        <label for="thought-input" class="sr-only">{{ $t('leaves.tool.label') }}</label>
        <input
          id="thought-input"
          v-model="draft"
          type="text"
          maxlength="60"
          autocomplete="off"
          :placeholder="$t('leaves.tool.placeholder')"
          class="flex-1 border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        <button type="submit" class="bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50" :disabled="!draft.trim()">
          {{ $t('leaves.tool.add') }}
        </button>
        <button type="button" class="border border-emerald-600 px-4 py-2 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/30" @click="addLeaf(false)">
          {{ $t('leaves.tool.noWords') }}
        </button>
      </form>
      <p class="mt-2 text-sm text-gray-500 dark:text-slate-400" aria-live="polite">{{ $t('leaves.tool.count', { n: total }) }}</p>

      <!-- Consignes -->
      <ol class="mt-6 space-y-2 border border-gray-200 bg-white p-5 text-gray-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <li v-for="(step, i) in tm('leaves.tool.guide')" :key="i" class="flex gap-3">
          <span class="flex h-6 w-6 flex-shrink-0 items-center justify-center bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{{ i + 1 }}</span>
          <span>{{ rt(step) }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
// Les pensées ne sont jamais enregistrées : elles disparaissent avec les feuilles.
const { tm, rt } = useI18n()

const draft = ref('')
const leaves = ref([])
const total = ref(0)
const reducedMotion = ref(false)
let nextId = 1
const colors = ['#86efac', '#a3e635', '#fbbf24', '#fdba74', '#bef264']

function addLeaf(withText) {
  const text = withText ? draft.value.trim() : ''
  if (withText && !text) return
  leaves.value.push({
    id: nextId++,
    text,
    top: 22 + Math.random() * 40,
    duration: 16 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
  })
  total.value++
  draft.value = ''
}

function removeLeaf(id) {
  leaves.value = leaves.value.filter((l) => l.id !== id)
}

onMounted(() => {
  reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
})
</script>

<style scoped>
.river {
  background: #d1fae5;
}
.bank {
  position: absolute;
  left: 0;
  right: 0;
  height: 16%;
  background: linear-gradient(180deg, #65a30d, #4d7c0f);
  z-index: 1;
}
.bank-top {
  top: 0;
  border-bottom: 3px solid #a16207;
}
.bank-bottom {
  bottom: 0;
  border-top: 3px solid #a16207;
  background: linear-gradient(0deg, #65a30d, #4d7c0f);
}
.water {
  position: absolute;
  inset: 16% 0;
  background: linear-gradient(180deg, #38bdf8 0%, #0ea5e9 50%, #38bdf8 100%);
  overflow: hidden;
}
.ripple {
  position: absolute;
  width: 200%;
  height: 2px;
  left: -100%;
  background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.55) 0 40px, transparent 40px 110px);
  animation: flow 9s linear infinite;
}
.r1 { top: 22%; }
.r2 { top: 52%; animation-duration: 12s; opacity: 0.7; }
.r3 { top: 78%; animation-duration: 7s; opacity: 0.5; }
@keyframes flow {
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
}
.leaf {
  position: absolute;
  left: 0;
  z-index: 2;
  width: 150px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.leaf-shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
}
.leaf-text {
  position: relative;
  max-width: 120px;
  padding: 0 6px;
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  color: #1f2937;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.leaf-drift {
  animation-name: drift;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
@keyframes drift {
  0% { transform: translateX(-160px) translateY(0) rotate(-4deg); opacity: 0; }
  6% { opacity: 1; }
  25% { transform: translateX(22vw) translateY(8px) rotate(3deg); }
  50% { transform: translateX(45vw) translateY(-6px) rotate(-3deg); }
  75% { transform: translateX(68vw) translateY(6px) rotate(4deg); opacity: 1; }
  100% { transform: translateX(min(95vw, 1000px)) translateY(0) rotate(-2deg); opacity: 0; }
}
.leaf-fade {
  left: 50%;
  margin-left: -75px;
  animation-name: fade;
  animation-duration: 8s !important;
  animation-fill-mode: forwards;
}
@keyframes fade {
  0% { opacity: 0; }
  15% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ripple { animation: none; }
}
</style>
