<template>
  <div class="lg:col-span-1">
    <nav
      class="space-y-1 rounded-lg bg-[#1a2849] p-4 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <!-- Vue d'ensemble -->
      <NuxtLink
        to="/admin/settings"
        class="block rounded-lg px-4 py-2 font-medium text-white transition-all hover:bg-cyan-500/20 hover:text-cyan-400"
        :class="{
          'bg-cyan-500/20 text-cyan-400': $route.path === '/admin/settings',
        }"
      >
        Vue d'ensemble
      </NuxtLink>

      <!-- Paramètres généraux -->
      <div class="pt-4 pb-2">
        <p class="px-4 text-xs font-semibold uppercase text-gray-500">
          Plateforme
        </p>
      </div>
      <NuxtLink
        to="/admin/settings/general"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/general',
        }"
      >
        Paramètres généraux
      </NuxtLink>

      <!-- Abonnements -->
      <div class="pt-4 pb-2">
        <p class="px-4 text-xs font-semibold uppercase text-gray-500">
          Business
        </p>
      </div>
      <NuxtLink
        to="/admin/settings/subscriptions"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/subscriptions',
        }"
      >
        Plans d'abonnement
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/access-control"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/access-control',
        }"
      >
        Contrôle d'accès
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/blocking"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/blocking',
        }"
      >
        Blocage/déblocage
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/monetization"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/monetization',
        }"
      >
        Monétisation avancée
      </NuxtLink>

      <!-- Communication -->
      <div class="pt-4 pb-2">
        <p class="px-4 text-xs font-semibold uppercase text-gray-500">
          Communication
        </p>
      </div>
      <NuxtLink
        to="/admin/settings/notifications"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/notifications',
        }"
      >
        Notifications
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/support"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/support',
        }"
      >
        Support & Communication
      </NuxtLink>

      <!-- Apprentissage -->
      <div class="pt-4 pb-2">
        <p class="px-4 text-xs font-semibold uppercase text-gray-500">
          Apprentissage
        </p>
      </div>
      <NuxtLink
        to="/admin/settings/quality"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/quality',
        }"
      >
        Qualité pédagogique
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/free-content"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/free-content',
        }"
      >
        Contenu gratuit
      </NuxtLink>

      <!-- Sécurité & Conformité -->
      <div class="pt-4 pb-2">
        <p class="px-4 text-xs font-semibold uppercase text-gray-500">
          Sécurité
        </p>
      </div>
      <NuxtLink
        to="/admin/settings/security"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/security',
        }"
      >
        Sécurité & Prévention
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/legal"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/legal',
        }"
      >
        Paramètres légaux
      </NuxtLink>

      <!-- Analytics & Monitoring -->
      <div class="pt-4 pb-2">
        <p class="px-4 text-xs font-semibold uppercase text-gray-500">Suivi</p>
      </div>
      <NuxtLink
        to="/admin/settings/analytics"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400 text-sm"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/analytics',
        }"
      >
        Statistiques & Analytics
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts"></script>
