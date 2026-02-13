<script setup lang="ts">
import { ref, computed } from 'vue'

// Fuseau horaire sélectionné
const selectedTimezone = ref('Europe/Paris')

// Fuseaux horaires disponibles avec icônes de région
const timezones = [
  { 
    region: 'Europe', 
    icon: '🏰',
    zones: [
      { value: 'Europe/Paris', label: 'Paris', offset: '+1', city: 'FR' },
      { value: 'Europe/London', label: 'Londres', offset: '+0', city: 'GB' },
      { value: 'Europe/Moscow', label: 'Moscou', offset: '+3', city: 'RU' }
    ]
  },
  { 
    region: 'Amériques', 
    icon: '🗽',
    zones: [
      { value: 'America/New_York', label: 'New York', offset: '-5', city: 'US' },
      { value: 'America/Chicago', label: 'Chicago', offset: '-6', city: 'US' },
    ]
  },
  { 
    region: 'Afrique', 
    icon: '🦁',
    zones: [
      { value: 'Africa/Ouagadougou', label: 'Ouagadougou', offset: '+0', city: 'BF' },
      { value: 'Africa/Lagos', label: 'Lagos', offset: '+1', city: 'NG' },
      { value: 'Africa/Dakar', label: 'Dakar', offset: '+0', city: 'SN' },
      { value: 'Africa/Abidjan', label: 'Abidjan', offset: '+0', city: 'CI' },
      { value: 'Africa/Accra', label: 'Accra', offset: '+0', city: 'GH' },
    ]
  },
  { 
    region: 'Asie', 
    icon: '🏯',
    zones: [
      { value: 'Asia/Dubai', label: 'Dubaï', offset: '+4', city: 'AE' },
      { value: 'Asia/Kolkata', label: 'Mumbai', offset: '+5:30', city: 'IN' },
    ]
  },
]

const isSaving = ref(false)
const showSuccess = ref(false)

// Fuseaux horaires groupés par région
const groupedTimezones = computed(() => timezones)

// Sauvegarder le fuseau horaire
const saveTimezone = async () => {
  isSaving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSaving.value = false
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

// Obtenir le label complet avec GMT
const getFullLabel = (zone: { label: string; offset: string }) => {
  return `${zone.label} (GMT${zone.offset})`
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-3 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-teal-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="128" cy="128" r="96" />
          <path d="M128 72V128l40 24" />
        </svg>
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-900">Fuseau horaire</h2>
        <p class="text-sm text-slate-500 mt-1">Sélectionnez le fuseau horaire de la plateforme</p>
      </div>
    </div>

    <form @submit.prevent="saveTimezone" class="space-y-6">
      <!-- Groupes de fuseaux horaires -->
      <div v-for="group in groupedTimezones" :key="group.region" class="space-y-4">
        <!-- En-tête de groupe -->
        <div class="flex items-center gap-2">
          <span class="text-xl">{{ group.icon }}</span>
          <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider">{{ group.region }}</h3>
          <div class="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
        </div>
        
        <!-- Grille de fuseaux -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <label
            v-for="zone in group.zones"
            :key="zone.value"
            class="relative group cursor-pointer"
          >
            <input
              v-model="selectedTimezone"
              type="radio"
              :value="zone.value"
              class="sr-only"
            />
            <div 
              class="p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md"
              :class="selectedTimezone === zone.value 
                ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-lg shadow-teal-100' 
                : 'border-gray-100 hover:border-gray-200 bg-white'"
            >
              <!-- Indicateur -->
              <div class="flex items-center justify-between mb-2">
                <span 
                  class="px-2.5 py-1 rounded-lg text-xs font-bold font-mono"
                  :class="selectedTimezone === zone.value 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-100 text-slate-600'"
                >
                  GMT{{ zone.offset }}
                </span>
                <div 
                  class="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
                  :class="selectedTimezone === zone.value 
                    ? 'bg-teal-500 scale-100' 
                    : 'bg-gray-100 scale-0'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 256 256">
                    <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Ville -->
              <h4 class="font-semibold text-slate-900">{{ zone.label }}</h4>
              <p class="text-xs text-slate-500 mt-1">{{ getFullLabel(zone) }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Message de succès -->
      <div v-if="showSuccess" class="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
          <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
        </svg>
        Fuseau horaire enregistré avec succès
      </div>

      <!-- Bouton de sauvegarde -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="isSaving"
          class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#000099] to-[#0000cc] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </form>
  </div>
</template>

