<script setup lang="ts">
import { ref } from 'vue'

// Langue sélectionnée
const selectedLanguage = ref('fr')

// Liste des langues disponibles
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', native: 'Français' },
  { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
]

const isSaving = ref(false)
const showSuccess = ref(false)

// Sauvegarder la langue
const saveLanguage = async () => {
  isSaving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSaving.value = false
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-pink-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="128" cy="128" r="96" />
          <path d="M128 32v192M32 128h192" />
          <path d="M72 72l112 112M184 72L72 184" />
        </svg>
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-900">Langue par défaut</h2>
        <p class="text-sm text-slate-500 mt-1">Sélectionnez la langue principale de la plateforme</p>
      </div>
    </div>

    <form @submit.prevent="saveLanguage" class="space-y-6">
      <!-- Grille de langues avec cartes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label
          v-for="lang in languages"
          :key="lang.code"
          class="relative group cursor-pointer"
        >
          <input
            v-model="selectedLanguage"
            type="radio"
            :value="lang.code"
            class="sr-only"
          />
          <div 
            class="p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden"
            :class="selectedLanguage === lang.code 
              ? 'border-[#00ced1] bg-gradient-to-br from-[#00ced1]/10 to-cyan-50 shadow-lg shadow-cyan-100' 
              : 'border-gray-100 hover:border-gray-200 hover:shadow-md bg-white'"
          >
            <!-- Indicateur sélection -->
            <div 
              class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
              :class="selectedLanguage === lang.code 
                ? 'bg-[#00ced1] scale-100' 
                : 'bg-gray-100 scale-0'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 256 256">
                <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
              </svg>
            </div>

            <div class="flex items-center gap-4">
              <!-- Drapeau -->
              <div class="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-xl text-3xl">
                {{ lang.flag }}
              </div>
              
              <!-- Informations -->
              <div class="flex-1">
                <h3 class="font-semibold text-slate-900 text-lg">{{ lang.name }}</h3>
                <p class="text-sm text-slate-500">{{ lang.native }}</p>
              </div>
            </div>

            <!-- Barre de sélection inférieure -->
            <div 
              class="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300"
              :class="selectedLanguage === lang.code ? 'bg-[#00ced1]' : 'bg-transparent'"
            />
          </div>
        </label>
      </div>

      <!-- Message de succès -->
      <div v-if="showSuccess" class="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
          <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
        </svg>
        Langue enregistrée avec succès
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

