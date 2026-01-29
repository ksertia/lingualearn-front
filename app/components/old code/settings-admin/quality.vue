<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Qualité pédagogique</h1>
          <p class="mt-2 text-sm text-gray-400">
            Paramètres de seuils et de validation d'apprentissage
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
      <!-- Seuils de validation -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Seuils de validation</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Score minimum pour valider une leçon (%)
            </label>
            <input
              type="number"
              value="70"
              min="0"
              max="100"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Score pour débloquer le niveau suivant (%)
            </label>
            <input
              type="number"
              value="80"
              min="0"
              max="100"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Tentatives et durées -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Limites de tentatives</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Tentatives maximales par exercice
            </label>
            <input
              type="number"
              value="3"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Temps minimum par leçon (minutes)
            </label>
            <input
              type="number"
              value="5"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Cooldown après échec (minutes)
            </label>
            <input
              type="number"
              value="15"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Exercices par jour (limite)
            </label>
            <input
              type="number"
              value="20"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Paramètres de progression -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Paramètres de progression
        </h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Autoriser le saut de leçons</span>
            <input type="checkbox" class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Ordre obligatoire des leçons</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Verrouiller les niveaux futurs</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Permettre la révision des leçons validées</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
        </div>
      </div>

      <!-- Feedback automatique -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Feedback automatique</h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Afficher les réponses correctes immédiatement</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Proposer des ressources après échec</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Afficher la progression détaillée</span>
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
// Configuration de la qualité pédagogique
</script>
