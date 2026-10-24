<template>
  <LegalPage ns="support" />
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.support.title'),
  description: () => t('meta.support.description'),
})
</script>
