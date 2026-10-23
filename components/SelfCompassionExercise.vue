<template>
  <section class="sektion">
    <div class="mb-6 text-center">
      <Icon name="ph:hand-heart-fill" class="mx-auto mb-4 text-6xl text-rose-500 dark:text-rose-400" />
      <h1 class="ptitle">{{ $t('techniques.selfCompassion.name') }}</h1>
      <p class="mx-auto max-w-2xl leading-relaxed text-gray-600 dark:text-slate-300">{{ $t('selfCompassion.tool.intro') }}</p>
    </div>

    <div class="mx-auto max-w-2xl border border-rose-200 bg-white p-6 dark:border-rose-800 dark:bg-slate-800 sm:p-8" aria-live="polite">
      <!-- Préparation -->
      <div v-if="step === 0" class="text-center">
        <p class="mb-6 leading-relaxed text-gray-700 dark:text-slate-200">{{ $t('selfCompassion.tool.prepare') }}</p>
        <button type="button" class="inline-flex items-center gap-2 bg-rose-600 px-6 py-3 text-lg font-medium text-white hover:bg-rose-700" @click="step = 1">
          <Icon name="ph:play-fill" /> {{ $t('selfCompassion.tool.start') }}
        </button>
      </div>

      <!-- Étapes 1 à 3 -->
      <div v-else-if="step <= 3">
        <div class="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
          <span>{{ $t('selfCompassion.tool.stepOf', { n: step }) }}</span>
          <span class="flex gap-1">
            <span v-for="i in 3" :key="i" class="h-1.5 w-8" :class="i <= step ? 'bg-rose-500' : 'bg-gray-200 dark:bg-slate-600'" />
          </span>
        </div>
        <div class="breath mx-auto mb-6" aria-hidden="true" />
        <h2 class="mb-3 text-center text-2xl font-semibold text-gray-800 dark:text-slate-100">{{ rt(current.title) }}</h2>
        <p class="mb-4 text-center leading-relaxed text-gray-700 dark:text-slate-300">{{ rt(current.text) }}</p>
        <p class="mb-6 border-l-4 border-rose-300 bg-rose-50 p-4 text-center italic text-gray-800 dark:border-rose-600 dark:bg-rose-900/20 dark:text-slate-100">
          {{ rt(current.phrase) }}
        </p>
        <p v-if="step === 3" class="mb-6 text-center text-sm text-gray-600 dark:text-slate-400">{{ $t('selfCompassion.tool.ownWords') }}</p>
        <div class="text-center">
          <button type="button" class="inline-flex items-center gap-2 bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700" @click="step++">
            {{ $t('selfCompassion.tool.next') }} <Icon name="ph:arrow-right" />
          </button>
        </div>
      </div>

      <!-- Fin -->
      <div v-else class="text-center">
        <Icon name="ph:heart" class="mx-auto mb-4 text-4xl text-rose-500" />
        <p class="mb-6 leading-relaxed text-gray-700 dark:text-slate-200">{{ $t('selfCompassion.tool.done') }}</p>
        <button type="button" class="inline-flex items-center gap-2 border border-rose-400 px-5 py-2 text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/30" @click="step = 0">
          <Icon name="ph:arrow-counter-clockwise" /> {{ $t('selfCompassion.tool.restart') }}
        </button>
      </div>
    </div>
    <p class="mt-3 text-center text-xs text-gray-500 dark:text-slate-400">{{ $t('selfCompassion.tool.credit') }}</p>
  </section>
</template>

<script setup>
const { tm, rt } = useI18n()
const step = ref(0)
const current = computed(() => tm('selfCompassion.tool.steps')[step.value - 1])
</script>

<style scoped>
/* Cercle qui respire doucement (6 secondes), pour accompagner la lecture */
.breath {
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  background: radial-gradient(circle, #fda4af 0%, #fecdd3 60%, transparent 70%);
  animation: breathe 6s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1.15); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .breath { animation: none; }
}
</style>
