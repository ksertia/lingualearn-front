<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Paramètres légaux</h1>
          <p class="mt-2 text-sm text-gray-400">
            Gérer les documents légaux et la conformité
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
      <!-- Documents légaux -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Documents légaux</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              CGU (Conditions Générales d'Utilisation)
            </label>
            <textarea
              placeholder="Insérer le contenu des CGU..."
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              rows="4"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Version 1.0 - Dernière mise à jour: 28 Jan 2026
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Politique de confidentialité
            </label>
            <textarea
              placeholder="Insérer la politique de confidentialité..."
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              rows="4"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Version 1.0 - Dernière mise à jour: 28 Jan 2026
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Conditions de paiement
            </label>
            <textarea
              placeholder="Insérer les conditions de paiement..."
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              rows="4"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Version 1.0 - Dernière mise à jour: 28 Jan 2026
            </p>
          </div>
        </div>
      </div>

      <!-- Consentements utilisateur -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Consentements requis</h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Consentement aux CGU obligatoire</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Consentement à la politique de confidentialité</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Consentement au marketing (emails)</span
            >
            <input type="checkbox" class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Consentement analytics</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Consentement cookies</span>
            <input type="checkbox" checked class="rounded" />
          </div>
        </div>
      </div>

      <!-- Droit à l'oubli -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Droit à l'oubli & RGPD
        </h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Permettre la suppression de compte</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Permettre l'export des données personnelles</span
            >
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300"
              >Suppression automatique après inactivité</span
            >
            <input type="checkbox" class="rounded" />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Délai de conservation des données (jours)
          </label>
          <input
            type="number"
            value="365"
            class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
          />
          <p class="text-xs text-gray-500 mt-1">Après suppression du compte</p>
        </div>
      </div>

      <!-- Conformité régionale -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Conformité régionale</h2>
        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Conforme RGPD (UE)</span>
            <input type="checkbox" checked class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Conforme CCPA (Californie)</span>
            <input type="checkbox" class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Conforme LGPD (Brésil)</span>
            <input type="checkbox" class="rounded" />
          </div>
          <div
            class="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg"
          >
            <span class="text-gray-300">Vérification d'âge (13+ ou 18+)</span>
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
import SettingsDropdown from "~/components/old code/SettingsDropdown.vue";
// Configuration des paramètres légaux
</script>
