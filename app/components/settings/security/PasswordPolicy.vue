<script setup lang="ts">
import { ref } from 'vue'

// État local pour la politique de mot de passe
const policy = ref({
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  expiryDays: 90
})

const isLoading = ref(false)
const isSaving = ref(false)

// Simuler le chargement des paramètres
const loadPolicy = async () => {
  isLoading.value = true
  // Simulation API
  await new Promise(resolve => setTimeout(resolve, 500))
  isLoading.value = false
}

// Simuler la sauvegarde des paramètres
const savePolicy = async () => {
  isSaving.value = true
  // Simulation API
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSaving.value = false
}

// Charger au montage
loadPolicy()
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-amber-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Politique de mot de passe</h2>
        <p class="text-sm text-slate-500">Définissez les règles de sécurité pour les mots de passe</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-[#000099] rounded-full animate-spin"></div>
    </div>

    <form v-else @submit.prevent="savePolicy" class="space-y-6">
      <!-- Longueur minimale -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Longueur minimale</label>
          <input
            v-model.number="policy.minLength"
            type="number"
            min="6"
            max="32"
            class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Expiration (jours)</label>
          <input
            v-model.number="policy.expiryDays"
            type="number"
            min="0"
            max="365"
            class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
          />
          <p class="text-xs text-slate-500 mt-1">0 = pas d'expiration</p>
        </div>
      </div>

      <!-- Options de mot de passe -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
          <input
            v-model="policy.requireUppercase"
            type="checkbox"
            class="w-5 h-5 rounded text-[#000099] focus:ring-[#00ced1]"
          />
          <span class="text-sm font-medium text-slate-700">Majuscules obligatoires</span>
        </label>

        <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
          <input
            v-model="policy.requireLowercase"
            type="checkbox"
            class="w-5 h-5 rounded text-[#000099] focus:ring-[#00ced1]"
          />
          <span class="text-sm font-medium text-slate-700">Minuscules obligatoires</span>
        </label>

        <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
          <input
            v-model="policy.requireNumbers"
            type="checkbox"
            class="w-5 h-5 rounded text-[#000099] focus:ring-[#00ced1]"
          />
          <span class="text-sm font-medium text-slate-700">Chiffres obligatoires</span>
        </label>

        <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
          <input
            v-model="policy.requireSpecialChars"
            type="checkbox"
            class="w-5 h-5 rounded text-[#000099] focus:ring-[#00ced1]"
          />
          <span class="text-sm font-medium text-slate-700">Caractères spéciaux obligatoires</span>
        </label>
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
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </form>
  </div>
</template>

