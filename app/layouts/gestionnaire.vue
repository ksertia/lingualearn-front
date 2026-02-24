<template>
  <div class="flex flex-col h-screen bg-slate-50 overflow-hidden">
    <AppNavbar />

    <div class="flex flex-1 overflow-hidden">
      <nav class="vertical-navbar">
        <!-- <div class="nav-item menu-toggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="nav-text">Menu</span>
        </div> -->
        
        <div class="nav-items">
          <NuxtLink 
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'active': $route.path === item.path }">

              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path :d="item.icon" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg> 
              <span class="nav-text">{{ item.label }}</span>
          </NuxtLink>
        </div>
        
        <!-- <div class="nav-bottom">
          <div class="nav-item profile-item" @click="logout">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="nav-text">Se déconnecter</span>
          </div>
        </div> -->
      </nav>

      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '~/layouts/AppNavbar.vue'
const authStore = useAuthStore();

const menuItems = [
  {
    label: 'Langues',
    path: '/gestionnaire',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    label: 'Formateurs',
    path: '/gestionnaire/formateurs',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    label: 'Contenus',
    path: '/gestionnaire/contenus',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  {
    label: 'Signalements',
    path: '/gestionnaire/signalements',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  {
    label: 'Dashboard',
    path: '/gestionnaire/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
]

const logout = () => {
  authStore.logout()
}

</script>

<style scoped>
.vertical-navbar {
  width: 200px;
  background-color: #000099;
  display: flex;
  flex-direction: column;
  padding: 20px 15px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: width 0.3s ease;
  overflow: hidden;
}

.nav-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 12px;
  gap: 16px;
  border-radius: 12px;
  margin: 4px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #C0C0C0;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  background-color: rgba(0, 206, 209, 0.2);
  color: #00CED1;
  transform: translateX(4px);
}

.nav-item.active {
  background-color: #00CED1;
  color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(0, 206, 209, 0.3);
}

.menu-toggle:hover {
  background-color: rgba(255, 127, 0, 0.2);
  color: #FF7F00;
  transform: scale(1.02);
}

.nav-text {
  display: inline;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}

.nav-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

.nav-bottom {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  margin-top: auto;
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .vertical-navbar {
    width: 70px;
  }
  
  .nav-item {
    width: 45px;
    height: 45px;
  }
}

/* Icon animations */
.nav-item svg {
  transition: transform 0.2s ease;
}

.nav-item:hover svg {
  transform: scale(1.1);
}

.nav-item.active svg {
  transform: scale(1.05);
}
</style>