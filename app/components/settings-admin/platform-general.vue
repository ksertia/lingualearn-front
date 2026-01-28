<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Paramètres généraux</h1>
          <p class="mt-2 text-sm text-gray-400">
            Configuration globale de la plateforme
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
      <!-- Informations générales -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Informations générales
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nom de l'application
            </label>
            <input
              type="text"
              placeholder="Ex: LinguaLearn"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Logo (URL)
            </label>
            <input
              type="url"
              placeholder="https://..."
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Langue par défaut
            </label>
            <select
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option>Français</option>
              <option>Anglais</option>
              <option>Espagnol</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Devise
            </label>
            <select
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option>EUR (€)</option>
              <option>USD ($)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Configuration système -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Configuration système</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Fuseau horaire
            </label>
            <select
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option>Europe/Paris (GMT+1)</option>
              <option>Europe/London (GMT+0)</option>
              <option>America/New_York (GMT-5)</option>
              <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="Africa/Accra">Africa/Accra (GMT)</option>
                    <option value="Africa/Ouagadougou">
                      Africa/Ouagadougou (GMT)
                    </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Mode maintenance
            </label>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="maintenance" class="rounded" />
              <label for="maintenance" class="text-sm text-gray-400">
                Activer le mode maintenance
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Inscription & Paiements -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Inscription & Paiements
        </h2>
        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Inscriptions autorisées</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Paiements activés</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Inscription sans paiement initial</span>
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
import SettingsDropdown from "~/components/SettingsDropdown.vue";
// Configuration des paramètres généraux
</script>
