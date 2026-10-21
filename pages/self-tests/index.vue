<template>
  <div class="mybg transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <div class="py-8 pt-20">
        <div class="sektion mx-auto max-w-5xl">
          <h1 class="ptitle">Questionnaires d’auto-évaluation</h1>
          <p class="mx-auto mb-8 max-w-3xl text-center text-lg text-gray-600 dark:text-slate-300">
            Des échelles reconnues et validées scientifiquement en français, pour faire le point sur votre humeur,
            votre anxiété, votre bien-être ou votre consommation d’alcool. Vos réponses ne sont ni enregistrées ni
            envoyées : elles s’effacent dès que vous quittez la page.
          </p>

          <div
            v-if="locale !== 'fr'"
            class="mb-8 border border-blue-200 bg-blue-50 p-4 text-gray-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-slate-300"
          >
            {{ $t('selfTests.onlyFrench') }}
          </div>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink
              v-for="a in assessments"
              :key="a.slug"
              :to="localePath(`/self-tests/${a.slug}`)"
              class="group flex flex-col border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-600 dark:bg-slate-800"
            >
              <div class="mb-3 flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center" :class="colors[a.color].bg">
                  <Icon :name="a.icon" class="text-2xl" :class="colors[a.color].text" />
                </span>
                <span class="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  {{ a.topic }}
                </span>
              </div>
              <h2 class="mb-2 text-lg font-semibold text-gray-800 group-hover:underline dark:text-slate-100">
                {{ a.title }}
              </h2>
              <p class="mb-4 flex-1 text-sm text-gray-600 dark:text-slate-300">{{ a.summary }}</p>
              <p class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
                <Icon name="ph:clock" /> {{ a.duration }} · {{ a.items.length }} questions
              </p>
            </NuxtLink>
          </div>

          <div class="mt-10 border-l-4 border-amber-500 bg-amber-50 p-6 dark:bg-amber-900/20">
            <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-slate-100">À savoir avant de commencer</h2>
            <ul class="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700 dark:text-slate-300">
              <li>Ces questionnaires aident à faire le point ; ils ne posent pas de diagnostic.</li>
              <li>Seul un professionnel de santé peut interpréter un résultat dans votre situation.</li>
              <li>
                Les textes sont ceux des versions françaises validées, reproduits sans modification ; leurs sources
                sont indiquées sur chaque page.
              </li>
            </ul>
          </div>

          <div class="mt-6">
            <CrisisNotice />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { assessments } from '~/data/assessments'

const { locale } = useI18n()
const localePath = useLocalePath()

const colors = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  gray: { bg: 'bg-gray-100 dark:bg-slate-700', text: 'text-gray-600 dark:text-slate-300' },
}

useSeoMeta({
  title: 'Questionnaires d’auto-évaluation',
  description: 'PHQ-9, GAD-7, WHO-5, AUDIT et échelle de Rosenberg : versions françaises validées, anonymes et gratuites.',
})
</script>
