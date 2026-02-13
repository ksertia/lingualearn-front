<script setup lang="ts">
import { ref } from 'vue'

// État pour les tentatives de connexion
const config = ref({
  maxAttempts: 5,
  lockoutDuration: 15, // minutes
  enableLockout: true
})

const isLoading = ref(false)
const isSaving = ref(false)
const showSuccess = ref(false)

// Simuler le chargement des paramètres
const loadConfig = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  isLoading.value = false
}

// Simuler la sauvegarde
const saveConfig = async () => {
  isSaving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSaving.value = false
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

loadConfig()
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-red-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="48" y="88" width="160" height="128" rx="16" />
          <path d="M96 48h64" />
          <circle cx="128" cy="152" r="24" />
          <circle cx="128" cy="152" r="8" fill="currentColor" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Limitation des tentatives de connexion</h2>
        <p class="text-sm text-slate-500">Protégez les comptes contre les attaques par force brute</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-[#000099] rounded-full animate-spin"></div>
    </div>

    <form v-else @submit.prevent="saveConfig" class="space-y-6">
      <!-- Activation du verrouillage -->
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h3 class="text-sm font-semibold text-slate-900">Verrouillage automatique</h3>
          <p class="text-xs text-slate-500">Verrouiller le compte après plusieurs tentatives ratées</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="config.enableLockout" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00ced1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ced1]"></div>
        </label>
      </div>

      <!-- Nombre max de tentatives -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Nombre maximal de tentatives</label>
        <input
          v-model.number="config.maxAttempts"
          type="number"
          min="1"
          max="20"
          :disabled="!config.enableLockout"
          class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition disabled:opacity-50"
        />
        <p class="text-xs text-slate-500 mt-1">Nombre de tentatives avant verrouillage du compte</p>
      </div>

      <!-- Durée du verrouillage -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Durée du verrouillage (minutes)</label>
        <input
          v-model.number="config.lockoutDuration"
          type="number"
          min="1"
          max="1440"
          :disabled="!config.enableLockout"
          class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition disabled:opacity-50"
        />
        <p class="text-xs text-slate-500 mt-1">Temps avant déverrouillage automatique</p>
      </div>

      <!-- Message de succès -->
      <div v-if="showSuccess" class="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
          <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
        </svg>
        Paramètres enregistrés avec succès
      </div>

      <!-- Bouton de sauvegarde -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="isSaving"
          class="flex items-center gap-2 px-6 py-2.5 bg-[#000099] text-white font-semibold rounded-xl hover:bg-[#000066] transition disabled:opacity-50 disabled:cursor-not-allowed"
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

