<template>
  <div class="mybg transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <div class="py-8 pt-20">
        <article class="sektion mx-auto max-w-3xl">
          <h1 class="ptitle">{{ $t('understanding.title') }}</h1>
          <p class="mx-auto mb-8 max-w-2xl text-center text-lg text-gray-600 dark:text-slate-300">{{ $t('understanding.intro') }}</p>

          <!-- Sommaire -->
          <nav class="mb-10 border border-gray-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800" :aria-label="$t('understanding.title')">
            <ol class="grid gap-1 text-sm sm:grid-cols-2">
              <li v-for="(s, i) in sections" :key="s.id">
                <a :href="`#${rt(s.id)}`" class="text-blue-700 hover:underline dark:text-blue-300">{{ i + 1 }}. {{ rt(s.title) }}</a>
              </li>
            </ol>
          </nav>

          <section v-for="(s, i) in sections" :id="rt(s.id)" :key="s.id" class="mb-10 scroll-mt-20">
            <h2 class="mb-3 flex items-center gap-2 text-2xl font-semibold text-gray-800 dark:text-slate-100">
              <Icon :name="rt(s.icon)" class="text-blue-600 dark:text-blue-400" /> {{ rt(s.title) }}
            </h2>
            <p v-for="(p, j) in s.paragraphs" :key="j" class="mb-3 leading-relaxed text-gray-700 dark:text-slate-300">{{ rt(p) }}</p>

            <ul v-if="s.list" class="mb-3 list-disc space-y-1 pl-6 text-gray-700 dark:text-slate-300">
              <li v-for="(l, j) in s.list" :key="j">{{ rt(l) }}</li>
            </ul>

            <!-- Schéma du cercle vicieux -->
            <div v-if="s.circle" class="my-6">
              <svg viewBox="0 0 400 300" class="mx-auto w-full max-w-md" role="img" :aria-label="s.circle.map((c) => rt(c)).join(' → ')">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" class="fill-blue-500" />
                  </marker>
                </defs>
                <path d="M 245 70 Q 330 100 300 190" class="stroke-blue-400" stroke-width="3" fill="none" marker-end="url(#arrow)" />
                <path d="M 250 245 Q 200 280 150 245" class="stroke-blue-400" stroke-width="3" fill="none" marker-end="url(#arrow)" />
                <path d="M 100 190 Q 70 100 155 70" class="stroke-blue-400" stroke-width="3" fill="none" marker-end="url(#arrow)" />
                <g v-for="(node, k) in circleNodes" :key="k">
                  <rect :x="node.x - 80" :y="node.y - 28" width="160" height="56" rx="10" class="fill-blue-50 stroke-blue-300 dark:fill-slate-800 dark:stroke-blue-500" stroke-width="2" />
                  <foreignObject :x="node.x - 76" :y="node.y - 26" width="152" height="52">
                    <div xmlns="http://www.w3.org/1999/xhtml" class="flex h-full items-center justify-center text-center text-[13px] font-medium leading-tight text-gray-800 dark:text-slate-100">
                      {{ rt(s.circle[k]) }}
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>

            <p v-if="s.warning" class="mt-3 border-l-4 border-red-500 bg-red-50 p-4 text-sm text-gray-800 dark:bg-red-900/20 dark:text-slate-100">
              <Icon name="ph:warning" class="mr-1 align-[-2px] text-red-600" />{{ rt(s.warning) }}
            </p>

            <!-- Outils liés -->
            <div v-if="rt(s.id) === 'help'" class="mt-4">
              <h3 class="mb-2 font-semibold text-gray-800 dark:text-slate-100">{{ $t('understanding.toolsTitle') }}</h3>
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="tool in tools"
                  :key="tool.path"
                  :to="localePath(tool.path)"
                  class="inline-flex items-center gap-1 border border-blue-200 bg-white px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:bg-slate-800 dark:text-blue-300"
                >
                  <Icon :name="tool.icon" /> {{ $t(`techniques.${tool.id}.name`) }}
                </NuxtLink>
              </div>
            </div>
            <div v-if="rt(s.id) === 'when'" class="mt-4">
              <NuxtLink :to="localePath('/resources')" class="inline-flex items-center gap-2 bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
                <Icon name="ph:lifebuoy" /> {{ $t('understanding.helpCta') }}
              </NuxtLink>
            </div>
          </section>

          <p class="border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-slate-700 dark:text-slate-400">
            {{ $t('understanding.source') }}
            <a href="https://www.psycom.org/wp-content/uploads/2024/04/PSYCOM_Brochures-A5_TP_Troubles-anxieux-et-phobiques_WEB.pdf" target="_blank" rel="noopener noreferrer" class="underline">psycom.org</a>
          </p>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const sections = computed(() => tm('understanding.sections'))
const circleNodes = [
  { x: 200, y: 50 },
  { x: 300, y: 220 },
  { x: 100, y: 220 },
]
const tools = [
  { path: '/guided-breathing', id: 'guidedBreathing', icon: 'ph:timer-fill' },
  { path: '/grounding', id: 'grounding', icon: 'ph:anchor-simple-fill' },
  { path: '/progressive-muscle-relaxation', id: 'progressiveMuscleRelaxation', icon: 'ph:person-arms-spread-fill' },
  { path: '/leaves-on-stream', id: 'leavesOnStream', icon: 'ph:leaf-fill' },
  { path: '/worry-time', id: 'worryTime', icon: 'ph:hourglass-medium-fill' },
  { path: '/self-compassion', id: 'selfCompassion', icon: 'ph:hand-heart-fill' },
]

useSeoMeta({
  title: () => t('understanding.metaTitle'),
  description: () => t('understanding.metaDescription'),
})
</script>
