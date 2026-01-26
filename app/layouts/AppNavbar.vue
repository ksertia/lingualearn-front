<template>
  <nav class="h-16 bg-[#000099] px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
        <span class="text-white font-black text-xs">LL</span>
      </div>
      <span class="text-xl font-bold text-white tracking-tight">Lingua<span class="text-brand-cyan text-[#00CED1]">Learn</span></span>
    </div>

    <div class="flex items-center gap-4">
      <button class="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#000099]"></span>
      </button>

      <div class="relative">
        <button 
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-3 p-1.5 pr-3 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/20"
        >
          <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white overflow-hidden border border-white/30">
            <img v-if="authStore.user?.profile?.avatarUrl" :src="authStore.user.profile.avatarUrl" alt="Avatar" class="w-full h-full object-cover">
            <span v-else class="font-bold text-sm">{{ authStore.fullname.charAt(0) }}</span>
          </div>
          <div class="text-left hidden sm:block">
            <p class="text-xs font-black text-white leading-none">{{ authStore.fullname }}</p>
            <p class="text-[10px] text-white/70 font-medium mt-1 uppercase">{{ authStore.user?.accountType || 'professeur' }}</p>
          </div>
        <svg 
          class="w-4 h-4 text-white/70 transition-transform duration-200"
          :class="{ 'rotate-180': isDropdownOpen }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

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
          class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-slate-50 mb-1">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compte connecté</p>
          </div>
          
          <NuxtLink 
            to="/admin/settings/profile" 
            class="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors"
            @click="isDropdownOpen = false"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="font-bold">Mon Profil</span>
          </NuxtLink>

          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 transition-colors mt-1"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="font-bold">Déconnexion</span>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</nav>

  <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-40 bg-transparent"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/authStore';

const authStore = useAuthStore();
const isDropdownOpen = ref(false);

function handleLogout() {
  isDropdownOpen.value = false;
  authStore.logout();
}
</script>
