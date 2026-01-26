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
    label: 'Tableau de bord',
    path: '/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    label: 'Apprenants',
    path: '/gestion-apprenants/learners',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197'
  },
  {
    label: 'Parcours',
    path: '/parcours',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    label: 'Paramètres',
    path: '/admin/settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
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
  gap: 16px;
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