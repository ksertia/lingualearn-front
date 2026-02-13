<script setup lang="ts">
import { ref } from 'vue'

// Types
interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  isEnabled: boolean
  fees: number // percentage
  isTestMode: boolean
}

// Méthodes de paiement simulées
const methods = ref<PaymentMethod[]>([
  {
    id: 'stripe',
    name: 'Carte Bancaire (Stripe)',
    icon: 'credit-card',
    description: 'Acceptez les paiements par carte de crédit et débit',
    isEnabled: true,
    fees: 1.4,
    isTestMode: false
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'wallet',
    description: 'Permettez à vos clients de payer avec leur compte PayPal',
    isEnabled: true,
    fees: 2.9,
    isTestMode: false
  },
  {
    id: 'orange-money',
    name: 'Orange Money',
    icon: 'smartphone',
    description: 'Acceptez les paiements via Orange Money (Afrique)',
    isEnabled: true,
    fees: 2.5,
    isTestMode: true
  },
  {
    id: 'mobile-money',
    name: 'Mobile Money',
    icon: 'phone',
    description: 'Acceptez les paiements Mobile Money (MTN, Airtel)',
    isEnabled: false,
    fees: 2.0,
    isTestMode: true
  },
  {
    id: 'bank-transfer',
    name: 'Virement bancaire',
    icon: 'building',
    description: 'Acceptez les virements bancaires classiques',
    isEnabled: true,
    fees: 0,
    isTestMode: false
  }
])

const isLoading = ref(false)
const selectedMethod = ref<PaymentMethod | null>(null)
const showConfigModal = ref(false)

// Basculer l'activation d'une méthode
const toggleMethod = async (method: PaymentMethod) => {
  isLoading.value = true
  method.isEnabled = !method.isEnabled
  await new Promise(resolve => setTimeout(resolve, 500))
  isLoading.value = false
}

// Basculer le mode test
const toggleTestMode = async (method: PaymentMethod) => {
  isLoading.value = true
  method.isTestMode = !method.isTestMode
  await new Promise(resolve => setTimeout(resolve, 500))
  isLoading.value = false
}

// Ouvrir le modal de configuration
const openConfigModal = (method: PaymentMethod) => {
  selectedMethod.value = { ...method }
  showConfigModal.value = true
}

// Sauvegarder la configuration
const saveConfig = async () => {
  if (!selectedMethod.value) return
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const index = methods.value.findIndex(m => m.id === selectedMethod.value!.id)
  if (index !== -1) {
    methods.value[index] = { ...selectedMethod.value }
  }
  
  isLoading.value = false
  showConfigModal.value = false
  selectedMethod.value = null
}

// Obtenir l'icône SVG
const getIcon = (iconName: string) => {
  const icons: Record<string, string> = {
    'credit-card': 'M4 10h16M4 14h16M2 6h20v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z',
    'wallet': 'M20 12V8H6a2 2 0 010-4h8v4h4v4M20 12a2 2 0 01-2 2H8M20 12v4M4 12v4',
    'smartphone': 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    'phone': 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
    'building': 'M3 21h18M3 7v14M21 7v14M6 21V10M9 14V7M15 21V10M18 14v7M9 10h6M9 7h6',
  }
  return icons[iconName] || icons['credit-card']
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-green-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="20" y="4" width="16" height="16" rx="2" />
          <rect x="36" y="4" width="16" height="16" rx="2" />
          <rect x="4" y="20" width="16" height="16" rx="2" />
          <rect x="20" y="20" width="16" height="16" rx="2" />
          <rect x="36" y="20" width="16" height="16" rx="2" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Méthodes de paiement</h2>
        <p class="text-sm text-slate-500">Configurez les moyens de paiement disponibles</p>
      </div>
    </div>

    <!-- Liste des méthodes -->
    <div class="space-y-4">
      <div 
        v-for="method in methods" 
        :key="method.id"
        class="flex items-center justify-between p-5 rounded-xl border-2 transition-all"
        :class="method.isEnabled ? 'border-[#00ced1]/30 bg-[#00ced1]/5' : 'border-gray-100 bg-gray-50'"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="method.isEnabled ? 'bg-[#000099] text-white' : 'bg-gray-200 text-gray-400'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path :d="getIcon(method.icon)" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-slate-900">{{ method.name }}</h3>
            <p class="text-sm text-slate-500">{{ method.description }}</p>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs" :class="method.isTestMode ? 'text-amber-600' : 'text-slate-400'">
                {{ method.isTestMode ? '🔶 Mode test' : '🟢 Mode production' }}
              </span>
              <span class="text-xs text-slate-400">
                Frais: {{ method.fees }}%
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Toggle mode test -->
          <button
            @click="toggleTestMode(method)"
            :disabled="isLoading"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition"
            :class="method.isTestMode ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            :title="method.isTestMode ? 'Désactiver le mode test' : 'Activer le mode test'"
          >
            Test
          </button>

          <!-- Activation -->
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              :checked="method.isEnabled" 
              @change="toggleMethod(method)"
              type="checkbox" 
              class="sr-only peer" 
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00ced1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ced1]"></div>
          </label>

          <!-- Configurer -->
          <button
            @click="openConfigModal(method)"
            class="p-2 rounded-lg hover:bg-gray-100 transition"
            title="Configurer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="128" cy="128" r="40" />
              <path d="M128 72v-16M128 200v-16M200 128h16M72 128h-16M178.34 77.66l-11.31 11.31M88.97 167.03l-11.31 11.31M178.34 178.34l-11.31-11.31M88.97 88.97L77.66 77.66" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de configuration -->
    <div v-if="showConfigModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Configurer {{ selectedMethod?.name }}</h3>
          
          <div v-if="selectedMethod" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <input
                v-model="selectedMethod.description"
                type="text"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Frais (%)</label>
              <input
                v-model.number="selectedMethod.fees"
                type="number"
                step="0.1"
                min="0"
                max="10"
                class="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-[#00ced1] outline-none transition"
              />
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 class="text-sm font-medium text-slate-900">Mode test</h4>
                <p class="text-xs text-slate-500">Activer pour les transactions de test</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  v-model="selectedMethod.isTestMode"
                  type="checkbox" 
                  class="sr-only peer" 
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ced1]"></div>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showConfigModal = false"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              @click="saveConfig"
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

