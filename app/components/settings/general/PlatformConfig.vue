<script setup lang="ts">
import { ref } from 'vue'

// Configuration de la plateforme
const config = ref({
  platformName: 'LinguaLearn',
  platformDescription: 'Plateforme d\'apprentissage des langues en ligne',
  contactEmail: 'support@lingualearn.com',
  contactPhone: '+33 1 23 45 67 89',
  defaultCurrency: 'EUR',
  taxRate: 20
})

const isLoading = ref(false)
const isSaving = ref(false)
const showSuccess = ref(false)

// Charger la configuration
const loadConfig = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  isLoading.value = false
}

// Sauvegarder la configuration
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
      <div class="p-2 bg-[#000099]/10 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#000099]" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="128" cy="128" r="40" />
          <path d="M128 72v-16M128 200v-16M200 128h16M72 128h-16M178.34 77.66l-11.31 11.31M88.97 167.03l-11.31 11.31M178.34 178.34l-11.31-11.31M88.97 88.97L77.66 77.66" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Configuration de la plateforme</h2>
        <p class="text-sm text-slate-500">Paramètres généraux de la plateforme</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-[#000099] rounded-full animate-spin"></div>
    </div>

    <form v-else @submit.prevent="saveConfig" class="space-y-6">
      <!-- Nom de la plateforme -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Nom de la plateforme</label>
        <input
          v-model="config.platformName"
          type="text"
          class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
        <textarea
          v-model="config.platformDescription"
          rows="3"
          class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition resize-none"
        ></textarea>
      </div>

      <!-- Email et téléphone -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Email de contact</label>
          <input
            v-model="config.contactEmail"
            type="email"
            class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Téléphone de contact</label>
          <input
            v-model="config.contactPhone"
            type="tel"
            class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
          />
        </div>
      </div>

      <!-- Devise et taxe -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Devise par défaut</label>
          <select
            v-model="config.defaultCurrency"
            class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar US ($)</option>
            <option value="GBP">Livre Sterling (£)</option>
            <option value="XOF">Franc CFA (XOF)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Taux de taxe (%)</label>
          <input
            v-model.number="config.taxRate"
            type="number"
            min="0"
            max="100"
            class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] focus:ring-2 focus:ring-[#00ced1]/20 outline-none transition"
          />
        </div>
      </div>

      <!-- Message de succès -->
      <div v-if="showSuccess" class="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
          <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
        </svg>
        Configuration enregistrée avec succès
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

