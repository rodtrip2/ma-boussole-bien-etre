<template>
  <Transition name="slide-up">
    <div
      v-if="state.visible && available"
      class="no-print fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white p-4 shadow-2xl dark:border-slate-600 dark:bg-slate-800"
      style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))"
      role="dialog"
      aria-labelledby="install-title"
    >
      <div class="mx-auto flex max-w-xl items-start gap-3">
        <img :src="asset('/apple-touch-icon.png')" alt="" class="h-12 w-12 flex-shrink-0 rounded-xl border border-gray-200" />
        <div class="flex-1">
          <p id="install-title" class="font-semibold text-gray-800 dark:text-slate-100">
            {{ state.canPrompt ? $t('install.title') : $t('install.iosTitle') }}
          </p>
          <p class="mt-0.5 text-sm text-gray-600 dark:text-slate-300">{{ $t('install.text') }}</p>

          <!-- iPhone / iPad : étapes -->
          <ol v-if="!state.canPrompt && state.isIos" class="mt-3 space-y-2 text-sm text-gray-700 dark:text-slate-200">
            <li v-for="(s, i) in tm('install.iosSteps')" :key="i" class="flex items-start gap-2">
              <span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-semibold text-pink-700">{{ i + 1 }}</span>
              <span class="flex-1">
                {{ rt(s) }}
                <Icon v-if="i === 0" name="ph:export" class="ml-1 align-[-3px] text-lg text-blue-600" />
                <Icon v-if="i === 1" name="ph:plus-square" class="ml-1 align-[-3px] text-lg text-gray-700 dark:text-slate-200" />
              </span>
            </li>
          </ol>
          <p v-if="!state.canPrompt && state.isIos" class="mt-2 text-xs text-gray-500 dark:text-slate-400">{{ $t('install.iosNote') }}</p>

          <div class="mt-3 flex gap-2">
            <button v-if="state.canPrompt" type="button" class="bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700" @click="install">
              {{ $t('install.install') }}
            </button>
            <button type="button" class="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-slate-300" @click="dismiss">
              {{ state.canPrompt ? $t('install.later') : $t('install.close') }}
            </button>
          </div>
        </div>
        <button type="button" class="p-1 text-gray-400 hover:text-gray-700" :aria-label="$t('install.close')" @click="dismiss">
          <Icon name="ph:x" class="text-xl" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { tm, rt } = useI18n()
const { state, detect, install, dismiss, available } = usePwaInstall()
onMounted(detect)
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
