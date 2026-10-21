<template>
  <div
    role="alert"
    class="border-l-4 border-red-600 bg-red-50 p-5 text-gray-800 dark:border-red-500 dark:bg-red-900/20 dark:text-slate-100"
  >
    <p class="mb-2 flex items-center gap-2 text-lg font-semibold">
      <Icon name="ph:heart-fill" class="text-red-600 dark:text-red-400" />
      <span>{{ strong ? 'Vous n’êtes pas seul(e)' : 'Besoin d’aide maintenant ?' }}</span>
    </p>
    <p v-if="strong" class="mb-3 leading-relaxed">
      Vous avez indiqué avoir pensé qu’il vaudrait mieux mourir ou envisagé de vous faire du mal. Ces pensées
      méritent d’être entendues : parlez-en dès que possible à un professionnel de santé ou à une personne de
      confiance.
    </p>
    <ul class="space-y-1 leading-relaxed">
      <li>
        <a href="tel:3114" class="font-semibold text-red-700 underline dark:text-red-300">3114</a>
        : numéro national de prévention du suicide, gratuit, 24 h/24 et 7 j/7.
      </li>
      <li>
        <a href="tel:15" class="font-semibold text-red-700 underline dark:text-red-300">15</a> (SAMU) ou
        <a href="tel:112" class="font-semibold text-red-700 underline dark:text-red-300">112</a>
        : en cas de danger immédiat.
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  // true : message renforcé (réponse à la question 9 du PHQ-9)
  strong: { type: Boolean, default: false },
})
</script>
