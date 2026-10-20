<template>
  <a 
    href="#main-content" 
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    @click="skipToMain"
  >
    {{ $t('navigation.skipToMain') }}
  </a>
  <header class="relative py-2 border-b border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 transition-colors duration-300">
    <div class="sektion !my-0 flex items-center justify-between">
      <NuxtLink :to="localePath('/')" class="flex items-center justify-center hover:opacity-80 transition-opacity duration-100">
        <div class="w-10 h-10 flex items-center justify-center mr-3 text-gray-800 dark:text-white">
          <AATLogo />
        </div>
        <div class="flex flex-col items-start justify-start">
          <p class="text-lg font-semibold text-gray-800 dark:text-slate-100">{{ $t('header.title') }}</p>
          <div class="text-xs text-gray-500 dark:text-slate-400 -mt-1">{{ $t('header.subtitle') }}</div>
        </div>
      </NuxtLink>
      
      <div class="flex items-center space-x-4">
        <nav class="hidden md:flex items-center space-x-4">
          <NuxtLink :to="localePath('/') + '#techniques'" class="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 hover:underline transition-colors duration-200">{{ $t('navigation.techniques') }}</NuxtLink>
          <NuxtLink :to="localePath('/') + '#about'" class="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 hover:underline transition-colors duration-200">{{ $t('navigation.about') }}</NuxtLink>
          <NuxtLink :to="localePath('/') + '#resources'" class="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 hover:underline transition-colors duration-200">{{ $t('navigation.resources') }}</NuxtLink>
        </nav>
        
        
        <a 
          href="https://github.com/rodtrip2/anxiety-aid-tools" 
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="flex items-center text-sm px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          <Icon name="mdi:github" class="text-base mr-1" />
          {{ $t('navigation.github') }}
        </a>
        
        <button 
          class="md:hidden flex items-center justify-center" 
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="mobileMenuOpen ? $t('navigation.closeMobileMenu') : $t('navigation.openMobileMenu')"
        >
          <Icon name="ph:list" class="text-2xl text-gray-700 dark:text-slate-300" />
        </button>
      </div>
    </div>
    
    <div v-if="mobileMenuOpen" id="mobile-menu" class="absolute top-full left-0 right-0 md:hidden border-t border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 z-50 shadow-lg transition-colors duration-300">
      <nav class="sektion !my-0 py-4 flex flex-col space-y-1" role="navigation" :aria-label="$t('navigation.mobileMenuLabel')">
        <NuxtLink :to="localePath('/') + '#techniques'" class="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 hover:underline py-3 px-2 -mx-2 rounded transition-colors duration-200">{{ $t('navigation.techniques') }}</NuxtLink>
        <NuxtLink :to="localePath('/') + '#about'" class="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 hover:underline py-3 px-2 -mx-2 rounded transition-colors duration-200">{{ $t('navigation.about') }}</NuxtLink>
        <NuxtLink :to="localePath('/') + '#resources'" class="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 hover:underline py-3 px-2 -mx-2 rounded transition-colors duration-200">{{ $t('navigation.resources') }}</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
const localePath = useLocalePath()
const mobileMenuOpen = ref(false)

const skipToMain = () => {
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.focus()
    mainContent.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>