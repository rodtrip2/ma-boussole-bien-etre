<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-8 transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <Breadcrumb duration="3-5 min" />

      <LeavesOnStreamExercise />

      <InfoHowItWorks
        i18n-key="leaves.howItWorks"
        :paragraphs="['description1', 'description2', 'description3']"
        :items="[
          { key: 'observe', icon: 'ph:eye' },
          { key: 'release', icon: 'ph:leaf' },
          { key: 'return', icon: 'ph:arrow-u-up-left' }
        ]"
        :columns="3"
      />

      <InfoScienceBehind
        i18n-key="leaves.science"
        :research-items="[
          { key: 'act', icon: 'ph:books' },
          { key: 'defusion', icon: 'ph:flask' }
        ]"
      />

      <InfoWhenAndWhat
        i18n-key="leaves"
        :when-section="{
          icon: 'ph:calendar-check',
          color: 'blue',
          items: [
            { icon: 'ph:arrows-clockwise', iconClass: 'text-amber-500' },
            { icon: 'ph:brain', iconClass: 'text-indigo-400' },
            { icon: 'ph:moon-stars', iconClass: 'text-indigo-500' },
            { icon: 'ph:calendar-plus', iconClass: 'text-emerald-500' }
          ]
        }"
        :what-section="{
          icon: 'ph:trend-up',
          color: 'green',
          items: [
            { icon: 'ph:feather', iconClass: 'text-blue-400' },
            { icon: 'ph:arrows-out', iconClass: 'text-green-500' },
            { icon: 'ph:hand-palm', iconClass: 'text-purple-400' },
            { icon: 'ph:sun', iconClass: 'text-yellow-500' }
          ]
        }"
      />

      <InfoTips i18n-key="leaves.tips" :tips="['gentle', 'all', 'short']" />

      <RelatedTechniques current-technique-id="leaves-on-stream" />
    </main>
  </div>
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.leavesOnStream.title'),
  description: () => t('meta.leavesOnStream.description'),
  ogTitle: () => t('meta.leavesOnStream.title'),
  ogDescription: () => t('meta.leavesOnStream.description'),
  ogType: 'website',
  ogSiteName: () => t('header.title'),
  twitterCard: 'summary_large_image',
})
</script>
