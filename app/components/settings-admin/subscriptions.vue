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
              Gestion des Plans d'Abonnement
            </h1>
            <p class="mt-2 text-gray-400">
              Créer, modifier et supprimer les plans d'abonnement
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
          <!-- Add New Plan Button -->
          <div class="flex justify-end">
            <button
              @click="openAddPlanModal"
              class="inline-flex items-center rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition-all hover:bg-cyan-700"
            >
              <svg
                class="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nouveau Plan
            </button>
          </div>

          <!-- Plans Grid -->
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <!-- Basic Plan -->
            <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
              <h3 class="text-lg font-bold text-white">Plan Basic</h3>
              <p class="mt-1 text-gray-400">Plan d'entrée</p>

              <div class="mt-4 space-y-2">
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Prix :</span> 9,99€/mois
                </p>
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Utilisateurs :</span>
                  Illimité
                </p>
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Support :</span> Email
                </p>
              </div>

              <div class="mt-6 flex gap-2">
                <button
                  @click="editPlan('basic')"
                  class="flex-1 rounded-lg border border-cyan-600 px-4 py-2 font-medium text-cyan-400 transition-all hover:bg-cyan-600/10"
                >
                  Modifier
                </button>
                <button
                  @click="deletePlan('basic')"
                  class="flex-1 rounded-lg border border-red-600 px-4 py-2 font-medium text-red-400 transition-all hover:bg-red-600/10"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <!-- Pro Plan -->
            <div class="rounded-lg bg-[#1a2849] p-6 border border-cyan-600/30">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-bold text-white">Plan Pro</h3>
                  <p class="mt-1 text-gray-400">Plan populaire</p>
                </div>
                <span
                  class="rounded-lg bg-cyan-500/20 px-2 py-1 text-xs font-bold text-cyan-400"
                >
                  Populaire
                </span>
              </div>

              <div class="mt-4 space-y-2">
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Prix :</span> 29,99€/mois
                </p>
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Utilisateurs :</span> 50
                </p>
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Support :</span> Email +
                  Chat
                </p>
              </div>

              <div class="mt-6 flex gap-2">
                <button
                  @click="editPlan('pro')"
                  class="flex-1 rounded-lg border border-cyan-600 px-4 py-2 font-medium text-cyan-400 transition-all hover:bg-cyan-600/10"
                >
                  Modifier
                </button>
                <button
                  @click="deletePlan('pro')"
                  class="flex-1 rounded-lg border border-red-600 px-4 py-2 font-medium text-red-400 transition-all hover:bg-red-600/10"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <!-- Premium Plan -->
            <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
              <h3 class="text-lg font-bold text-white">Plan Premium</h3>
              <p class="mt-1 text-gray-400">Plan entreprise</p>

              <div class="mt-4 space-y-2">
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Prix :</span> Sur devis
                </p>
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Utilisateurs :</span>
                  Illimité
                </p>
                <p class="text-sm text-gray-400">
                  <span class="font-medium text-white">Support :</span>
                  Prioritaire 24/7
                </p>
              </div>

              <div class="mt-6 flex gap-2">
                <button
                  @click="editPlan('premium')"
                  class="flex-1 rounded-lg border border-cyan-600 px-4 py-2 font-medium text-cyan-400 transition-all hover:bg-cyan-600/10"
                >
                  Modifier
                </button>
                <button
                  @click="deletePlan('premium')"
                  class="flex-1 rounded-lg border border-red-600 px-4 py-2 font-medium text-red-400 transition-all hover:bg-red-600/10"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <!-- Plan Parameters Section -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">
              Paramètres des Plans
            </h2>

            <div class="space-y-4">
              <!-- Auto Renewal -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <label class="font-medium text-white">
                      Renouvellement automatique
                    </label>
                    <p class="mt-1 text-sm text-gray-400">
                      Activer le renouvellement automatique par défaut
                    </p>
                  </div>
                  <button
                    @click="autoRenewal = !autoRenewal"
                    :class="[
                      'relative h-8 w-14 rounded-full transition-all',
                      autoRenewal ? 'bg-cyan-600' : 'bg-gray-700',
                    ]"
                  >
                    <span
                      :class="[
                        'absolute h-6 w-6 rounded-full bg-white transition-all',
                        autoRenewal ? 'right-1 top-1' : 'left-1 top-1',
                      ]"
                    />
                  </button>
                </div>
              </div>

              <!-- Expiration Alerts -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <label class="font-medium text-white">
                      Alertes d'expiration
                    </label>
                    <p class="mt-1 text-sm text-gray-400">
                      Envoyer des alertes avant expiration
                    </p>
                  </div>
                  <button
                    @click="expirationAlerts = !expirationAlerts"
                    :class="[
                      'relative h-8 w-14 rounded-full transition-all',
                      expirationAlerts ? 'bg-cyan-600' : 'bg-gray-700',
                    ]"
                  >
                    <span
                      :class="[
                        'absolute h-6 w-6 rounded-full bg-white transition-all',
                        expirationAlerts ? 'right-1 top-1' : 'left-1 top-1',
                      ]"
                    />
                  </button>
                </div>

                <label v-if="expirationAlerts" class="block">
                  <span class="text-sm font-medium text-white">
                    Jours avant alerte
                  </span>
                  <input
                    v-model.number="daysBeforeAlert"
                    type="number"
                    min="1"
                    max="30"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>

              <!-- Disable Expired Accounts -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <label class="font-medium text-white">
                      Désactiver les comptes expirés
                    </label>
                    <p class="mt-1 text-sm text-gray-400">
                      Bloquer l'accès au compte après expiration
                    </p>
                  </div>
                  <button
                    @click="disableExpiredAccounts = !disableExpiredAccounts"
                    :class="[
                      'relative h-8 w-14 rounded-full transition-all',
                      disableExpiredAccounts ? 'bg-cyan-600' : 'bg-gray-700',
                    ]"
                  >
                    <span
                      :class="[
                        'absolute h-6 w-6 rounded-full bg-white transition-all',
                        disableExpiredAccounts
                          ? 'right-1 top-1'
                          : 'left-1 top-1',
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4">
            <button
              @click="resetSettings"
              class="rounded-lg border border-gray-700 px-6 py-2 font-medium text-gray-400 transition-all hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              @click="saveSettings"
              class="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition-all hover:bg-cyan-700"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });

const showAddPlanForm = ref(false);
const autoRenewal = ref(true);
const expirationAlerts = ref(true);
const daysBeforeAlert = ref(7);
const disableExpiredAccounts = ref(true);

const openAddPlanModal = () => {
  showAddPlanForm.value = true;
  console.log("Formulaire d'ajout de plan ouvert");
};

const editPlan = (planId: string) => {
  console.log(`Édition du plan: ${planId}`);
  // TODO: Implémenter l'édition du plan
};

const deletePlan = (planId: string) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le plan ${planId} ?`)) {
    console.log(`Suppression du plan: ${planId}`);
    // TODO: Appeler l'API pour supprimer le plan
  }
};

const saveSettings = () => {
  console.log("Paramètres sauvegardés:", {
    autoRenewal: autoRenewal.value,
    expirationAlerts: expirationAlerts.value,
    daysBeforeAlert: daysBeforeAlert.value,
    disableExpiredAccounts: disableExpiredAccounts.value,
  });
  // TODO: Appeler l'API pour sauvegarder les paramètres
};

const resetSettings = () => {
  autoRenewal.value = true;
  expirationAlerts.value = true;
  daysBeforeAlert.value = 7;
  disableExpiredAccounts.value = true;
  console.log("Paramètres réinitialisés");
};
</script>
