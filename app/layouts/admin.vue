<template>
  <div class="min-h-screen flex" style="background-color: #F5F5F5; font-family: 'Inter', sans-serif;">

    <!-- ═══════════════════════════════════════════
         SIDEBAR — TiBi green, 256px, sticky full height
    ════════════════════════════════════════════════ -->
    <aside
      class="text-white flex flex-col flex-shrink-0 overflow-y-auto"
      style="width: 256px; background-color: #2D6A3E; position: sticky; top: 0; height: 100vh;"
    >
      <div class="p-6">
        <!-- Logo -->
        <div style="margin-bottom: 40px;">
          <img src="assets/icons/tibi-logo-final.png" alt="TiBi Logo" class="h-12 w-auto object-contain" />
        </div>

        <!-- Navigation -->
        <nav style="display: flex; flex-direction: column; gap: 8px;">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white"
            style="text-decoration: none;"
            :style="$route.path === item.path ? 'background-color: #245532;' : ''"
            :class="{ 'hover:bg-white/10': $route.path !== item.path }"
          >
            <svg
              class="h-5 w-5 flex-shrink-0"
              :class="{ 'opacity-80': $route.path !== item.path }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                v-for="(d, i) in item.icons"
                :key="i"
                :d="d"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
            <span class="font-medium text-sm">{{ item.label }}</span>
            <span
              v-if="item.path === '/admin/messages' && messageStore.unreadCount > 0"
              class="ml-auto flex items-center justify-center rounded-full text-[10px] font-black text-white px-1"
              style="min-width: 18px; height: 18px; background: #f43f5e;"
            >
              {{ messageStore.unreadCount > 99 ? '99+' : messageStore.unreadCount }}
            </span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- ═══════════════════════════════════════════
         MAIN CONTENT WRAPPER
    ════════════════════════════════════════════════ -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <!-- HEADER — white, 64px, border-bottom -->
      <header
        class="bg-white border-b border-gray-200 flex items-center justify-end px-8 gap-6 flex-shrink-0"
        style="height: 64px; position: relative;"
      >

        <!-- User info + avatar + profile dropdown -->
        <div class="flex items-center gap-2 relative">
          <span class="text-sm font-semibold text-gray-700">{{ authStore.fullname }}</span>
          <div
            class="flex items-center gap-1 cursor-pointer"
            @click="isDropdownOpen = !isDropdownOpen"
          >
            <div
              class="rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center"
              style="width: 32px; height: 32px;"
            >
              <img
                v-if="authStore.user?.profile?.avatarUrl"
                :src="authStore.user.profile.avatarUrl"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-xs font-bold text-gray-500">
                {{ authStore.fullname?.charAt(0) }}
              </span>
            </div>
            <svg class="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>

          <!-- Profile dropdown menu -->
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
              style="width: 192px;"
            >
              <NuxtLink
                to="/admin/profil"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                style="text-decoration: none;"
                @click="isDropdownOpen = false"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mon Profil
              </NuxtLink>
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                style="background: none; border: none; cursor: pointer; text-align: left;"
                @click="authStore.logout()"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          </Transition>
        </div>

        <!-- Notification bell + Search icons -->
        <div class="flex items-center gap-4 text-gray-400">
          <button
            class="p-1 hover:text-gray-600 transition-colors"
            style="background: none; border: none; cursor: pointer; color: inherit;"
            @click="navigateTo('/admin/notifications')"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button
            class="p-1 hover:text-gray-600 transition-colors"
            style="background: none; border: none; cursor: pointer; color: inherit;"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

      </header>

      <!-- Page slot -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>

    </div>

    <!-- Backdrop to close dropdown -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-40"
      @click="isDropdownOpen = false"
    ></div>

  </div>
</template>

<script setup>
import { useMessageStore } from '~/stores/messageStore'

const authStore = useAuthStore()
const messageStore = useMessageStore()
const isDropdownOpen = ref(false)

onMounted(() => {
  const userId = authStore.user?.id
  if (userId) messageStore.fetchUnreadCount()
})

const menuItems = [
  {
    label: 'Tableau de bord',
    path: '/admin/dashboard',
    icons: [
      'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    ],
  },
  {
    label: 'Utilisateurs',
    path: '/admin/users',
    icons: [
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    ],
  },
  {
    label: 'Messages',
    path: '/admin/messages',
    icons: [
      'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    ],
  },
  {
    label: 'Notifications',
    path: '/admin/notifications',
    icons: [
      'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    ],
  },
  {
    label: 'Paramètres',
    path: '/admin/settings',
    icons: [
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    ],
  },
]
</script>
