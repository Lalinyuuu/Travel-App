<template>
  <div class="min-h-screen bg-(--color-background) transition-colors duration-300">
    <NavBar />
    
    <main class="py-12 pb-20">
      <div class="container">
        <section class="text-center mb-16 p-16 px-8 bg-cover bg-center bg-no-repeat rounded-2xl relative overflow-hidden min-h-[300px] flex items-center justify-center" style="background-image: url('/images/hero/landing-world.avif');">
          <div class="absolute inset-0 bg-black/40 rounded-2xl z-0"></div>
          <div class="max-w-3xl mx-auto relative z-10 bg-transparent p-0 rounded-none backdrop-filter-none">
            <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">{{ $t('about.heroTitle') }}</h1>
            <p class="text-xl text-white leading-relaxed drop-shadow-sm">{{ $t('about.heroSubtitle') }}</p>
          </div>
        </section>

        <section class="flex flex-col gap-8 mb-16">
          <div class="bg-(--color-card-bg) rounded-2xl p-10 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div class="text-primary mb-6 flex items-center justify-center transition-colors duration-300">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-(--color-text) mb-4 text-center transition-colors duration-300">{{ $t('about.aboutUs.title') }}</h2>
            <p class="text-base text-(--color-text-secondary) leading-relaxed mb-4 transition-colors duration-300">
              {{ $t('about.aboutUs.text1') }}
            </p>
            <p class="text-base text-(--color-text-secondary) leading-relaxed transition-colors duration-300">
              {{ $t('about.aboutUs.text2') }}
            </p>
          </div>

          <div class="bg-(--color-card-bg) rounded-2xl p-10 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div class="text-primary mb-6 flex items-center justify-center transition-colors duration-300">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-(--color-text) mb-4 text-center transition-colors duration-300">{{ $t('about.features.title') }}</h2>
            <ul class="list-none p-0 m-0">
              <li class="text-base text-(--color-text-secondary) leading-relaxed mb-4 pl-6 relative transition-colors duration-300 last:mb-0">
                <span class="absolute left-0 text-primary font-bold text-xl transition-colors duration-300">✓</span>
                <span>{{ $t('about.features.searchTrips') }}</span>
              </li>
              <li class="text-base text-(--color-text-secondary) leading-relaxed mb-4 pl-6 relative transition-colors duration-300 last:mb-0">
                <span class="absolute left-0 text-primary font-bold text-xl transition-colors duration-300">✓</span>
                <span>{{ $t('about.features.shareTrips') }}</span>
              </li>
              <li class="text-base text-(--color-text-secondary) leading-relaxed mb-4 pl-6 relative transition-colors duration-300 last:mb-0">
                <span class="absolute left-0 text-primary font-bold text-xl transition-colors duration-300">✓</span>
                <span>{{ $t('about.features.categorize') }}</span>
              </li>
              <li class="text-base text-(--color-text-secondary) leading-relaxed mb-4 pl-6 relative transition-colors duration-300 last:mb-0">
                <span class="absolute left-0 text-primary font-bold text-xl transition-colors duration-300">✓</span>
                <span>{{ $t('about.features.viewDetails') }}</span>
              </li>
            </ul>
          </div>

          <div class="bg-(--color-card-bg) rounded-2xl p-10 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div class="text-primary mb-6 flex items-center justify-center transition-colors duration-300">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-(--color-text) mb-4 text-center transition-colors duration-300">{{ $t('about.contact.title') }}</h2>
            <p class="text-base text-(--color-text-secondary) leading-relaxed mb-6 transition-colors duration-300">
              {{ $t('about.contact.text') }}
            </p>
            <div class="mt-6">
              <p class="mb-3 text-base text-(--color-text-secondary) transition-colors duration-300 last:mb-0">
                <strong class="text-(--color-text) font-semibold transition-colors duration-300">{{ $t('about.contact.email') }}</strong> contact@travelexplorer.com
              </p>
              <p class="mb-3 text-base text-(--color-text-secondary) transition-colors duration-300 last:mb-0">
                <strong class="text-(--color-text) font-semibold transition-colors duration-300">{{ $t('about.contact.phone') }}</strong> 02-XXX-XXXX
              </p>
            </div>
          </div>
        </section>

        <section class="mt-16">
          <div class="bg-linear-to-br from-primary to-secondary rounded-2xl p-12 text-center text-white transition-all duration-300">
            <h2 class="text-4xl font-bold text-white mb-4">{{ $t('about.cta.title') }}</h2>
            <p class="text-lg mb-8 opacity-95">{{ $t('about.cta.text') }}</p>
            <div class="flex gap-4 justify-center flex-wrap">
              <router-link to="/trips" class="btn min-w-[180px] bg-white text-primary dark:text-primary transition-all duration-300 hover:bg-gray-1">{{ $t('about.cta.viewAllTrips') }}</router-link>
              <router-link to="/register" class="btn min-w-[180px] bg-white text-secondary transition-all duration-300 hover:bg-gray-1">{{ $t('about.cta.register') }}</router-link>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
</script>
