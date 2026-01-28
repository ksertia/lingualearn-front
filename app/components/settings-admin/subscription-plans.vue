<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Plans d'abonnement</h1>
          <p class="mt-2 text-sm text-gray-400">
            Gérer les plans d'abonnement et leurs configurations
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
      <!-- Liste des plans existants -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-white">Plans actifs</h2>
          <button
            class="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white transition-all hover:bg-cyan-500"
          >
            + Nouveau plan
          </button>
        </div>

        <div class="space-y-3">
          <!-- Plan Gratuit -->
          <div class="border border-gray-600 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-white font-semibold">Plan Gratuit</h3>
                <p class="text-sm text-gray-400 mt-1">
                  Accès basique à 1 langue et 1 niveau
                </p>
                <div class="flex gap-4 mt-3 text-xs text-gray-400">
                  <span>💰 0 EUR</span>
                  <span>📅 Illimité</span>
                  <span>🎯 1 langue</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  class="rounded px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Éditer
                </button>
                <button
                  class="rounded px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <!-- Plan Premium -->
          <div class="border border-cyan-600/50 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-white font-semibold">Plan Premium</h3>
                <p class="text-sm text-gray-400 mt-1">
                  Accès complet à tous les contenus
                </p>
                <div class="flex gap-4 mt-3 text-xs text-gray-400">
                  <span>💰 9.99 EUR/mois</span>
                  <span>📅 Mensuel</span>
                  <span>🎯 15 langues</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  class="rounded px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Éditer
                </button>
                <button
                  class="rounded px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paramètres globaux -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Paramètres globaux</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Période de grâce (jours)
            </label>
            <input
              type="number"
              placeholder="7"
              value="7"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Renouvellement automatique
            </label>
            <input
              type="checkbox"
              checked
              class="w-4 h-4 rounded border-gray-600 bg-[#0B1220] accent-cyan-500 cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Connexions simultanées max
            </label>
            <input
              type="number"
              placeholder="3"
              value="3"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Sauvegarde des données auto
            </label>
            <input
              type="checkbox"
              checked
              class="w-4 h-4 rounded border-gray-600 bg-[#0B1220] accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <!-- Bouton d'enregistrement -->
      <div class="flex gap-3">
        <button
          class="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition-all hover:bg-cyan-500"
        >
          Enregistrer les modifications
        </button>
        <button
          class="rounded-lg border border-gray-700 px-6 py-2 font-medium text-gray-400 transition-all hover:bg-gray-800"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsDropdown from "~/components/SettingsDropdown.vue";
</script>

<style scoped></style>
