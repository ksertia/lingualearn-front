<template>
  <header class="w-full bg-[#0B1220] text-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="flex items-center gap-3">
          <!-- <img :src="logo" alt="logo" width="28" height="28" class="h-7 w-7" /> -->
          <span class="text-xl font-semibold">LinguaLearn</span>
        </NuxtLink>
      </div>

      <nav class="hidden items-center gap-8 text-sm font-medium md:flex">
        <NuxtLink to="/" class="text-white/80 hover:text-white">Accueil</NuxtLink>
        <NuxtLink to="/about" class="text-white/80 hover:text-white">A propos</NuxtLink>
        <!-- <NuxtLink to="/blog" class="text-white/80 hover:text-white">Blog</NuxtLink> -->
        <NuxtLink to="/support" class="text-white/80 hover:text-white">Support</NuxtLink>
        <div class="flex items-center gap-2 text-white/80">
          <span class="cursor-default">Pages</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white/80">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </nav>

      <div class="flex items-center gap-4">
        <NuxtLink to="/signin" class="text-sm font-medium text-white/80 hover:text-white">Connexion</NuxtLink>
        <NuxtLink
          to="/signup"
          class="rounded-sm bg-[#2D5BFF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2D5BFF]/90"
        >
          Inscription
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// import logo from "~/assets/images/logo/logo-2.svg";
</script>
