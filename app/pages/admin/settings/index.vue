<script setup lang="ts">
import { ref } from 'vue'
import SecuritySection from '~/components/settings/SecuritySection.vue'
import PaymentSection from '~/components/settings/PaymentSection.vue'
import GeneralSection from '~/components/settings/GeneralSection.vue'

definePageMeta({
  layout: 'admin'
})

// Sections disponibles
const sections = [
  { id: 'security', label: 'Sécurité', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { id: 'payment', label: 'Paiement', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'general', label: 'Configuration générale', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
]

const activeSection = ref('security')

// Gestion des messages de succès/erreur
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const showMessage = (type: 'success' | 'error', text: string) => {
  message.value = { type, text }
  setTimeout(() => {
    message.value = null
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 p-4 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Paramètres</h1>
        <p class="text-slate-500 mt-1">Gérez les paramètres de la plateforme LinguaLearn.</p>
      </header>

      <!-- Message de succès/erreur -->
      <div 
        v-if="message" 
        class="mb-6 p-4 rounded-xl flex items-center gap-3"
        :class="message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
      >
        <svg v-if="message.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
          <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
          <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/>
        </svg>
        <span>{{ message.text }}</span>
      </div>

      <!-- Navigation par onglets -->
      <div class="bg-white rounded-2xl shadow-sm p-2 mb-6">
        <nav class="flex gap-2">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="activeSection = section.id"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="activeSection === section.id 
              ? 'bg-[#000099] text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path :d="section.icon" />
            </svg>
            {{ section.label }}
          </button>
        </nav>
      </div>

      <!-- Contenu des sections -->
      <div class="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <!-- Sécurité -->
        <div v-show="activeSection === 'security'">
          <SecuritySection @message="showMessage" />
        </div>

        <!-- Paiement -->
        <div v-show="activeSection === 'payment'">
          <PaymentSection @message="showMessage" />
        </div>

        <!-- Configuration générale -->
        <div v-show="activeSection === 'general'">
          <GeneralSection @message="showMessage" />
        </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full hover:bg-slate-300;
}
</style>
