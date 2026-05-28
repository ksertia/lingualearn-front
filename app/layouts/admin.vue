<template>
  <div class="admin-layout">

    <!-- ══ SIDEBAR ══════════════════════════════ -->
    <aside class="admin-sidebar">

      <!-- Brand -->
      <div class="sidebar-brand">
        <img src="assets/icons/tibi-logo-final.png" alt="TiBi" class="sidebar-logo" />
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">

        <NuxtLink to="/admin/dashboard" class="nav-item" :class="{'nav-item--active': starts('/admin/dashboard')}">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span class="nav-label">Tableau de bord</span>
        </NuxtLink>

        <div class="nav-group">
          <p class="nav-group-label">Gestion</p>

          <NuxtLink to="/admin/users" class="nav-item" :class="{'nav-item--active': starts('/admin/users')}">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="nav-label">Utilisateurs</span>
          </NuxtLink>

          <NuxtLink to="/admin/messages" class="nav-item" :class="{'nav-item--active': starts('/admin/messages')}">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="nav-label">Messages</span>
            <span v-if="messageStore.unreadCount > 0" class="nav-badge">
              {{ messageStore.unreadCount > 99 ? '99+' : messageStore.unreadCount }}
            </span>
          </NuxtLink>
        </div>

        <div class="nav-group">
          <p class="nav-group-label">Système</p>

          <NuxtLink to="/admin/notifications" class="nav-item" :class="{'nav-item--active': starts('/admin/notifications')}">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="nav-label">Notifications</span>
          </NuxtLink>

          <NuxtLink to="/admin/settings" class="nav-item" :class="{'nav-item--active': starts('/admin/settings')}">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span class="nav-label">Paramètres</span>
          </NuxtLink>
        </div>

      </nav>

      <!-- User footer -->
      <div class="sidebar-foot">
        <div class="sidebar-user">
          <div class="sidebar-avatar">
            <img v-if="authStore.user?.profile?.avatarUrl" :src="authStore.user.profile.avatarUrl" class="w-full h-full object-cover rounded-full" />
            <span v-else class="sidebar-initial">{{ authStore.fullname?.charAt(0) }}</span>
          </div>
          <div class="sidebar-user-meta">
            <p class="sidebar-user-name">{{ authStore.fullname }}</p>
            <p class="sidebar-user-role">Administrateur</p>
          </div>
          <div class="relative">
            <button class="sidebar-more" @click="isMenuOpen = !isMenuOpen" title="Options">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-[13px] h-[13px]">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01" />
              </svg>
            </button>
            <Transition name="pop">
              <div v-if="isMenuOpen" class="sidebar-menu">
                <NuxtLink to="/admin/profil" class="sidebar-menu-item" @click="isMenuOpen = false">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil
                </NuxtLink>
                <div class="sidebar-menu-sep"></div>
                <button class="sidebar-menu-item sidebar-menu-item--red" @click="authStore.logout()">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </aside>

    <!-- ══ MAIN ══════════════════════════════════ -->
    <div class="admin-main">

      <!-- Header -->
      <header class="admin-header">
        <div class="header-breadcrumb">
          <span class="bc-root">Administration</span>
          <svg class="bc-sep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
          <span class="bc-page">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <button class="header-btn" title="Notifications" @click="navigateTo('/admin/notifications')">
            <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="admin-page">
        <slot />
      </main>
    </div>

  </div>

  <div v-if="isMenuOpen" class="fixed inset-0 z-40" @click="isMenuOpen = false"></div>
</template>

<script setup>
import { useMessageStore } from '~/stores/messageStore'

const authStore = useAuthStore()
const messageStore = useMessageStore()
const route = useRoute()
const isMenuOpen = ref(false)

onMounted(() => {
  if (authStore.user?.id) messageStore.fetchUnreadCount()
})

const starts = (p) => route.path.startsWith(p)

const pageTitles = {
  '/admin/dashboard':     'Tableau de bord',
  '/admin/users':         'Utilisateurs',
  '/admin/messages':      'Messages',
  '/admin/notifications': 'Notifications',
  '/admin/settings':      'Paramètres',
  '/admin/profil':        'Mon Profil',
}

const pageTitle = computed(() =>
  pageTitles[route.path] ||
  Object.entries(pageTitles).find(([k]) => route.path.startsWith(k))?.[1] ||
  'Administration'
)
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
  display: flex;
  background: #F4F6F9;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* ── Sidebar ─────────────────────────── */
.admin-sidebar {
  width: 230px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #EDEEF3;
  height: 100vh;
  overflow: hidden;
  border-right: 1px solid #DFE0E6;
  position: sticky;
  top: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 52px;
  border-bottom: 1px solid #DFE0E6;
  flex-shrink: 0;
}

.sidebar-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  object-position: left;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-nav::-webkit-scrollbar { display: none; }

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid #DFE0E6;
}

.nav-group-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9CA3AF;
  padding: 3px 10px 5px;
  margin: 0;
}

/* Nav item */
.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #6B7280;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.12s ease, color 0.12s ease;
  white-space: nowrap;
}

.nav-item:hover {
  background: #E8E9EF;
  color: #111827;
}

.nav-item--active {
  background: #166534 !important;
  color: #ffffff !important;
}

.nav-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.nav-label { flex: 1; line-height: 1; }

.nav-badge {
  min-width: 16px; height: 16px;
  background: #EF4444;
  border-radius: 100px;
  font-size: 9px; font-weight: 700; color: white;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
}

/* User footer */
.sidebar-foot {
  padding: 10px;
  border-top: 1px solid #DFE0E6;
  flex-shrink: 0;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  transition: background 0.12s;
}

.sidebar-user:hover { background: #E8E9EF; }

.sidebar-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #16A34A, #065F46);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}

.sidebar-initial { font-size: 11px; font-weight: 700; color: white; }

.sidebar-user-meta { flex: 1; min-width: 0; }

.sidebar-user-name {
  font-size: 12px; font-weight: 600; color: #374151;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;
}

.sidebar-user-role { font-size: 10.5px; color: #9CA3AF; margin-top: 1px; }

.sidebar-more {
  width: 26px; height: 26px;
  border: none; background: none; color: #9CA3AF;
  border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; flex-shrink: 0;
}
.sidebar-more:hover { background: #DFE0E6; color: #374151; }

/* Popup menu */
.sidebar-menu {
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 4px;
  min-width: 160px;
  z-index: 50;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04);
}

.sidebar-menu-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; border-radius: 7px;
  font-size: 12.5px; font-weight: 450; color: #374151;
  cursor: pointer; transition: background 0.1s;
  width: 100%; border: none; background: none; text-align: left;
  text-decoration: none;
}
.sidebar-menu-item:hover { background: #F3F4F6; }
.sidebar-menu-item--red  { color: #EF4444; }
.sidebar-menu-item--red:hover { background: #FEF2F2; }

.sidebar-menu-sep { height: 1px; background: #F3F4F6; margin: 3px 0; }

/* ── Main ────────────────────────────── */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

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

.header-breadcrumb { display: flex; align-items: center; gap: 5px; }

.bc-root { font-size: 13px; font-weight: 400; color: #9CA3AF; }
.bc-sep  { width: 11px; height: 11px; color: #D1D5DB; flex-shrink: 0; }
.bc-page { font-size: 13px; font-weight: 600; color: #374151; }

.header-right { display: flex; align-items: center; gap: 4px; }

.header-btn {
  width: 30px; height: 30px;
  border-radius: 7px; border: none; background: none;
  color: #BDBDBD; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.13s;
}
.header-btn:hover { background: #EAECF0; color: #6B7280; }

.admin-page { flex: 1; overflow-y: auto; background: #F4F6F9; }

/* Menu transition */
.pop-enter-active, .pop-leave-active {
  transition: opacity 0.13s ease, transform 0.13s cubic-bezier(0.4,0,0.2,1);
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.97);
}
</style>

<style>
.admin-layout :focus-visible {
  outline: 2px solid #16A34A;
  outline-offset: 2px;
}
</style>
