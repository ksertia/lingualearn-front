<template>
  <div class="g-root">

    <!-- ══ SIDEBAR ══════════════════════════════ -->
    <aside class="g-sidebar">

      <!-- Brand -->
      <div class="g-brand">
        <img src="assets/icons/tibi-logo-final.png" alt="TiBi" class="g-logo" />
      </div>

      <!-- Nav -->
      <nav class="g-nav">

        <NuxtLink to="/gestionnaire/dashboard" class="g-item" :class="{'g-item--on': exact('/gestionnaire/dashboard')}">
          <svg class="g-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span class="g-txt">Dashboard</span>
        </NuxtLink>

        <div class="g-group">
          <p class="g-group-label">Contenu</p>

          <NuxtLink to="/gestionnaire" class="g-item" :class="{'g-item--on': exact('/gestionnaire')}">
            <svg class="g-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="g-txt">Langues</span>
          </NuxtLink>

          <NuxtLink to="/gestionnaire/discovery" class="g-item" :class="{'g-item--on': starts('/gestionnaire/discovery')}">
            <svg class="g-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
            </svg>
            <span class="g-txt">Découverte</span>
          </NuxtLink>

          <NuxtLink to="/gestionnaire/contenus" class="g-item" :class="{'g-item--on': starts('/gestionnaire/contenus')}">
            <svg class="g-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span class="g-txt">Contenus</span>
          </NuxtLink>
        </div>

        <div class="g-group">
          <p class="g-group-label">Personnes</p>

          <NuxtLink to="/gestionnaire/formateurs" class="g-item" :class="{'g-item--on': starts('/gestionnaire/formateurs')}">
            <svg class="g-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="g-txt">Formateurs</span>
          </NuxtLink>

          <NuxtLink to="/gestionnaire/signalements" class="g-item" :class="{'g-item--on': starts('/gestionnaire/signalements')}">
            <svg class="g-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="g-txt">Signalements</span>
          </NuxtLink>
        </div>

      </nav>

      <!-- User footer -->
      <div class="g-foot">
        <div class="g-user">
          <div class="g-avatar">
            <img v-if="authStore.user?.profile?.avatarUrl" :src="authStore.user.profile.avatarUrl" class="w-full h-full object-cover rounded-full" />
            <span v-else class="g-initial">{{ authStore.fullname?.charAt(0) }}</span>
          </div>
          <div class="g-user-meta">
            <p class="g-user-name">{{ authStore.fullname }}</p>
            <p class="g-user-role">Gestionnaire</p>
          </div>
          <button class="g-logout" title="Déconnexion" @click="authStore.logout()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-[13px] h-[13px]">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ══ MAIN ══════════════════════════════════ -->
    <div class="g-main">

      <!-- Header -->
      <header class="g-header">
        <div class="g-breadcrumb">
          <span class="g-bc-root">Gestionnaire</span>
          <svg class="g-bc-sep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
          <span class="g-bc-page">{{ pageTitle }}</span>
        </div>
        <div class="g-header-right">
          <button class="g-header-btn" title="Signalements" @click="navigateTo('/gestionnaire/signalements')">
            <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="g-page">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()

const exact  = (p) => route.path === p
const starts = (p) => route.path.startsWith(p)

const pageTitles = {
  '/gestionnaire/dashboard':    'Dashboard',
  '/gestionnaire':              'Langues',
  '/gestionnaire/discovery':    'Découverte',
  '/gestionnaire/formateurs':   'Formateurs',
  '/gestionnaire/contenus':     'Contenus',
  '/gestionnaire/signalements': 'Signalements',
}

const pageTitle = computed(() =>
  pageTitles[route.path] ||
  Object.entries(pageTitles).find(([k]) => route.path.startsWith(k))?.[1] ||
  'Gestionnaire'
)
</script>

<style scoped>
.g-root {
  height: 100vh;
  overflow: hidden;
  display: flex;
  background: #F4F6F9;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* ── Sidebar ─────────────────────────── */
.g-sidebar {
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

.g-brand {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 52px;
  border-bottom: 1px solid #DFE0E6;
  flex-shrink: 0;
}

.g-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  object-position: left;
}

/* Nav */
.g-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
}

.g-nav::-webkit-scrollbar { display: none; }

.g-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid #DFE0E6;
}

.g-group-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9CA3AF;
  padding: 3px 10px 5px;
  margin: 0;
}

/* Nav item */
.g-item {
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

.g-item:hover {
  background: #E8E9EF;
  color: #111827;
}

.g-item--on {
  background: #166534 !important;
  color: #ffffff !important;
}

.g-ico {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.g-txt { flex: 1; line-height: 1; }

/* User footer */
.g-foot {
  padding: 10px;
  border-top: 1px solid #DFE0E6;
  flex-shrink: 0;
}

.g-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  transition: background 0.12s;
}

.g-user:hover { background: #E8E9EF; }

.g-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #16A34A, #065F46);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}

.g-initial { font-size: 11px; font-weight: 700; color: white; }

.g-user-meta { flex: 1; min-width: 0; }

.g-user-name {
  font-size: 12px; font-weight: 600; color: #374151;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;
}

.g-user-role { font-size: 10.5px; color: #9CA3AF; margin-top: 1px; }

.g-logout {
  width: 26px; height: 26px;
  border: none; background: none; color: #9CA3AF;
  border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; flex-shrink: 0;
}
.g-logout:hover { background: rgba(239,68,68,0.10); color: #EF4444; }

/* ── Main ────────────────────────────── */
.g-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.g-header {
  height: 52px;
  background: #F4F5F8;
  border-bottom: 1px solid #DFE0E6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
}

.g-breadcrumb { display: flex; align-items: center; gap: 5px; }

.g-bc-root { font-size: 13px; font-weight: 400; color: #9CA3AF; }

.g-bc-sep { width: 11px; height: 11px; color: #D1D5DB; flex-shrink: 0; }

.g-bc-page { font-size: 13px; font-weight: 600; color: #374151; }

.g-header-right { display: flex; align-items: center; gap: 4px; }

.g-header-btn {
  width: 30px; height: 30px;
  border-radius: 7px; border: none; background: none;
  color: #BDBDBD; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.13s;
}
.g-header-btn:hover { background: #EAECF0; color: #6B7280; }

.g-page { flex: 1; overflow-y: auto; background: #F4F6F9; }
</style>

<style>
.g-root :focus-visible {
  outline: 2px solid #16A34A;
  outline-offset: 2px;
}
</style>
