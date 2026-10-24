<template>
  <div class="mybg transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <div class="pt-20">
        <article class="sektion mx-auto max-w-3xl pb-8 !mb-0">
          <h1 class="mb-3 text-3xl font-bold text-gray-800 dark:text-slate-100 sm:text-4xl">{{ $t(`${ns}.title`) }}</h1>
          <p class="mb-4 text-sm text-gray-500 dark:text-slate-400">{{ $t('legalCommon.lastUpdated') }} {{ $t('legalCommon.date') }}</p>
          <p class="mb-8 text-lg leading-relaxed text-gray-700 dark:text-slate-300">{{ $t(`${ns}.intro`) }}</p>

          <nav class="mb-10 border border-gray-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800" :aria-label="$t('legalCommon.toc')">
            <p class="mb-2 font-semibold text-gray-800 dark:text-slate-100">{{ $t('legalCommon.toc') }}</p>
            <ol class="list-decimal space-y-1 pl-5 text-sm">
              <li v-for="(s, i) in sections" :key="i">
                <a :href="`#s${i + 1}`" class="text-blue-700 underline-offset-2 hover:underline dark:text-blue-300">{{ rt(s.title) }}</a>
              </li>
            </ol>
          </nav>

          <div class="space-y-10 text-gray-700 dark:text-slate-300">
            <div v-for="(s, i) in sections" :id="`s${i + 1}`" :key="i" class="scroll-mt-24">
              <h2 class="mb-3 text-2xl font-semibold text-gray-800 dark:text-slate-100">{{ rt(s.title) }}</h2>
              <p v-for="(p, j) in s.paragraphs || []" :key="'p' + j" class="mb-3 leading-relaxed">{{ rt(p) }}</p>
              <ul v-if="s.list" class="mb-3 list-disc space-y-1 pl-6">
                <li v-for="(it, j) in s.list" :key="'l' + j" class="leading-relaxed">{{ rt(it) }}</li>
              </ul>
              <p v-for="(p, j) in s.after || []" :key="'a' + j" class="mb-3 leading-relaxed">{{ rt(p) }}</p>
              <dl v-if="s.faq" class="space-y-4">
                <div v-for="(f, j) in s.faq" :key="'f' + j" class="border-l-4 border-blue-200 pl-4 dark:border-blue-700">
                  <dt class="font-semibold text-gray-800 dark:text-slate-100">{{ rt(f.q) }}</dt>
                  <dd class="mt-1 leading-relaxed">{{ rt(f.a) }}</dd>
                </div>
              </dl>
              <ul v-if="links(s).length" class="mt-2 space-y-2">
                <li v-for="(l, j) in links(s)" :key="'k' + j">
                  <a :href="rt(l.url)" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-300">
                    {{ rt(l.label) }} <Icon name="ph:arrow-square-out" aria-hidden="true" />
                  </a>
                </li>
              </ul>
              <NuxtLink v-if="s.help" :to="localePath('/resources')" class="mt-2 inline-flex items-center gap-2 bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                <Icon name="ph:lifebuoy" aria-hidden="true" /> {{ $t('legalCommon.seeResources') }}
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
const props = defineProps({ ns: { type: String, required: true } })
const { tm, rt } = useI18n()
const localePath = useLocalePath()
const sections = computed(() => tm(`${props.ns}.sections`))
const links = (s) => [...(s.link ? [s.link] : []), ...(s.links || [])]
</script>
