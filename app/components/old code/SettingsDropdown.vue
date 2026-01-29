<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="p-2 text-gray-400 transition-all hover:text-cyan-400"
      :class="{ 'text-cyan-400': isOpen }"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        @click.outside="isOpen = false"
        class="absolute right-0 mt-3 w-72 max-h-[32rem] overflow-y-auto rounded-xl border border-gray-700/50 bg-gradient-to-b from-[#1a2849]/95 to-[#0B1220]/95 backdrop-blur-sm shadow-2xl z-50"
      >
        <nav class="space-y-0.5 p-2">
          <!-- Vue d'ensemble -->
          <NuxtLink
            to="/admin/settings"
            @click="isOpen = false"
            class="block px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300': $route.path === '/admin/settings',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings',
            }"
          >
            📊 Vue d'ensemble
          </NuxtLink>

          <!-- Divider -->
          <div
            class="h-px bg-gradient-to-r from-gray-700/0 via-gray-700/30 to-gray-700/0 my-2"
          ></div>

          <!-- PLATEFORME -->
          <div class="px-3 pt-2 pb-1">
            <p
              class="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Plateforme
            </p>
          </div>
          <NuxtLink
            to="/admin/settings/general"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/general',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/general',
            }"
          >
            ⚙️ Paramètres généraux
          </NuxtLink>

          <!-- BUSINESS -->
          <div class="px-3 pt-2 pb-1">
            <p
              class="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Business
            </p>
          </div>
          <NuxtLink
            to="/admin/settings/subscriptions"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/subscriptions',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/subscriptions',
            }"
          >
            💳 Plans d'abonnement
          </NuxtLink>
          <NuxtLink
            to="/admin/settings/access-control"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/access-control',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/access-control',
            }"
          >
            🔐 Contrôle d'accès
          </NuxtLink>
          <NuxtLink
            to="/admin/settings/blocking"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/blocking',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/blocking',
            }"
          >
            🔒 Blocage/Déblocage
          </NuxtLink>
          <NuxtLink
            to="/admin/settings/monetization"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/monetization',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/monetization',
            }"
          >
            💰 Monétisation
          </NuxtLink>

          <!-- COMMUNICATION -->
          <div class="px-3 pt-2 pb-1">
            <p
              class="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Communication
            </p>
          </div>
          <NuxtLink
            to="/admin/settings/notifications"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/notifications',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/notifications',
            }"
          >
            🔔 Notifications
          </NuxtLink>
          <NuxtLink
            to="/admin/settings/support"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/support',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/support',
            }"
          >
            💬 Support
          </NuxtLink>

          <!-- APPRENTISSAGE -->
          <div class="px-3 pt-2 pb-1">
            <p
              class="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Apprentissage
            </p>
          </div>
          <NuxtLink
            to="/admin/settings/quality"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/quality',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/quality',
            }"
          >
            📚 Qualité pédagogique
          </NuxtLink>
          <NuxtLink
            to="/admin/settings/free-content"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/free-content',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/free-content',
            }"
          >
            🎁 Contenu gratuit
          </NuxtLink>

          <!-- SÉCURITÉ -->
          <div class="px-3 pt-2 pb-1">
            <p
              class="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Sécurité
            </p>
          </div>
          <NuxtLink
            to="/admin/settings/security"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/security',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/security',
            }"
          >
            ⚔️ Sécurité & Prévention
          </NuxtLink>
          <NuxtLink
            to="/admin/settings/legal"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/legal',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/legal',
            }"
          >
            ⚖️ Paramètres légaux
          </NuxtLink>

          <!-- SUIVI -->
          <div class="px-3 pt-2 pb-1">
            <p
              class="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Suivi
            </p>
          </div>
          <NuxtLink
            to="/admin/settings/analytics"
            @click="isOpen = false"
            class="block px-3 py-1.5 rounded text-xs font-medium text-gray-400 transition-all"
            :class="{
              'bg-cyan-500/15 text-cyan-300':
                $route.path === '/admin/settings/analytics',
              'hover:bg-gray-700/30 hover:text-gray-200':
                $route.path !== '/admin/settings/analytics',
            }"
          >
            📊 Analytics
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const isOpen = ref(false);
const $route = useRoute();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
