<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="rounded-lg border border-gray-700 p-2 text-gray-400 transition-all hover:bg-gray-800"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      @click.outside="isOpen = false"
      class="absolute right-0 mt-2 w-56 rounded-lg border border-gray-700 bg-[#1a2849] shadow-lg z-50"
    >
      <nav class="space-y-2 p-4">
        <NuxtLink
          to="/admin/settings"
          class="block rounded-lg px-4 py-2 font-medium text-gray-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const isOpen = ref(false);
const $route = useRoute();
</script>
