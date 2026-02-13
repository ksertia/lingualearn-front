<script setup lang="ts">
import { ref, computed } from 'vue'

// Types
interface Restriction {
  id: string
  feature: string
  description: string
  plans: {
    free: boolean | number
    basic: boolean | number
    premium: boolean | number
  }
}

const isLoading = ref(false)
const showSuccess = ref(false)

// Restrictions simulées
const restrictions = ref<Restriction[]>([
  {
    id: 'courses-access',
    feature: 'Accès aux cours',
    description: 'Nombre de cours accessibles par mois',
    plans: { free: 3, basic: 10, premium: -1 }
  },
  {
    id: 'downloads',
    feature: 'Téléchargements',
    description: 'Téléchargement de contenu hors ligne',
    plans: { free: false, basic: true, premium: true }
  },
  {
    id: 'certificates',
    feature: 'Certificats',
    description: 'Obtention de certificats de completion',
    plans: { free: false, basic: true, premium: true }
  },
  {
    id: 'coaching',
    feature: 'Coaching',
    description: 'Sessions de coaching personnalisé',
    plans: { free: false, basic: false, premium: true }
  },
  {
    id: 'api-access',
    feature: 'API',
    description: 'Accès à l\'API de la plateforme',
    plans: { free: false, basic: false, premium: false }
  },
  {
    id: 'priority-support',
    feature: 'Support prioritaire',
    description: 'Accès au support prioritaire',
    plans: { free: false, basic: true, premium: true }
  },
  {
    id: 'analytics',
    feature: 'Analytique détaillée',
    description: 'Statistiques et analytics approfondis',
    plans: { free: false, basic: false, premium: true }
  },
  {
    id: 'custom-branding',
    feature: 'Personnalisation',
    description: 'Logo et couleurs personnalisés',
    plans: { free: false, basic: false, premium: false }
  }
])

// Label des plans
const planLabels = {
  free: 'Gratuit',
  basic: 'Basique',
  premium: 'Premium'
}

// Vérifier si la valeur est "illimité" (-1)
const formatValue = (value: boolean | number) => {
  if (value === true) return '✓'
  if (value === false) return '✗'
  if (value === -1) return 'Illimité'
  return value.toString()
}

// Sauvegarder les restrictions
const saveRestrictions = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-indigo-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="48" y="56" width="160" height="144" rx="8" />
          <path d="M48 96h160" />
          <path d="M96 56V40" />
          <path d="M160 56V40" />
          <circle cx="80" cy="76" r="4" fill="currentColor" />
          <circle cx="120" cy="76" r="4" fill="currentColor" />
          <circle cx="160" cy="76" r="4" fill="currentColor" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Restrictions d'accès</h2>
        <p class="text-sm text-slate-500">Configurez les fonctionnalités accessibles par abonnement</p>
      </div>
    </div>

<!-- Tableau des restrictions -->
    <div class="overflow-x-auto rounded-xl border border-gray-100">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50/80">
            <th class="text-left py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fonctionnalité</th>
            <th class="text-center py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gratuit</th>
            <th class="text-center py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Basique</th>
            <th class="text-center py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="restriction in restrictions" 
            :key="restriction.id"
            class="border-b border-gray-50 hover:bg-gray-50/50 transition"
          >
            <td class="py-4 px-4">
              <div>
                <p class="text-sm font-medium text-slate-900">{{ restriction.feature }}</p>
                <p class="text-xs text-slate-500">{{ restriction.description }}</p>
              </div>
            </td>
            <td class="py-4 px-4 text-center">
              <span 
                class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold"
                :class="restriction.plans.free === true || restriction.plans.free === -1 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : restriction.plans.free === false 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'"
              >
                {{ formatValue(restriction.plans.free) }}
              </span>
            </td>
            <td class="py-4 px-4 text-center">
              <span 
                class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold"
                :class="restriction.plans.basic === true || restriction.plans.basic === -1 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : restriction.plans.basic === false 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'"
              >
                {{ formatValue(restriction.plans.basic) }}
              </span>
            </td>
            <td class="py-4 px-4 text-center">
              <span 
                class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold"
                :class="restriction.plans.premium === true || restriction.plans.premium === -1 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : restriction.plans.premium === false 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'"
              >
                {{ formatValue(restriction.plans.premium) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Message de succès -->
    <div v-if="showSuccess" class="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
        <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/>
      </svg>
      Restrictions enregistrées avec succès
    </div>

    <!-- Bouton de sauvegarde -->
    <div class="flex justify-end mt-6">
      <button
        @click="saveRestrictions"
        :disabled="isLoading"
        class="flex items-center gap-2 px-6 py-2.5 bg-[#000099] text-white font-semibold rounded-xl hover:bg-[#000066] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="isLoading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>
  </div>
</template>

