<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-8 transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <Breadcrumb duration="3-5 min" />

      <SelfCompassionExercise />

      <InfoHowItWorks
        i18n-key="selfCompassion.howItWorks"
        :paragraphs="['description1', 'description2', 'description3']"
        :items="[
          { key: 'mindfulness', icon: 'ph:eye' },
          { key: 'humanity', icon: 'ph:users-three' },
          { key: 'kindness', icon: 'ph:hand-heart' }
        ]"
        :columns="3"
      />

      <InfoScienceBehind
        i18n-key="selfCompassion.science"
        :research-items="[
          { key: 'meta', icon: 'ph:books' }
        ]"
      />

      <InfoWhenAndWhat
        i18n-key="selfCompassion"
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

      <InfoTips i18n-key="selfCompassion.tips" :tips="['start', 'emotion', 'words']" />

      <RelatedTechniques current-technique-id="self-compassion" />
    </main>
  </div>
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.selfCompassion.title'),
  description: () => t('meta.selfCompassion.description'),
  ogTitle: () => t('meta.selfCompassion.title'),
  ogDescription: () => t('meta.selfCompassion.description'),
  ogType: 'website',
  ogSiteName: () => t('header.title'),
  twitterCard: 'summary_large_image',
})
</script>
