<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 py-8 transition-colors duration-300">
    <main id="main-content" tabindex="-1">
      <Breadcrumb duration="10-30 min" />

      <WorryTimeExercise />

      <div class="no-print">
        <InfoHowItWorks
          i18n-key="worryTime.howItWorks"
          :paragraphs="['description1', 'description2', 'description3']"
          :items="[
            { key: 'postpone', icon: 'ph:calendar-check' },
            { key: 'write', icon: 'ph:note-pencil' },
            { key: 'control', icon: 'ph:hand-palm' }
          ]"
          :columns="3"
        />

        <InfoScienceBehind
          i18n-key="worryTime.science"
          :research-items="[{ key: 'trial', icon: 'ph:users-three' }]"
        />

        <InfoWhenAndWhat
          i18n-key="worryTime"
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
              { icon: 'ph:clock', iconClass: 'text-green-500' },
              { icon: 'ph:hand-palm', iconClass: 'text-purple-400' },
              { icon: 'ph:sun', iconClass: 'text-yellow-500' }
            ]
          }"
        />

        <InfoTips i18n-key="worryTime.tips" :tips="['place', 'gentle', 'short']" />

        <RelatedTechniques current-technique-id="worry-time" />
      </div>
    </main>
  </div>
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.worryTime.title'),
  description: () => t('meta.worryTime.description'),
  ogTitle: () => t('meta.worryTime.title'),
  ogDescription: () => t('meta.worryTime.description'),
  ogType: 'website',
  ogSiteName: () => t('header.title'),
  twitterCard: 'summary_large_image',
})
</script>
