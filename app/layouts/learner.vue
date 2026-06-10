<template>
  <div class="learner-layout">

    <!-- ══ TOP NAVBAR ═══════════════════════════════════════════════════════ -->
    <header class="learner-nav">
      <div class="nav-inner">

        <!-- Logo -->
        <NuxtLink to="/apprenant/dashboard" class="nav-logo">
          <img src="assets/icons/tibi-logo-final.png" alt="TiBi" class="nav-logo-img" />
        </NuxtLink>

        <!-- Navigation centrale -->
        <nav class="nav-links">
          <NuxtLink to="/apprenant/dashboard" class="nav-link" :class="{ 'nav-link--active': starts('/apprenant/dashboard') }">
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Accueil</span>
          </NuxtLink>

          <NuxtLink to="/apprenant/parcours" class="nav-link" :class="{ 'nav-link--active': starts('/apprenant/parcours') }">
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Apprendre</span>
          </NuxtLink>

          <NuxtLink to="/apprenant/badges" class="nav-link" :class="{ 'nav-link--active': starts('/apprenant/badges') }">
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>Badges</span>
          </NuxtLink>

          <NuxtLink to="/apprenant/profil" class="nav-link" :class="{ 'nav-link--active': starts('/apprenant/profil') }">
            <svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profil</span>
          </NuxtLink>
        </nav>

        <!-- Droite : stats gamifiées + avatar -->
        <div class="nav-right">

          <!-- Streak -->
          <div class="nav-stat nav-stat--streak" title="Série de jours">
            <span class="stat-icon">🔥</span>
            <span class="stat-value">{{ learnerStore.stats?.streak ?? 0 }}</span>
          </div>

          <!-- XP -->
          <div class="nav-stat nav-stat--xp" title="Points d'expérience">
            <span class="stat-icon">⚡</span>
            <span class="stat-value">{{ learnerStore.stats?.xp ?? 0 }}</span>
          </div>

          <!-- Cœurs -->
          <div class="nav-stat nav-stat--hearts" title="Vies restantes">
            <span class="stat-icon">❤️</span>
            <span class="stat-value">{{ learnerStore.stats?.hearts ?? 5 }}</span>
          </div>

          <!-- Avatar -->
          <div class="relative">
            <button class="nav-avatar" @click="isMenuOpen = !isMenuOpen" title="Mon compte">
              <img v-if="authStore.user?.profile?.avatarUrl" :src="authStore.user.profile.avatarUrl" class="w-full h-full object-cover" />
              <span v-else class="avatar-initial">{{ authStore.fullname?.charAt(0) }}</span>
            </button>

            <Transition name="pop">
              <div v-if="isMenuOpen" class="nav-menu">
                <div class="nav-menu-user">
                  <p class="menu-name">{{ authStore.fullname }}</p>
                  <p class="menu-role">Apprenant</p>
                </div>
                <div class="nav-menu-sep" />
                <NuxtLink to="/apprenant/profil" class="nav-menu-item" @click="isMenuOpen = false">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil
                </NuxtLink>
                <div class="nav-menu-sep" />
                <button class="nav-menu-item nav-menu-item--red" @click="authStore.logout()">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </Transition>
          </div>

        </div>
      </div>
    </header>

    <!-- ══ PAGE CONTENT ═══════════════════════════════════════════════════════ -->
    <main class="learner-main">
      <slot />
    </main>

  </div>

  <!-- Overlay fermeture menu -->
  <div v-if="isMenuOpen" class="fixed inset-0 z-40" @click="isMenuOpen = false" />
</template>

<script setup>
import { useLearnerStore } from '~/stores/learnerStore'

const authStore = useAuthStore()
const learnerStore = useLearnerStore()
const route = useRoute()
const isMenuOpen = ref(false)

const starts = (p) => route.path.startsWith(p)

onMounted(() => {
  learnerStore.init()
})
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────── */
.learner-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0fdf4;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow-x: hidden;
}

/* ── Navbar ──────────────────────────────────────────────────────────────── */
.learner-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 2px solid #e8f5e9;
  box-shadow: 0 2px 12px rgba(26, 122, 26, 0.08);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 32px;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
}

.nav-logo-img {
  height: 34px;
  width: auto;
  object-fit: contain;
}

/* Navigation centrale */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 600;
  color: #6B7280;
  transition: all 0.18s ease;
  border-bottom: 2px solid transparent;
  letter-spacing: 0.01em;
}

.nav-link:hover {
  color: #1A7A1A;
  background: #f0fdf4;
}

.nav-link--active {
  color: #1A7A1A;
  border-bottom-color: #1A7A1A;
  background: #f0fdf4;
}

.nav-link-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Droite */
.nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* Stats gamifiées */
.nav-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: default;
  transition: transform 0.15s;
  user-select: none;
}

.nav-stat:hover { transform: scale(1.05); }

.nav-stat--streak {
  background: #FFF7ED;
  color: #EA580C;
  border: 1.5px solid #FED7AA;
}

.nav-stat--xp {
  background: #FFFBEB;
  color: #D97706;
  border: 1.5px solid #FDE68A;
}

.nav-stat--hearts {
  background: #FFF1F2;
  color: #E11D48;
  border: 1.5px solid #FECDD3;
}

.stat-icon { font-size: 14px; line-height: 1; }
.stat-value { line-height: 1; }

/* Avatar */
.nav-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1A7A1A, #065F46);
  border: 2px solid #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.18s;
  flex-shrink: 0;
}

.nav-avatar:hover {
  border-color: #1A7A1A;
  box-shadow: 0 0 0 3px rgba(26, 122, 26, 0.15);
}

.avatar-initial {
  font-size: 14px;
  font-weight: 700;
  color: white;
}

/* Dropdown menu */
.nav-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 4px;
  min-width: 180px;
  z-index: 60;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.nav-menu-user {
  padding: 10px 12px 8px;
}

.menu-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.menu-role {
  font-size: 11px;
  color: #1A7A1A;
  font-weight: 500;
  margin-top: 1px;
}

.nav-menu-sep {
  height: 1px;
  background: #F3F4F6;
  margin: 4px 0;
}

.nav-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.1s;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  text-decoration: none;
}

.nav-menu-item:hover { background: #F9FAFB; }
.nav-menu-item--red { color: #EF4444; }
.nav-menu-item--red:hover { background: #FFF1F2; }

/* ── Main ────────────────────────────────────────────────────────────────── */
.learner-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ── Transition ──────────────────────────────────────────────────────────── */
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .nav-inner {
    padding: 0 16px;
    gap: 12px;
  }

  .nav-links {
    display: none;
  }

  .nav-stat span:last-child {
    display: none;
  }

  .nav-stat {
    padding: 5px 8px;
  }
}
</style>

<style>
.learner-layout :focus-visible {
  outline: 2px solid #1A7A1A;
  outline-offset: 2px;
}
</style>
