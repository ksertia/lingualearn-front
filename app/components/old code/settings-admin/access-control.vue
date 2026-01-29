<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">
            Contrôle d'accès par plan
          </h1>
          <p class="mt-2 text-sm text-gray-400">
            Définir les droits d'accès pour chaque plan d'abonnement
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
      <!-- Plan Gratuit -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Plan Gratuit</h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Nombre de langues accessibles</span>
            <input
              type="number"
              value="1"
              class="w-16 rounded border border-gray-600 bg-[#1a2849] px-2 py-1 text-white"
            />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Nombre de niveaux accessibles</span>
            <input
              type="number"
              value="1"
              class="w-16 rounded border border-gray-600 bg-[#1a2849] px-2 py-1 text-white"
            />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Exercices par jour</span>
            <input
              type="number"
              value="5"
              class="w-16 rounded border border-gray-600 bg-[#1a2849] px-2 py-1 text-white"
            />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Accès hors ligne</span>
            <input type="checkbox" class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Téléchargement des ressources</span>
            <input type="checkbox" class="rounded" />
          </div>
        </div>
      </div>

      <!-- Plan Premium -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Plan Premium</h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Nombre de langues accessibles</span>
            <input
              type="number"
              value="10"
              class="w-16 rounded border border-gray-600 bg-[#1a2849] px-2 py-1 text-white"
            />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Nombre de niveaux accessibles</span>
            <input
              type="number"
              value="10"
              class="w-16 rounded border border-gray-600 bg-[#1a2849] px-2 py-1 text-white"
            />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Exercices par jour</span>
            <input
              type="number"
              value="999"
              class="w-16 rounded border border-gray-600 bg-[#1a2849] px-2 py-1 text-white"
            />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Accès hors ligne</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Téléchargement des ressources</span>
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
// Configuration du contrôle d'accès
</script>
