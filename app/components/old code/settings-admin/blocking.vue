<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">
            Blocage & Déblocage automatique
          </h1>
          <p class="mt-2 text-sm text-gray-400">
            Gérer le comportement lors de l'expiration de l'abonnement
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
      <!-- Configuration du blocage -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Paramètres de blocage</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Délai avant blocage (jours)
            </label>
            <input
              type="number"
              value="7"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
            <p class="text-xs text-gray-500 mt-1">
              Après expiration de l'abonnement
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Délai de suppression (jours)
            </label>
            <input
              type="number"
              value="30"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
            <p class="text-xs text-gray-500 mt-1">
              Avant suppression définitive
            </p>
          </div>
        </div>
      </div>

      <!-- Messages d'avertissement -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Messages affichés</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Message lors du blocage
            </label>
            <textarea
              placeholder="Votre abonnement a expiré. Veuillez renouveler votre plan pour continuer..."
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Message de rappel (avant expiration)
            </label>
            <textarea
              placeholder="Votre abonnement expire bientôt. Pensez à renouveler pour accéder à tous les contenus..."
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Comportements automatiques -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Comportements automatiques
        </h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Renouvellement automatique</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Période de grâce (accès limité)</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Accès en lecture seule après expiration</span
            >
            <input type="checkbox" class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Sauvegarde automatique des données</span
            >
            <input type="checkbox" checked class="rounded" />
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
import SettingsDropdown from "~/components/old code/SettingsDropdown.vue";
// Configuration du blocage/déblocage
</script>
