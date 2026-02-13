<script setup lang="ts">
import { ref, computed } from 'vue'

// Types
interface SubscriptionPlan {
  id: number
  name: string
  price: number
  duration: number // en jours
  features: string[]
  isActive: boolean
  subscribers: number
}

// Plans d'abonnement simulés
const plans = ref<SubscriptionPlan[]>([
  {
    id: 1,
    name: 'Gratuit',
    price: 0,
    duration: 0,
    features: ['Accès aux cours gratuits', 'Profil de base', 'Support par email'],
    isActive: true,
    subscribers: 1250
  },
  {
    id: 2,
    name: 'Basique',
    price: 9.99,
    duration: 30,
    features: ['Accès à tous les cours', 'Suivi de progression', 'Certificats', 'Support prioritaire'],
    isActive: true,
    subscribers: 450
  },
  {
    id: 3,
    name: 'Premium',
    price: 19.99,
    duration: 30,
    features: ['Accès illimité', 'Téléchargement hors ligne', 'Coaching personnalisé', 'Accès anticipé aux nouvelles fonctionnalités'],
    isActive: true,
    subscribers: 180
  }
])

const isLoading = ref(false)
const editingPlan = ref<SubscriptionPlan | null>(null)
const showEditModal = ref(false)

// Activer/désactiver un plan
const togglePlan = async (plan: SubscriptionPlan) => {
  isLoading.value = true
  plan.isActive = !plan.isActive
  await new Promise(resolve => setTimeout(resolve, 500))
  isLoading.value = false
}

// Ouvrir le modal d'édition
const openEditModal = (plan: SubscriptionPlan) => {
  editingPlan.value = { ...plan }
  showEditModal.value = true
}

// Sauvegarder les modifications
const savePlan = async () => {
  if (!editingPlan.value) return
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const index = plans.value.findIndex(p => p.id === editingPlan.value!.id)
  if (index !== -1) {
    plans.value[index] = { ...editingPlan.value }
  }
  
  isLoading.value = false
  showEditModal.value = false
  editingPlan.value = null
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-purple-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="24" y="60" width="208" height="136" rx="16" />
          <path d="M24 100h208" />
          <path d="M80 60V44" />
          <path d="M176 60V44" />
          <path d="M80 156v40" />
          <path d="M120 156v40" />
          <path d="M160 156v40" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Abonnements</h2>
        <p class="text-sm text-slate-500">Gérez les plans d'abonnement</p>
      </div>
    </div>

<!-- Liste des plans -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="(plan, index) in plans" 
        :key="plan.id"
        class="relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg"
        :class="[
          plan.isActive 
            ? plan.name === 'Premium' 
              ? 'border-purple-500 bg-gradient-to-br from-white to-purple-50' 
              : plan.name === 'Basique'
                ? 'border-[#00ced1] bg-gradient-to-br from-white to-cyan-50'
                : 'border-gray-200 bg-white hover:border-[#00ced1]'
            : 'border-gray-100 bg-gray-50 opacity-75'
        ]"
      >
        <!-- Badge populaire pour Premium -->
        <div v-if="plan.name === 'Premium' && plan.isActive" class="absolute -top-3 left-1/2 -translate-x-1/2">
          <span class="px-4 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-md">
            Populaire
          </span>
        </div>

        <!-- Badge statut -->
        <div class="absolute -top-3 -right-3">
          <span 
            class="px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
            :class="plan.isActive ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'"
          >
            {{ plan.isActive ? 'Actif' : 'Inactif' }}
          </span>
        </div>

        <!-- Nom du plan -->
        <h3 class="text-xl font-bold text-slate-900 mb-2">{{ plan.name }}</h3>
        
        <!-- Prix -->
        <div class="mb-4">
          <span 
            class="text-4xl font-bold"
            :class="plan.name === 'Premium' ? 'text-purple-600' : plan.name === 'Basique' ? 'text-[#00ced1]' : 'text-slate-900'"
          >
            {{ plan.price === 0 ? 'Gratuit' : `${plan.price}€` }}
          </span>
          <span v-if="plan.price > 0" class="text-sm text-slate-500 ml-1">/mois</span>
        </div>

        <!-- Prix annuel -->
        <div v-if="plan.price > 0" class="mb-4 text-sm text-slate-500">
          <span class="font-medium">{{ (plan.price * 12 * 0.8).toFixed(2) }}€</span> / an (économisez 20%)
        </div>

<!-- Caractéristiques -->
        <ul class="space-y-2 mb-6">
          <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-center gap-2 text-sm text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" 
              class="w-4 h-4" 
              :class="plan.name === 'Premium' ? 'text-purple-500' : plan.name === 'Basique' ? 'text-[#00ced1]' : 'text-slate-400'" 
              viewBox="0 0 256 256">
              <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
            </svg>
            {{ feature }}
          </li>
        </ul>

        <!-- Abonnés -->
        <div class="pt-4 border-t border-gray-100">
          <p class="text-sm text-slate-500">
            <span class="font-semibold">{{ plan.subscribers }}</span> abonnés
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-4">
          <button
            @click="openEditModal(plan)"
            class="flex-1 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
            :class="plan.name === 'Premium' 
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg' 
              : plan.name === 'Basique'
                ? 'bg-[#00ced1] text-white hover:bg-[#00b5b8] shadow-md hover:shadow-lg'
                : 'bg-slate-800 text-white hover:bg-slate-700'"
          >
            Modifier
          </button>
          <button
            @click="togglePlan(plan)"
            :disabled="isLoading"
            class="px-3 py-2.5 text-sm font-medium rounded-xl transition"
            :class="plan.isActive 
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'"
          >
            {{ plan.isActive ? 'Désactiver' : 'Activer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'édition -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Modifier le plan {{ editingPlan?.name }}</h3>
          
          <div v-if="editingPlan" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Nom du plan</label>
              <input
                v-model="editingPlan.name"
                type="text"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Prix (€)</label>
              <input
                v-model.number="editingPlan.price"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Durée (jours)</label>
              <input
                v-model.number="editingPlan.duration"
                type="number"
                min="1"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showEditModal = false"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              @click="savePlan"
              :disabled="isLoading"
              class="px-4 py-2 text-sm font-medium bg-[#000099] text-white rounded-lg hover:bg-[#000066] transition disabled:opacity-50"
            >
              {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

