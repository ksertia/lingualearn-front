<template>
  <div class="admin-layout">

    <!-- ══════════════════════════════════════
         SIDEBAR — Premium dark, Linear-inspired
    ═══════════════════════════════════════ -->
    <aside class="admin-sidebar">

      <!-- Brand area -->
      <div class="sidebar-brand">
        <img src="assets/icons/tibi-logo-final.png" alt="TiBi" class="sidebar-logo" />
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">

        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item--active': isActive(item.path) }"
        >
          <!-- Left accent bar -->
          <span class="nav-accent"></span>

          <!-- Icon -->
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-for="(d, i) in item.icons"
              :key="i"
              :d="d"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
            />
          </svg>

          <!-- Label -->
          <span class="nav-label">{{ item.label }}</span>

          <!-- Unread badge -->
          <span
            v-if="item.path === '/admin/messages' && messageStore.unreadCount > 0"
            class="nav-badge"
          >
            {{ messageStore.unreadCount > 99 ? '99+' : messageStore.unreadCount }}
          </span>

        </NuxtLink>

      </nav>

    </aside>

    <!-- ══════════════════════════════════════
         MAIN CONTENT
    ═══════════════════════════════════════ -->
    <div class="admin-main">

      <!-- Header -->
      <header class="admin-header">
        <h1 class="header-title">{{ pageTitle }}</h1>

        <div class="header-right">
          <!-- Notifications -->
          <button class="header-icon-btn" title="Notifications" @click="navigateTo('/admin/notifications')">
            <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <!-- User menu — avatar only, nom déjà visible en sidebar -->
          <div class="relative">
            <button class="header-avatar-btn" @click="isDropdownOpen = !isDropdownOpen">
              <div class="header-avatar">
                <img
                  v-if="authStore.user?.profile?.avatarUrl"
                  :src="authStore.user.profile.avatarUrl"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ authStore.fullname?.charAt(0) }}</span>
              </div>
            </button>

            <Transition name="dropdown">
              <div v-if="isDropdownOpen" class="dropdown-panel">
                <div class="dropdown-header">
                  <p class="dropdown-user-name">{{ authStore.fullname }}</p>
                  <p class="dropdown-user-email">{{ authStore.user?.email }}</p>
                </div>
                <div class="dropdown-divider"></div>
                <NuxtLink to="/admin/profil" class="dropdown-item" @click="isDropdownOpen = false">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon Profil
                </NuxtLink>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item dropdown-item--danger" @click="authStore.logout()">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="admin-page">
        <slot />
      </main>
    </div>

    <div v-if="isDropdownOpen" class="fixed inset-0 z-40" @click="isDropdownOpen = false"></div>

  </div>
</template>

<script setup>
import { useMessageStore } from '~/stores/messageStore'

const authStore = useAuthStore()
const messageStore = useMessageStore()
const route = useRoute()
const isDropdownOpen = ref(false)

onMounted(() => {
  const userId = authStore.user?.id
  if (userId) messageStore.fetchUnreadCount()
})

const isActive = (path) => route.path.startsWith(path)

const pageTitles = {
  '/admin/dashboard': 'Tableau de bord',
  '/admin/users': 'Utilisateurs',
  '/admin/messages': 'Messages',
  '/admin/notifications': 'Notifications',
  '/admin/settings': 'Paramètres',
  '/admin/profil': 'Mon Profil',
}

const pageTitle = computed(() =>
  pageTitles[route.path] ||
  Object.entries(pageTitles).find(([k]) => route.path.startsWith(k))?.[1] ||
  'Administration'
)

const menuItems = [
  {
    label: 'Tableau de bord',
    path: '/admin/dashboard',
    icons: ['M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'],
  },
  {
    label: 'Utilisateurs',
    path: '/admin/users',
    icons: ['M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'],
  },
  {
    label: 'Messages',
    path: '/admin/messages',
    icons: ['M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
  },
  {
    label: 'Notifications',
    path: '/admin/notifications',
    icons: ['M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'],
  },
  {
    label: 'Paramètres',
    path: '/admin/settings',
    icons: [
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    ],
    separator: true,
  },
]
</script>

<style scoped>
/* ═══════════════════════════════════════════
   LAYOUT ROOT
═══════════════════════════════════════════ */
.admin-layout {
  height: 100vh;
  overflow: hidden;
  display: flex;
  background: #E9EAEE;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
.admin-sidebar {
  width: 230px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #EDEEF3;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  border-right: 1px solid #DFE0E6;
}

/* Brand */
.sidebar-brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 20px 18px;
  border-bottom: 1px solid #DFE0E6;
  flex-shrink: 0;
}

.sidebar-logo {
  height: 36px;
  width: auto;
  object-fit: contain;
  object-position: left;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  justify-content: space-evenly;
}

/* ── Nav item ───────────────────────── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 9px;
  text-decoration: none;
  color: #6B7280;
  font-size: 13.5px;
  font-weight: 500;
  position: relative;
  transition: background 0.12s ease, color 0.12s ease;
}

.nav-item:hover {
  background: #F3F4F6;
  color: #111827;
}

.nav-item--active {
  background: #166534 !important;
  color: #ffffff !important;
}

/* Left accent bar — hidden in light mode */
.nav-accent { display: none; }

.nav-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: opacity 0.12s ease;
}

/* Label */
.nav-label { flex: 1; line-height: 1; }

/* Unread badge */
.nav-badge {
  min-width: 16px;
  height: 16px;
  background: #ef4444;
  border-radius: 100px;
  font-size: 9px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}


/* ═══════════════════════════════════════════
   MAIN CONTENT
═══════════════════════════════════════════ */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* Header */
.admin-header {
  height: 52px;
  background: #F4F5F8;
  border-bottom: 1px solid #DFE0E6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  letter-spacing: -0.01em;
}

.header-icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: none;
  background: none;
  color: #BDBDBD;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.13s;
}

.header-icon-btn:hover {
  background: #F5F5F5;
  color: #6B7280;
}

/* Avatar-only trigger */
.header-avatar-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: 50%;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.13s;
}

.header-avatar-btn:hover { opacity: 0.8; }

.header-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #16A34A, #065F46);
  color: white;
  font-size: 10.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

/* Dropdown */
.dropdown-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.08),
    0 16px 40px rgba(0,0,0,0.08),
    0 0 0 1px rgba(17,24,39,0.04);
  padding: 4px;
  min-width: 200px;
  z-index: 50;
}

.dropdown-header {
  padding: 10px 12px 8px;
}

.dropdown-user-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.dropdown-user-email {
  font-size: 11.5px;
  color: #9CA3AF;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 450;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.1s;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
}

.dropdown-item:hover { background: #F9FAFB; }
.dropdown-item--danger { color: #EF4444; }
.dropdown-item--danger:hover { background: #FEF2F2; }

.dropdown-divider {
  height: 1px;
  background: #F3F4F6;
  margin: 3px 0;
}

/* Page content */
.admin-page { flex: 1; overflow-y: auto; }

/* Dropdown transition */
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.14s ease, transform 0.14s cubic-bezier(0.4,0,0.2,1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
