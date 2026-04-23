<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSubscriptionStore } from '~/stores/subscriptionStore'
import type { SubscriptionPlan, CreatePlanPayload } from '~/types/settings'

const subscriptionStore = useSubscriptionStore()

const isLoading = ref(false)
const editingPlan = ref<SubscriptionPlan | null>(null)
const showEditModal = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const planToDelete = ref<SubscriptionPlan | null>(null)

// Form for creating/editing
const newPlan = ref<CreatePlanPayload>({
  planCode: '',
  planName: '',
  description: '',
  priceMonthly: 0,
  priceYearly: 0,
  currency: 'XOF',
  features: [],
  maxSubAccounts: 0,
  isActive: true
})

// Charger les plans au montage
onMounted(async () => {
  await subscriptionStore.fetchPlans()
})

// Plans depuis le store
const plans = computed(() => subscriptionStore.plans)

// Activer/désactiver un plan
const togglePlan = async (plan: SubscriptionPlan) => {
  await subscriptionStore.togglePlan(plan.id)
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

  try {
    await subscriptionStore.updatePlan(editingPlan.value.id, {
      planCode: editingPlan.value.planCode,
      planName: editingPlan.value.planName,
      description: editingPlan.value.description,
      priceMonthly: editingPlan.value.priceMonthly,
      priceYearly: editingPlan.value.priceYearly,
      currency: editingPlan.value.currency,
      features: editingPlan.value.features,
      maxSubAccounts: editingPlan.value.maxSubAccounts,
      isActive: editingPlan.value.isActive
    })
    showEditModal.value = false
    editingPlan.value = null
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    isLoading.value = false
  }
}

// Ouvrir le modal de création
const openCreateModal = () => {
  newPlan.value = {
    planCode: '',
    planName: '',
    description: '',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'XOF',
    features: [],
    maxSubAccounts: 0,
    isActive: true
  }
  showCreateModal.value = true
}

// Créer un nouveau plan
const createPlan = async () => {
  isLoading.value = true

  try {
    await subscriptionStore.createPlan(newPlan.value)
    showCreateModal.value = false
  } catch (error) {
    console.error('Erreur lors de la création:', error)
  } finally {
    isLoading.value = false
  }
}

// Ouvrir le modal de suppression
const openDeleteModal = (plan: SubscriptionPlan) => {
  planToDelete.value = plan
  showDeleteModal.value = true
}

// Supprimer un plan
const deletePlan = async () => {
  if (!planToDelete.value) return
  isLoading.value = true

  try {
    await subscriptionStore.deletePlan(planToDelete.value.id)
    showDeleteModal.value = false
    planToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    isLoading.value = false
  }
}

// Formater les features pour l'affichage
const formatFeatures = (features: any): string[] => {
  if (!features) return []
  if (Array.isArray(features)) {
    return features.map((f: any) => {
      if (typeof f === 'string') return f
      if (f && typeof f === 'object') {
        return f.name || f.label || f.description || JSON.stringify(f)
      }
      return String(f)
    })
  }
  if (typeof features === 'object') {
    return Object.values(features).map(String)
  }
  return [String(features)]
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
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
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-[#000099] text-white rounded-xl hover:bg-[#000066] transition flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M128 24v104M24 128h104" />
        </svg>
        Nouveau plan
      </button>
    </div>

<!-- Liste des plans -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="(plan, index) in plans"
        :key="plan.id"
        class="relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg"
        :class="[
          plan.isActive
            ? plan.planName === 'Premium'
              ? 'border-purple-500 bg-gradient-to-br from-white to-purple-50'
              : plan.planName === 'Basique'
                ? 'border-[#00ced1] bg-gradient-to-br from-white to-cyan-50'
                : 'border-gray-200 bg-white hover:border-[#00ced1]'
            : 'border-gray-100 bg-gray-50 opacity-75'
        ]"
      >
        <!-- Badge populaire pour Premium -->
        <div v-if="plan.planName === 'Premium' && plan.isActive" class="absolute -top-3 left-1/2 -translate-x-1/2">
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
        <h3 class="text-xl font-bold text-slate-900 mb-2">{{ plan.planName }}</h3>

        <!-- Prix -->
        <div class="mb-4">
          <span
            class="text-4xl font-bold"
            :class="plan.planName === 'Premium' ? 'text-purple-600' : plan.planName === 'Basique' ? 'text-[#00ced1]' : 'text-slate-900'"
          >
            {{ plan.priceMonthly === 0 ? 'Gratuit' : `${plan.priceMonthly} fcfa` }}
          </span>
          <span v-if="plan.priceMonthly > 0" class="text-sm text-slate-500 ml-1">/mois</span>
        </div>

        <!-- Prix annuel -->
        <div v-if="plan.priceYearly > 0" class="mb-4 text-sm text-slate-500">
          <span class="font-medium">{{ plan.priceYearly }} fcfa</span> / an
        </div>

<!-- Caractéristiques -->
        <ul class="space-y-2 mb-6">
          <li v-for="(feature, idx) in formatFeatures(plan.features)" :key="idx" class="flex items-center gap-2 text-sm text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              :class="plan.planName === 'Premium' ? 'text-purple-500' : plan.planName === 'Basique' ? 'text-[#00ced1]' : 'text-slate-400'"
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
        <div class="flex flex-wrap gap-2 mt-4">
          <button
            @click="openEditModal(plan)"
            class="flex-1 min-w-0 px-2 py-2 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap"
            :class="plan.planName === 'Premium'
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
              : plan.planName === 'Basique'
                ? 'bg-[#00ced1] text-white hover:bg-[#00b5b8] shadow-md hover:shadow-lg'
                : 'bg-slate-800 text-white hover:bg-slate-700'"
          >
            Modifier
          </button>
          <button
            @click="togglePlan(plan)"
            :disabled="isLoading"
            class="flex-1 min-w-0 px-2 py-2 text-xs font-medium rounded-xl transition whitespace-nowrap"
            :class="plan.isActive
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'"
          >
            {{ plan.isActive ? 'Désactiver' : 'Activer' }}
          </button>
          <button
            @click="openDeleteModal(plan)"
            :disabled="isLoading"
            class="flex-1 min-w-0 px-2 py-2 text-xs font-medium rounded-xl transition bg-gray-100 text-gray-600 hover:bg-gray-200 whitespace-nowrap"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'édition -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Modifier le plan {{ editingPlan?.planName }}</h3>

          <div v-if="editingPlan" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Code du plan</label>
              <input
                v-model="editingPlan.planCode"
                type="text"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Nom du plan</label>
              <input
                v-model="editingPlan.planName"
                type="text"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                v-model="editingPlan.description"
                rows="3"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Prix mensuel (€)</label>
                <input
                  v-model.number="editingPlan.priceMonthly"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Prix annuel (€)</label>
                <input
                  v-model.number="editingPlan.priceYearly"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Devise</label>
                <input
                  v-model="editingPlan.currency"
                  type="text"
                  class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Max sous-comptes</label>
                <input
                  v-model.number="editingPlan.maxSubAccounts"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
                />
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="editingPlan.isActive"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ced1]"></div>
              </label>
              <span class="text-sm font-medium text-slate-700">Plan actif</span>
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

    <!-- Modal de création -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Créer un nouveau plan</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Code du plan *</label>
              <input
                v-model="newPlan.planCode"
                type="text"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Nom du plan *</label>
              <input
                v-model="newPlan.planName"
                type="text"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                v-model="newPlan.description"
                rows="3"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Prix mensuel (fcfa)</label>
                <input
                  v-model.number="newPlan.priceMonthly"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Prix annuel (fcfa)</label>
                <input
                  v-model.number="newPlan.priceYearly"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Devise</label>
                <input
                  v-model="newPlan.currency"
                  type="text"
                  class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Max sous-comptes</label>
                <input
                  v-model.number="newPlan.maxSubAccounts"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
                />
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="newPlan.isActive"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ced1]"></div>
              </label>
              <span class="text-sm font-medium text-slate-700">Plan actif</span>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showCreateModal = false"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              @click="createPlan"
              :disabled="isLoading"
              class="px-4 py-2 text-sm font-medium bg-[#000099] text-white rounded-lg hover:bg-[#000066] transition disabled:opacity-50"
            >
              {{ isLoading ? 'Création...' : 'Créer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-4">Supprimer le plan</h3>
          <p class="text-slate-600 mb-6">
            Êtes-vous sûr de vouloir supprimer le plan <strong>{{ planToDelete?.planName }}</strong> ? Cette action est irréversible.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              @click="deletePlan"
              :disabled="isLoading"
              class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {{ isLoading ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

