<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

      <!-- Header avec avatar -->
      <div class="bg-gradient-to-br from-[#000099] to-[#0000cc] px-8 py-6">
        <div class="flex items-center gap-5">
          <div class="w-16 h-16 rounded-2xl bg-[#00ced1]/20 text-[#00ced1] flex items-center justify-center text-2xl font-black flex-shrink-0">
            {{ user.profile.firstName[0] }}{{ user.profile.lastName[0] }}
          </div>
          <div class="min-w-0">
            <h2 class="text-lg font-black text-white truncate">
              {{ user.profile.firstName }} {{ user.profile.lastName }}
            </h2>
            <p class="text-sm text-white/60 mt-0.5 truncate">{{ user.email }}</p>
            <span class="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#00ced1]/20 text-[#00ced1]">
              {{ accountTypeLabel[user.accountType] || user.accountType }}
            </span>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="px-8 py-6 space-y-5">

        <!-- Badges statuts -->
        <div class="flex items-center gap-3 flex-wrap">
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            :class="user.isVerified ? 'bg-green-50' : 'bg-amber-50'"
          >
            <div class="w-2 h-2 rounded-full" :class="user.isVerified ? 'bg-green-500' : 'bg-amber-400'"></div>
            <span class="text-xs font-bold" :class="user.isVerified ? 'text-green-700' : 'text-amber-700'">
              {{ user.isVerified ? 'Compte vérifié' : 'Non vérifié' }}
            </span>
          </div>
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            :class="user.isActive ? 'bg-[#00ced1]/10' : 'bg-gray-100'"
          >
            <div class="w-2 h-2 rounded-full" :class="user.isActive ? 'bg-[#00ced1]' : 'bg-gray-400'"></div>
            <span class="text-xs font-bold" :class="user.isActive ? 'text-[#000099]' : 'text-gray-500'">
              {{ user.isActive ? 'Actif' : 'Inactif' }}
            </span>
          </div>
        </div>

        <!-- Champs info -->
        <div class="space-y-3">

          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email</p>
              <p class="text-sm font-semibold text-gray-800 truncate">{{ user.email || '-' }}</p>
            </div>
          </div>

          <div v-if="user.username" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Username</p>
              <p class="text-sm font-semibold text-gray-800">{{ user.username }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Date d'inscription</p>
              <p class="text-sm font-semibold text-gray-800">{{ formattedDate }}</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <div class="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-all"
        >
          Fermer
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '~/types/auth'
import { accountTypeLabel } from '~/utils/labels'

const props = defineProps<{
  user: User & { createdAt?: string | Date; password?: string }
}>()

defineEmits(['close'])

const formattedDate = computed(() => {
  if (!props.user.createdAt) return '-'
  return new Date(props.user.createdAt).toLocaleString()
})
</script>
