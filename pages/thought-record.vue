<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-8 transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <Breadcrumb duration="10-15 min" />

      <ThoughtRecordExercise />

      <div class="no-print">

      <InfoHowItWorks
        i18n-key="thoughtRecord.howItWorks"
        :paragraphs="['description1', 'description2', 'description3']"
        :items="[
          { key: 'notice', icon: 'ph:eye' },
          { key: 'examine', icon: 'ph:magnifying-glass' },
          { key: 'rebalance', icon: 'ph:scales' }
        ]"
        :columns="3"
      />

      <InfoScienceBehind
        i18n-key="thoughtRecord.science"
        :research-items="[
          { key: 'carpenter', icon: 'ph:books' },
          { key: 'recent', icon: 'ph:calendar' }
        ]"
      />

      <InfoWhenAndWhat
        i18n-key="thoughtRecord"
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

      <InfoTips i18n-key="thoughtRecord.tips" :tips="['calm', 'honest', 'together']" />

      <RelatedTechniques current-technique-id="thought-record" />
      </div>
    </main>
  </div>
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.thoughtRecord.title'),
  description: () => t('meta.thoughtRecord.description'),
  ogTitle: () => t('meta.thoughtRecord.title'),
  ogDescription: () => t('meta.thoughtRecord.description'),
  ogType: 'website',
  ogSiteName: () => t('header.title'),
  twitterCard: 'summary_large_image',
})
</script>
