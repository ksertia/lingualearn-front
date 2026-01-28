<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">
            Sécurité & Prévention des abus
          </h1>
          <p class="mt-2 text-sm text-gray-400">
            Paramètres de sécurité et de prévention des fraudes
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
      <!-- Connexions simultanées -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Connexions simultanées
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre max de connexions simultanées
            </label>
            <input
              type="number"
              value="3"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
            <p class="text-xs text-gray-500 mt-1">
              Par utilisateur et par plan
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Délai avant déconnexion (minutes)
            </label>
            <input
              type="number"
              value="30"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Limitation des tentatives -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Limitation des tentatives
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Tentatives de connexion avant blocage
            </label>
            <input
              type="number"
              value="5"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Durée du blocage (minutes)
            </label>
            <input
              type="number"
              value="15"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Protection des téléchargements -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Protection des téléchargements
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Limite de téléchargements par jour
            </label>
            <input
              type="number"
              value="20"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Taille max par fichier (Mo)
            </label>
            <input
              type="number"
              value="100"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Détection de partage de compte -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Détection de partage de compte
        </h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Détection d'adresses IP multiples</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Alerte sur géolocalisation anormale</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Détection d'accès simultanés à distance</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Chiffrement des données sensibles</span>
            <input type="checkbox" checked class="rounded" />
          </div>
        </div>
      </div>

      <!-- Actions de sécurité -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Actions automatiques</h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Bloquer les comptes suspects</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Envoyer alertes utilisateur</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Exiger vérification 2FA</span>
            <input type="checkbox" class="rounded" />
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
// Configuration de la sécurité
</script>
