<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#1a2849] to-[#0B1220]"
  >
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur">
      <div class="mx-auto max-w-7xl px-6 py-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">
              Maintenance des Comptes
            </h1>
            <p class="mt-2 text-gray-400">
              Gérer la suppression automatique des comptes inactifs
            </p>
          </div>
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
    <div class="mx-auto max-w-7xl px-6 py-8">
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Sidebar -->
        <AdminSidebar />

        <!-- Content -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Inactivity Settings -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">
              Paramètres d'Inactivité
            </h2>

            <div class="space-y-4">
              <!-- Inactivity Threshold -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >Délai avant suppression automatique (en jours)</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    Nombre de jours sans connexion avant suppression du compte
                  </p>
                  <input
                    v-model.number="inactivityThresholdDays"
                    type="number"
                    min="30"
                    max="730"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>

              <!-- Warning Period -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >Période d'avertissement (en jours)</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    Envoyer un avertissement N jours avant la suppression
                  </p>
                  <input
                    v-model.number="warningPeriodDays"
                    type="number"
                    min="1"
                    :max="inactivityThresholdDays - 1"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>

              <!-- Enable/Disable Auto-deletion -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-white">
                      Suppression automatique
                    </h3>
                    <p class="mt-1 text-sm text-gray-400">
                      Activer la suppression automatique des comptes inactifs
                    </p>
                  </div>
                  <button
                    @click="autoDeletionEnabled = !autoDeletionEnabled"
                    :class="{
                      'bg-red-600': autoDeletionEnabled,
                      'bg-gray-700': !autoDeletionEnabled,
                    }"
                    class="relative inline-flex h-8 w-14 items-center rounded-full transition-all"
                  >
                    <span
                      :class="{
                        'translate-x-7': autoDeletionEnabled,
                        'translate-x-1': !autoDeletionEnabled,
                      }"
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
              </div>

              <!-- Data Export Before Deletion -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-white">
                      Exporter les données avant suppression
                    </h3>
                    <p class="mt-1 text-sm text-gray-400">
                      Créer une sauvegarde des données utilisateur avant
                      suppression
                    </p>
                  </div>
                  <button
                    @click="exportBeforeDeletion = !exportBeforeDeletion"
                    :class="{
                      'bg-cyan-600': exportBeforeDeletion,
                      'bg-gray-700': !exportBeforeDeletion,
                    }"
                    class="relative inline-flex h-8 w-14 items-center rounded-full transition-all"
                  >
                    <span
                      :class="{
                        'translate-x-7': exportBeforeDeletion,
                        'translate-x-1': !exportBeforeDeletion,
                      }"
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm">Comptes à risque</p>
                  <p class="mt-2 text-3xl font-bold text-orange-400">
                    {{ accountsAtRisk }}
                  </p>
                </div>
                <div class="rounded-lg bg-orange-500/20 p-3">
                  <svg
                    class="h-6 w-6 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4v2m0 4v2M6.938 3A9.001 9.001 0 0016.938 3m0 0a8.968 8.968 0 00-6.938-3m6.938 3h.001M19.5 13c0 4.478-2.239 8.42-5.637 10.758M4.5 13c0 4.478 2.239 8.42 5.637 10.758"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm">
                    En attente d'avertissement
                  </p>
                  <p class="mt-2 text-3xl font-bold text-blue-400">
                    {{ accountsPendingWarning }}
                  </p>
                </div>
                <div class="rounded-lg bg-blue-500/20 p-3">
                  <svg
                    class="h-6 w-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 1118 14.158V11a6 6 0 10-9 5.753v3.5M4.3 4.3a6 6 0 008.4 8.4m0-9.9a6 6 0 018.4 8.4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm">Supprimés ce mois</p>
                  <p class="mt-2 text-3xl font-bold text-red-400">
                    {{ deletedThisMonth }}
                  </p>
                </div>
                <div class="rounded-lg bg-red-500/20 p-3">
                  <svg
                    class="h-6 w-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Manual Deletion Section -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">
              Suppression Manuelle
            </h2>

            <div class="space-y-4">
              <p class="text-gray-400">
                Lancez une suppression manuelle des comptes inactifs. Cette
                action supprimera tous les comptes sans activité depuis plus de
                {{ inactivityThresholdDays }} jours.
              </p>

              <div
                class="rounded-lg bg-red-500/10 border border-red-500/30 p-4"
              >
                <p class="text-sm text-red-400">
                  <span class="font-bold">⚠️ Avertissement :</span> Cette action
                  est irréversible. Assurez-vous que les sauvegardes sont à jour
                  avant de procéder.
                </p>
              </div>

              <button
                @click="showDeleteConfirm = true"
                class="rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-all hover:bg-red-700"
              >
                Lancer la suppression manuelle
              </button>
            </div>
          </div>

          <!-- Deletion History -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">
              Historique des Suppressions
            </h2>

            <div class="overflow-x-auto">
              <table class="w-full text-sm text-gray-400">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="px-4 py-3 text-left font-medium">Date</th>
                    <th class="px-4 py-3 text-left font-medium">Type</th>
                    <th class="px-4 py-3 text-left font-medium">
                      Comptes supprimés
                    </th>
                    <th class="px-4 py-3 text-left font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="border-b border-gray-700/50 hover:bg-[#0B1220]/30 transition-all"
                  >
                    <td class="px-4 py-3">20 Jan 2026</td>
                    <td class="px-4 py-3">Automatique</td>
                    <td class="px-4 py-3">12</td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-block rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400"
                        >Complété</span
                      >
                    </td>
                  </tr>
                  <tr
                    class="border-b border-gray-700/50 hover:bg-[#0B1220]/30 transition-all"
                  >
                    <td class="px-4 py-3">15 Jan 2026</td>
                    <td class="px-4 py-3">Manuel</td>
                    <td class="px-4 py-3">5</td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-block rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400"
                        >Complété</span
                      >
                    </td>
                  </tr>
                  <tr
                    class="border-b border-gray-700/50 hover:bg-[#0B1220]/30 transition-all"
                  >
                    <td class="px-4 py-3">10 Jan 2026</td>
                    <td class="px-4 py-3">Automatique</td>
                    <td class="px-4 py-3">8</td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-block rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400"
                        >Complété</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4">
            <button
              class="rounded-lg border border-gray-700 px-6 py-2 font-medium text-gray-400 transition-all hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              class="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition-all hover:bg-cyan-700"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
    >
      <div
        class="rounded-lg bg-[#1a2849] border border-gray-800 p-6 w-full max-w-md"
      >
        <h3 class="text-xl font-bold text-white">Confirmer la suppression</h3>
        <p class="mt-4 text-gray-400">
          Êtes-vous certain de vouloir supprimer les comptes inactifs ? Cette
          action est irréversible.
        </p>
        <div class="mt-6 flex justify-end gap-4">
          <button
            @click="showDeleteConfirm = false"
            class="rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-400 transition-all hover:bg-gray-800"
          >
            Annuler
          </button>
          <button
            @click="confirmDeletion"
            class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-all hover:bg-red-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });

const inactivityThresholdDays = ref(365);
const warningPeriodDays = ref(30);
const autoDeletionEnabled = ref(true);
const exportBeforeDeletion = ref(true);
const showDeleteConfirm = ref(false);

const accountsAtRisk = ref(47);
const accountsPendingWarning = ref(23);
const deletedThisMonth = ref(12);

const confirmDeletion = () => {
  showDeleteConfirm.value = false;
  // TODO: Call API to delete inactive accounts
};
</script>
