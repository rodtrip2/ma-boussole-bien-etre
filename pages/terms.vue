<template>
  <LegalPage ns="terms" />
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.terms.title'),
  description: () => t('meta.terms.description'),
})
</script>
