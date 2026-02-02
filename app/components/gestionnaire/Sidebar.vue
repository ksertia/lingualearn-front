<template>
  <!-- Sidebar Desktop -->
  <aside v-if="isDesktop" :class="['sidebar', 'sidebar-desktop']">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="logo-container">
        <span class="logo-icon">📚</span>
        <div class="logo-text-wrapper">
          <h2 class="logo-text">LinguaLearn</h2>
          <p class="logo-subtitle">Gestionnaire</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="nav-menu">
      <ul class="menu-list">
        <li class="menu-item active">
          <a href="#dashboard" class="menu-link">
            <span class="menu-icon">📊</span>
            <span class="menu-text">Dashboard</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="#languages" class="menu-link">
            <span class="menu-icon">🌍</span>
            <span class="menu-text">Langues</span>
          </a>
        </li>
        <!-- <li class="menu-item">
          <a href="#stats" class="menu-link">
            <span class="menu-icon">📈</span>
            <span class="menu-text">Statistiques</span>
          </a>
        </li>
        <li class="menu-item">
          <a href="#settings" class="menu-link">
            <span class="menu-icon">⚙️</span>
            <span class="menu-text">Paramètres</span>
          </a>
        </li> -->
      </ul>
    </nav>

    <!-- Footer avec infos utilisateur -->
    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">G</div>
        <div class="user-info">
          <p class="user-name">Gestionnaire</p>
          <p class="user-role">Gestionnaire</p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile/Tablette: Hamburger Menu Button + Drawer -->
  <div v-else>
    <!-- Hamburger Button -->
    <button
      class="hamburger-btn"
      @click="toggleMenu"
      :aria-label="isMobileDrawerOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
    >
      <span class="hamburger-icon">{{ isMobileDrawerOpen ? "✕" : "☰" }}</span>
    </button>

    <!-- Overlay -->
    <div
      v-if="isMobileDrawerOpen"
      class="sidebar-overlay"
      @click="toggleMenu"
    />

    <!-- Drawer Sidebar -->
    <aside :class="['sidebar', 'sidebar-drawer', { open: isMobileDrawerOpen }]">
      <!-- Header -->
      <div class="sidebar-header">
        <div class="logo-container">
          <span class="logo-icon">📚</span>
          <div class="logo-text-wrapper">
            <h2 class="logo-text">LinguaLearn</h2>
            <p class="logo-subtitle">Gestionnaire</p>
          </div>
        </div>
        <button
          class="close-btn"
          @click="toggleMenu"
          aria-label="Fermer le menu"
        >
          ✕
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <ul class="menu-list">
          <li class="menu-item active">
            <a href="#dashboard" class="menu-link" @click="toggleMenu">
              <span class="menu-icon">📊</span>
              <span class="menu-text">Dashboard</span>
            </a>
          </li>
          <li class="menu-item">
            <a href="#languages" class="menu-link" @click="toggleMenu">
              <span class="menu-icon">🌍</span>
              <span class="menu-text">Langues</span>
            </a>
          </li>
          <!-- <li class="menu-item">
            <a href="#stats" class="menu-link" @click="toggleMenu">
              <span class="menu-icon">📈</span>
              <span class="menu-text">Statistiques</span>
            </a>
          </li> -->
          <!-- <li class="menu-item">
            <a href="#settings" class="menu-link" @click="toggleMenu">
              <span class="menu-icon">⚙️</span>
              <span class="menu-text">Paramètres</span>
            </a>
          </li> -->
        </ul>
      </nav>

      <!-- Footer avec infos utilisateur -->
      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">G</div>
          <div class="user-info">
            <p class="user-name">Gestionnaire</p>
            <p class="user-role">Gestionnaire</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isDesktop = ref(true);
const isMobileDrawerOpen = ref(false);

const toggleMenu = () => {
  isMobileDrawerOpen.value = !isMobileDrawerOpen.value;
};

const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 1024;
  // Fermer le drawer si on passe en mode desktop
  if (isDesktop.value) {
    isMobileDrawerOpen.value = false;
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
/* Variables */
:root {
  --sidebar-width: 280px;
  --transition-duration: 0.3s;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== DESKTOP SIDEBAR ===== */
.sidebar-desktop {
  width: var(--sidebar-width);
  height: 100vh;
  background: linear-gradient(180deg, #1a2855 0%, #0f1b3b 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  border-right: 1px solid rgba(0, 188, 212, 0.1);
  z-index: 100;
  overflow: hidden;
}

/* ===== MOBILE/TABLETTE: HAMBURGER BUTTON ===== */
.hamburger-btn {
  display: none;
}

@media (max-width: 1023px) {
  .hamburger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 16px;
    left: 16px;
    width: 44px;
    height: 44px;
    background: #1a2855;
    border: 2px solid #00bcd4;
    color: #00bcd4;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;
    z-index: 101;
    transition: all 0.2s;
  }

  .hamburger-btn:hover {
    background: #00bcd4;
    color: #1a2855;
    transform: scale(1.05);
  }

  .hamburger-icon {
    display: block;
    font-weight: bold;
  }
}

/* ===== MOBILE/TABLETTE: DRAWER SIDEBAR ===== */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.sidebar-drawer {
  display: none;
}

@media (max-width: 1023px) {
  .sidebar-drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    background: linear-gradient(180deg, #1a2855 0%, #0f1b3b 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-right: 1px solid rgba(0, 188, 212, 0.1);
    z-index: 100;
    overflow: hidden;
    transform: translateX(-100%);
    transition: transform var(--transition-duration) var(--transition-timing);
  }

  .sidebar-drawer.open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
  }

  .close-btn {
    background: rgba(0, 188, 212, 0.15);
    border: 1px solid rgba(0, 188, 212, 0.3);
    color: #00bcd4;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-weight: 700;
    font-size: 18px;
    flex-shrink: 0;
  }

  .close-btn:hover {
    background: rgba(0, 188, 212, 0.25);
    color: #fff;
    border-color: #00bcd4;
    transform: scale(1.05);
  }
}

/* ===== SIDEBAR HEADER ===== */
.sidebar-header {
  padding: 24px 16px;
  border-bottom: 1px solid rgba(0, 188, 212, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  position: relative;
  min-height: 80px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.logo-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.logo-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  transition: opacity var(--transition-duration) var(--transition-timing);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #00bcd4 0%, #ff9800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.logo-subtitle {
  font-size: 10px;
  color: rgba(0, 188, 212, 0.7);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* ===== NAVIGATION MENU ===== */
.nav-menu {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  margin: 0;
  padding: 0;
  position: relative;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all var(--transition-duration) var(--transition-timing);
  border-left: 3px solid transparent;
  font-weight: 500;
  font-size: 13px;
  position: relative;
  cursor: pointer;
}

.menu-link:hover {
  color: #fff;
  background: rgba(0, 188, 212, 0.08);
  border-left-color: #00bcd4;
}

.menu-item.active .menu-link {
  color: #fff;
  background: rgba(0, 188, 212, 0.15);
  border-left-color: #ff9800;
}

.menu-icon {
  font-size: 18px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.menu-link:hover .menu-icon {
  transform: scale(1.1);
}

.menu-text {
  font-size: 13px;
  white-space: nowrap;
}

/* ===== SIDEBAR FOOTER ===== */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 188, 212, 0.15);
  background: rgba(0, 0, 0, 0.2);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00bcd4 0%, #ff9800 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  margin: 0;
  font-size: 11px;
  color: rgba(0, 188, 212, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1023px) {
  .sidebar-header {
    padding: 16px 12px;
    min-height: 70px;
  }

  .logo-icon {
    font-size: 20px;
  }

  .logo-text {
    font-size: 16px;
  }

  .logo-subtitle {
    font-size: 9px;
  }

  .menu-link {
    padding: 12px 12px;
    font-size: 12px;
  }

  .menu-icon {
    font-size: 16px;
  }

  .sidebar-footer {
    min-height: 70px;
    padding: 12px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
}

@media (max-width: 640px) {
    

  .sidebar-drawer {
    width: 100vw;
    max-width: 300px;
  }

  .sidebar-header {
    padding: 14px 10px;
    min-height: 65px;
  }

  .logo-icon {
    font-size: 18px;
  }

  .logo-text {
    font-size: 15px;
  }

  .logo-subtitle {
    font-size: 8px;
  }

  .menu-link {
    padding: 10px 10px;
    font-size: 11px;
  }

  .menu-icon {
    font-size: 15px;
  }

  .sidebar-footer {
    min-height: 65px;
    padding: 10px;
  }

  .user-avatar {
    width: 34px;
    height: 34px;
    font-size: 13px;
  }
}

/* ===== SCROLLBAR ===== */
.nav-menu::-webkit-scrollbar {
  width: 6px;
}

.nav-menu::-webkit-scrollbar-track {
  background: transparent;
}

.nav-menu::-webkit-scrollbar-thumb {
  background: rgba(0, 188, 212, 0.3);
  border-radius: 3px;
}

.nav-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 188, 212, 0.5);
}
</style>

