<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Monétisation avancée</h1>
          <p class="mt-2 text-sm text-gray-400">
            Gérer les codes promo, réductions et offres spéciales
          </p>
        </div>
        <div class="flex items-center gap-3">
          <SettingsDropdown />
          <NuxtLink
            to="/admin/settings"
            class="rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-400 transition-all hover:bg-gray-800 whitespace-nowrap"
          >
            Retour
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Codes promo -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-white">Codes promo</h2>
          <button
            class="rounded-lg bg-cyan-500/20 px-3 py-1 text-sm font-medium text-cyan-400 hover:bg-cyan-500/30 transition-all"
          >
            + Nouveau code
          </button>
        </div>
        <div class="space-y-2 text-sm">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <div>
              <p class="font-medium text-white">NOEL2024</p>
              <p class="text-xs text-gray-500">-20% jusqu'au 31/12/2024</p>
            </div>
            <button class="text-gray-400 hover:text-gray-300">Éditer</button>
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <div>
              <p class="font-medium text-white">PROMO50</p>
              <p class="text-xs text-gray-500">
                -50% - Limite: 100 utilisations
              </p>
            </div>
            <button class="text-gray-400 hover:text-gray-300">Éditer</button>
          </div>
        </div>
      </div>

      <!-- Réductions par période -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Réductions temporaires
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Réduction pour nouvelle inscription (%)
            </label>
            <input
              type="number"
              value="10"
              class="w-full md:w-32 rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Réduction pour réabonnement (%)
            </label>
            <input
              type="number"
              value="15"
              class="w-full md:w-32 rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Offres par langue/pays -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Offres par langue/pays
        </h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <div>
              <p class="font-medium text-white">Afrique de l'Ouest</p>
              <p class="text-xs text-gray-500">-30% sur tous les plans</p>
            </div>
            <button class="text-gray-400 hover:text-gray-300 text-sm">
              Éditer
            </button>
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <div>
              <p class="font-medium text-white">Asie du Sud</p>
              <p class="text-xs text-gray-500">-25% sur les plans annuels</p>
            </div>
            <button class="text-gray-400 hover:text-gray-300 text-sm">
              Éditer
            </button>
          </div>
        </div>
      </div>

      <!-- Limites d'utilisation -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Limites d'utilisation</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre max de codes actifs
            </label>
            <input
              type="number"
              value="10"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Cumul autorisé de réductions (%)
            </label>
            <input
              type="number"
              value="50"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Bouton de sauvegarde -->
      <div class="flex justify-end gap-3">
        <button
          class="rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-400 hover:bg-gray-800 transition-all"
        >
          Annuler
        </button>
        <button
          class="rounded-lg bg-cyan-500/20 px-4 py-2 font-medium text-cyan-400 hover:bg-cyan-500/30 transition-all"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsDropdown from "~/components/SettingsDropdown.vue";
// Configuration de la monétisation
</script>
