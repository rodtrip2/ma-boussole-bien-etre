<template>
  <section>
    <div class="border border-gray-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 p-6 transition-colors duration-200">
      <SectionHeader icon="ph:flask" color="purple">
        {{ $t(`${i18nKey}.title`) }}
      </SectionHeader>

      <div class="mb-4 space-y-2">
        <p class="leading-relaxed text-gray-700 dark:text-slate-300" v-html="$t(`${i18nKey}.description`)"></p>
        <p v-if="$te(`${i18nKey}.bottomLine`)" class="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
          <strong class="mr-1">{{ $t('scienceLabels.bottomLine') }}</strong>{{ $t(`${i18nKey}.bottomLine`) }}
        </p>
      </div>

      <div class="grid gap-4" :class="researchItems.length === 2 ? 'md:grid-cols-2' : researchItems.length === 1 ? '' : 'md:grid-cols-3'">
        <article
          v-for="item in researchItems"
          :key="item.key"
          class="flex flex-col border border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 p-4 transition-colors duration-200"
        >
          <div class="mb-2 flex items-start">
            <Icon :name="item.icon" class="mr-2 mt-0.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
            <h3 class="text-sm font-semibold text-gray-800 dark:text-slate-100">
              {{ $t(`${key(item)}.title`) }}
            </h3>
          </div>

          <!-- Présentation structurée : Qui ? Quoi ? Résultat ? À noter -->
          <template v-if="$te(`${key(item)}.who`)">
            <span
              v-if="$te(`${key(item)}.type`)"
              class="mb-3 inline-block self-start bg-white px-2 py-0.5 text-[11px] font-medium text-purple-700 ring-1 ring-purple-200 dark:bg-slate-800 dark:text-purple-300 dark:ring-purple-700"
            >
              {{ $t(`${key(item)}.type`) }}
            </span>
            <dl class="space-y-1.5 text-xs leading-relaxed text-gray-700 dark:text-slate-300">
              <div v-for="field in fields" :key="field">
                <template v-if="$te(`${key(item)}.${field}`)">
                  <dt class="inline font-semibold text-gray-800 dark:text-slate-100">{{ $t(`scienceLabels.${field}`) }}</dt>
                  <dd class="ml-1 inline">{{ $t(`${key(item)}.${field}`) }}</dd>
                </template>
              </div>
            </dl>
            <a
              v-if="$te(`${key(item)}.url`)"
              :href="$t(`${key(item)}.url`)"
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="mt-3 inline-flex items-center gap-1 self-start text-xs font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300"
            >
              {{ $t('scienceLabels.readStudy') }} <Icon name="ph:arrow-square-out" />
            </a>
          </template>

          <!-- Ancien format (texte libre) -->
          <p v-else class="text-xs text-gray-600 dark:text-slate-300" v-html="$t(`${key(item)}.description`)"></p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  i18nKey: {
    type: String,
    required: true
  },
  researchItems: {
    type: Array,
    required: true
  }
});

const fields = ['who', 'what', 'result', 'caution'];
const key = (item) => `${props.i18nKey}.research.${item.key}`;
</script>
