<template>
  <div class="lg:col-span-1">
    <nav class="space-y-2 rounded-lg bg-[#1a2849] p-4 sticky top-24">
      <NuxtLink
        to="/admin/settings"
        class="block rounded-lg px-4 py-2 font-medium text-white transition-all hover:bg-cyan-500/20 hover:text-cyan-400"
        :class="{
          'bg-cyan-500/20 text-cyan-400': $route.path === '/admin/settings',
        }"
      >
        Vue d'ensemble
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/subscriptions"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/subscriptions',
        }"
      >
        Plans d'abonnement
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/notifications"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/notifications',
        }"
      >
        Notifications auto.
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/inactive-accounts"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/inactive-accounts',
        }"
      >
        Comptes inactifs
      </NuxtLink>
      <NuxtLink
        to="/admin/settings/global"
        class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400"
        :class="{
          'bg-cyan-500/20 text-cyan-400':
            $route.path === '/admin/settings/global',
        }"
      >
        Paramètres globaux
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts"></script>

