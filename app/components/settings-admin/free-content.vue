<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">
            Contenu gratuit & Marketing
          </h1>
          <p class="mt-2 text-sm text-gray-400">
            Paramètres d'accès gratuit et de conversion
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
      <!-- Leçons gratuites -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Leçons gratuites</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre de leçons gratuites par langue
            </label>
            <input
              type="number"
              value="5"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre de niveaux gratuits
            </label>
            <input
              type="number"
              value="1"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Accès et inscription -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Accès gratuit</h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Accès sans inscription</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Inscription obligatoire pour la sauvegarde de progression</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Test de niveau gratuit</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Aperçu audio/vidéo sans inscription</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
        </div>
      </div>

      <!-- Contenu gratuit par type -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Types de contenu gratuit
        </h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Vocabulaire de base</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Phrases usuelles</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Dialogues simples</span>
            <input type="checkbox" class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Exercices basiques</span>
            <input type="checkbox" checked class="rounded" />
          </div>
        </div>
      </div>

      <!-- Stratégie de conversion -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Stratégie de conversion
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              CTA après (leçons) leçons gratuites
            </label>
            <input
              type="number"
              value="3"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Fréquence des rappels (heures)
            </label>
            <input
              type="number"
              value="24"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Période d'essai gratuit -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Essai gratuit</h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Activer la période d'essai gratuit</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Durée de l'essai (jours)
            </label>
            <input
              type="number"
              value="7"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Plan offert lors de l'essai
            </label>
            <select
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option>Plan Premium</option>
              <option>Plan Intermédiaire</option>
              <option>Plan Gratuit</option>
            </select>
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
// Configuration du contenu gratuit
</script>
