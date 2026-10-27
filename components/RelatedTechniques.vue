<template>
  <section class="mbb-chrome py-12">
    <div class="text-center">
      <h2 class="mb-6 text-4xl font-semibold text-gray-800 dark:text-slate-100">{{ $t('relatedTechniques.title') }}</h2>
      <p class="mb-8 text-gray-600 dark:text-slate-300">
        {{ $t('relatedTechniques.description') }}
      </p>
    </div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="technique in relatedTechniques"
        :key="technique.id"
        :to="getLocalizedTechniqueRoute(technique)"
        class="group flex flex-col gap-3 border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 p-6 transition-colors duration-100 hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        <div class="flex items-center gap-3">
          <Icon :name="technique.icon" class="text-2xl" :class="technique.iconColor" />
          <p class="flex-1 font-semibold text-gray-800 dark:text-slate-100">
            {{ $t(`techniques.${technique.id}.name`) }}
          </p>
          <Icon name="ph:arrow-right" class="text-sm text-gray-500 dark:text-slate-400" />
        </div>
        <p class="text-sm text-gray-600 dark:text-slate-300">
          {{ $t(`techniques.${technique.id}.short_description`) }}
        </p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  currentTechniqueId: {
    type: String,
    required: true
  }
})

const localePath = useLocalePath()
const { getRelatedTechniques, getTechniqueRoute } = useTechniques()

const getLocalizedTechniqueRoute = (technique) => {
  return localePath(getTechniqueRoute(technique))
}

const relatedTechniques = computed(() => getRelatedTechniques(props.currentTechniqueId))
</script>