<template>
  <LegalPage ns="privacy" />
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.privacy.title'),
  description: () => t('meta.privacy.description'),
})
</script>
