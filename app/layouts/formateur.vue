<template>
  <div class="f-root">

    <!-- ══ SIDEBAR ══════════════════════════════ -->
    <aside class="f-sidebar">

      <!-- Brand -->
      <div class="f-brand">
        <img src="assets/icons/tibi-logo-final.png" alt="TiBi" class="f-logo" />
      </div>

      <!-- Nav -->
      <nav class="f-nav">

        <NuxtLink to="/module-formateur" class="f-item" :class="{ 'f-item--on': exact('/module-formateur') }">
          <svg class="f-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="f-txt">Langues</span>
        </NuxtLink>

        <NuxtLink to="/module-formateur/learner" class="f-item" :class="{ 'f-item--on': starts('/module-formateur/learner') }">
          <svg class="f-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="f-txt">Apprenants</span>
        </NuxtLink>

      </nav>

      <!-- User footer -->
      <div class="f-foot">
        <div class="f-user">
          <div class="f-avatar">
            <img v-if="authStore.user?.profile?.avatarUrl" :src="authStore.user.profile.avatarUrl" class="f-avatar-img" />
            <span v-else class="f-initial">{{ authStore.fullname?.charAt(0) }}</span>
          </div>
          <div class="f-user-meta">
            <p class="f-user-name">{{ authStore.fullname }}</p>
            <p class="f-user-role">Formateur</p>
          </div>
          <button class="f-logout" title="Déconnexion" @click="authStore.logout()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="f-logout-ico">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ══ MAIN ══════════════════════════════════ -->
    <div class="f-main">

      <!-- Header -->
      <header class="f-header">
        <div class="f-breadcrumb">
          <span class="f-bc-root">Formateur</span>
          <svg class="f-bc-sep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
          <span class="f-bc-page">{{ pageTitle }}</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="f-page">
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

const pageTitle = computed(() => {
  if (route.path === '/module-formateur') return 'Langues'
  if (route.path.startsWith('/module-formateur/learner')) return 'Apprenants'
  if (route.path.startsWith('/module-formateur/moduleCrea')) return 'Modules'
  if (route.path.startsWith('/module-formateur/parcours')) return 'Parcours'
  if (route.path.startsWith('/module-formateur/etapes/edit')) return 'Modifier l\'étape'
  if (route.path.startsWith('/module-formateur/etapes')) return 'Étapes'
  return 'Formateur'
})
</script>

<style scoped>
.f-root {
  height: 100vh;
  overflow: hidden;
  display: flex;
  background: #F4F6F9;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* ── Sidebar ─────────────────────────── */
.f-sidebar {
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

.f-brand {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 52px;
  border-bottom: 1px solid #DFE0E6;
  flex-shrink: 0;
}

.f-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  object-position: left;
}

.f-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
}

.f-nav::-webkit-scrollbar { display: none; }

.f-item {
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

.f-item:hover { background: #E8E9EF; color: #111827; }

.f-item--on {
  background: #166534 !important;
  color: #ffffff !important;
}

.f-ico { width: 15px; height: 15px; flex-shrink: 0; }
.f-txt { flex: 1; line-height: 1; }

/* User footer */
.f-foot {
  padding: 10px;
  border-top: 1px solid #DFE0E6;
  flex-shrink: 0;
}

.f-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  transition: background 0.12s;
}

.f-user:hover { background: #E8E9EF; }

.f-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #16A34A, #065F46);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0;
}

.f-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.f-initial { font-size: 11px; font-weight: 700; color: white; }

.f-user-meta { flex: 1; min-width: 0; }

.f-user-name {
  font-size: 12px; font-weight: 600; color: #374151;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;
}

.f-user-role { font-size: 10.5px; color: #9CA3AF; margin-top: 1px; }

.f-logout {
  width: 26px; height: 26px;
  border: none; background: none; color: #9CA3AF;
  border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; flex-shrink: 0;
}
.f-logout:hover { background: rgba(239,68,68,0.10); color: #EF4444; }
.f-logout-ico { width: 13px; height: 13px; }

/* ── Main ────────────────────────────── */
.f-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.f-header {
  height: 52px;
  background: #F4F5F8;
  border-bottom: 1px solid #DFE0E6;
  display: flex;
  align-items: center;
  padding: 0 28px;
  flex-shrink: 0;
}

.f-breadcrumb { display: flex; align-items: center; gap: 5px; }
.f-bc-root { font-size: 13px; font-weight: 400; color: #9CA3AF; }
.f-bc-sep { width: 11px; height: 11px; color: #D1D5DB; flex-shrink: 0; }
.f-bc-page { font-size: 13px; font-weight: 600; color: #374151; }

.f-page { flex: 1; overflow-y: auto; background: #F4F6F9; }
</style>

<style>
.f-root :focus-visible {
  outline: 2px solid #16A34A;
  outline-offset: 2px;
}
</style>
