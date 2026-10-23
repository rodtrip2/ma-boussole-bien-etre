<template>
  <div class="mybg transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <div class="py-8 pt-20">
        <div class="sektion mx-auto max-w-4xl">
          <h1 class="ptitle">{{ L.title }}</h1>
          <p class="mx-auto mb-8 max-w-3xl text-center text-lg text-gray-600 dark:text-slate-300">{{ L.intro }}</p>

          <div class="space-y-8">
            <section v-for="s in helpSections" :key="s.id" :aria-labelledby="`h-${s.id}`">
              <h2 :id="`h-${s.id}`" class="mb-2 flex items-center gap-2 text-2xl font-semibold text-gray-800 dark:text-slate-100">
                <Icon :name="s.icon" :class="tones[s.tone].icon" /> {{ s.title[lang] }}
              </h2>
              <p class="mb-4 text-gray-600 dark:text-slate-300">{{ s.intro[lang] }}</p>
              <div class="grid gap-4 md:grid-cols-2">
                <article
                  v-for="item in s.items"
                  :key="item.name.fr"
                  class="border p-5 transition-colors duration-200"
                  :class="tones[s.tone].card"
                >
                  <h3 class="mb-1 font-semibold text-gray-800 dark:text-slate-100">{{ item.name[lang] }}</h3>
                  <a
                    v-if="item.phone"
                    :href="`tel:${item.phone.replace(/\s/g, '')}`"
                    class="mb-1 inline-flex items-center gap-2 text-2xl font-bold"
                    :class="tones[s.tone].phone"
                  >
                    <Icon name="ph:phone-fill" class="text-xl" /> {{ item.phone }}
                  </a>
                  <p v-if="item.hours" class="mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">{{ item.hours[lang] }}</p>
                  <p class="text-sm leading-relaxed text-gray-700 dark:text-slate-300">{{ item.description[lang] }}</p>
                  <a
                    v-if="item.url"
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-2 inline-flex items-center gap-1 text-sm text-blue-700 underline dark:text-blue-300"
                  >
                    {{ L.website }} <Icon name="ph:arrow-square-out" />
                  </a>
                </article>
              </div>
            </section>
          </div>

          <p class="mt-10 text-center text-xs text-gray-500 dark:text-slate-400">{{ L.verified }} {{ VERIFIED[lang] }}.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { helpSections, VERIFIED } from '~/data/helpResources'

const { locale } = useI18n()
const lang = computed(() => (locale.value === 'fr' ? 'fr' : 'en'))

const TEXT = {
  fr: {
    title: 'Trouver de l’aide en France',
    intro: 'Vous n’avez pas à traverser cela seul. Voici où appeler, parler ou consulter, selon votre situation.',
    website: 'Site internet',
    verified: 'Numéros et horaires vérifiés en',
    metaTitle: 'Trouver de l’aide en France - numéros d’urgence et d’écoute',
    metaDescription: '3114, SOS Amitié, Fil Santé Jeunes, Mon soutien psy, CMP : les numéros et services pour trouver de l’aide en santé mentale en France.',
  },
  en: {
    title: 'Getting help in France',
    intro: 'You don’t have to go through this alone. Here is where to call, talk or get care, depending on your situation.',
    website: 'Website',
    verified: 'Numbers and hours checked in',
    metaTitle: 'Getting help in France - emergency and helpline numbers',
    metaDescription: '3114, SOS Amitié, Fil Santé Jeunes, Mon soutien psy, CMP: numbers and services to get mental health support in France.',
  },
}
const L = computed(() => TEXT[lang.value])

const tones = {
  red: { icon: 'text-red-600 dark:text-red-400', card: 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20', phone: 'text-red-700 dark:text-red-300' },
  blue: { icon: 'text-blue-600 dark:text-blue-400', card: 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20', phone: 'text-blue-700 dark:text-blue-300' },
  green: { icon: 'text-green-600 dark:text-green-400', card: 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20', phone: 'text-green-700 dark:text-green-300' },
  gray: { icon: 'text-gray-600 dark:text-slate-300', card: 'border-gray-200 bg-white dark:border-slate-600 dark:bg-slate-800', phone: 'text-gray-800 dark:text-slate-100' },
}

useSeoMeta({
  title: () => L.value.metaTitle,
  description: () => L.value.metaDescription,
})
</script>
