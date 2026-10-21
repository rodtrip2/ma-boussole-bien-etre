<script setup lang="ts">
defineProps({ error: { type: Object, default: null } });
</script>
<template>
  <div class="min-h-screen bg-white">
    <div class="sektion flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 flex items-center justify-center mb-6">
        <img :src="asset('/aat.svg')" alt="Ma boussole bien-être" class="w-16 h-16 opacity-50" />
      </div>
      
      <p class="text-6xl font-bold text-gray-400 mb-4">
        {{ error.statusCode }}
      </p>
      
      <h1 class="text-2xl font-semibold text-gray-800 mb-6">
        <template v-if="error.statusCode == 404">
          {{ $t("error.page-not-found") }}
        </template>
        <template v-else>
          {{ error.message }}
        </template>
      </h1>
      
      <p class="text-gray-600 mb-8 max-w-md">
        {{ $t("error.message") }} 
      </p>
      
      <button
        class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        @click="clearError({ redirect: '/' })"
      >
        <Icon name="ph:arrow-left-bold" />
        {{ $t("error.return") }}
      </button>
    </div>
  </div>
</template>
