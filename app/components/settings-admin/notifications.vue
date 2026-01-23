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
              Paramètres de Notifications
            </h1>
            <p class="mt-2 text-gray-400">
              Configurer les notifications automatiques de la plateforme
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
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-6 py-8">
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Sidebar -->
        <AdminSidebar />

        <!-- Content -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Notification Types Section -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">
              Types de Notifications
            </h2>

            <div class="space-y-4">
              <!-- New Courses Notification -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700 hover:border-cyan-500/30 transition-all"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="rounded-lg bg-cyan-500/20 p-2">
                        <svg
                          class="h-5 w-5 text-cyan-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6.253v13m0-13C6.248 6.253 2.178 7.664 2.178 9.004c0 1.34 4.07 2.75 9.822 2.75s9.822-1.41 9.822-2.75c0-1.34-4.07-2.751-9.822-2.751z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-medium text-white">Nouveaux cours</h3>
                        <p class="text-sm text-gray-400">
                          Notifier les utilisateurs quand un nouveau cours est
                          publié
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="toggleNotification('newCourses')"
                    :class="{
                      'bg-cyan-600': notificationSettings.newCourses,
                      'bg-gray-700': !notificationSettings.newCourses,
                    }"
                    class="relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-all"
                  >
                    <span
                      :class="{
                        'translate-x-7': notificationSettings.newCourses,
                        'translate-x-1': !notificationSettings.newCourses,
                      }"
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
                <div
                  v-if="notificationSettings.newCourses"
                  class="mt-4 ml-11 flex gap-2"
                >
                  <label class="flex items-center gap-2 text-sm">
                    <input type="radio" name="newCourses" class="w-4 h-4" />
                    <span class="text-gray-400">Email</span>
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="radio" name="newCourses" class="w-4 h-4" />
                    <span class="text-gray-400">Push</span>
                  </label>
                </div>
              </div>

              <!-- New Exercises Notification -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700 hover:border-cyan-500/30 transition-all"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="rounded-lg bg-orange-500/20 p-2">
                        <svg
                          class="h-5 w-5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-medium text-white">
                          Nouveaux exercices
                        </h3>
                        <p class="text-sm text-gray-400">
                          Notifier les utilisateurs quand de nouveaux exercices
                          sont ajoutés
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="toggleNotification('newExercises')"
                    :class="{
                      'bg-cyan-600': notificationSettings.newExercises,
                      'bg-gray-700': !notificationSettings.newExercises,
                    }"
                    class="relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-all"
                  >
                    <span
                      :class="{
                        'translate-x-7': notificationSettings.newExercises,
                        'translate-x-1': !notificationSettings.newExercises,
                      }"
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
                <div
                  v-if="notificationSettings.newExercises"
                  class="mt-4 ml-11 flex gap-2"
                >
                  <label class="flex items-center gap-2 text-sm">
                    <input type="radio" name="newExercises" class="w-4 h-4" />
                    <span class="text-gray-400">Email</span>
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input type="radio" name="newExercises" class="w-4 h-4" />
                    <span class="text-gray-400">Push</span>
                  </label>
                </div>
              </div>

              <!-- Subscription Renewal Notification -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700 hover:border-cyan-500/30 transition-all"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="rounded-lg bg-blue-500/20 p-2">
                        <svg
                          class="h-5 w-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-medium text-white">
                          Renouvellement d'abonnement
                        </h3>
                        <p class="text-sm text-gray-400">
                          Alerter les utilisateurs avant le renouvellement
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="toggleNotification('subscriptionRenewal')"
                    :class="{
                      'bg-cyan-600': notificationSettings.subscriptionRenewal,
                      'bg-gray-700': !notificationSettings.subscriptionRenewal,
                    }"
                    class="relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-all"
                  >
                    <span
                      :class="{
                        'translate-x-7':
                          notificationSettings.subscriptionRenewal,
                        'translate-x-1':
                          !notificationSettings.subscriptionRenewal,
                      }"
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
                <div
                  v-if="notificationSettings.subscriptionRenewal"
                  class="mt-4 ml-11 flex gap-2"
                >
                  <label class="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="subscriptionRenewal"
                      class="w-4 h-4"
                    />
                    <span class="text-gray-400">Email</span>
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="subscriptionRenewal"
                      class="w-4 h-4"
                    />
                    <span class="text-gray-400">Push</span>
                  </label>
                </div>
              </div>

              <!-- Inactive Account Deletion Notification -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700 hover:border-cyan-500/30 transition-all"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="rounded-lg bg-red-500/20 p-2">
                        <svg
                          class="h-5 w-5 text-red-400"
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
                      <div>
                        <h3 class="font-medium text-white">
                          Suppression de comptes inactifs
                        </h3>
                        <p class="text-sm text-gray-400">
                          Alerter les utilisateurs avant suppression pour
                          inactivité
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="toggleNotification('inactiveAccountDeletion')"
                    :class="{
                      'bg-cyan-600':
                        notificationSettings.inactiveAccountDeletion,
                      'bg-gray-700':
                        !notificationSettings.inactiveAccountDeletion,
                    }"
                    class="relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-all"
                  >
                    <span
                      :class="{
                        'translate-x-7':
                          notificationSettings.inactiveAccountDeletion,
                        'translate-x-1':
                          !notificationSettings.inactiveAccountDeletion,
                      }"
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
                <div
                  v-if="notificationSettings.inactiveAccountDeletion"
                  class="mt-4 ml-11 flex gap-2"
                >
                  <label class="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="inactiveAccountDeletion"
                      class="w-4 h-4"
                    />
                    <span class="text-gray-400">Email</span>
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="inactiveAccountDeletion"
                      class="w-4 h-4"
                    />
                    <span class="text-gray-400">Push</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Global Notification Settings -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">
              Paramètres Globaux
            </h2>

            <div class="space-y-4">
              <!-- Enable/Disable All Notifications -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-white">
                      Activer toutes les notifications
                    </h3>
                    <p class="mt-1 text-sm text-gray-400">
                      Activer/désactiver l'ensemble du système de notifications
                    </p>
                  </div>
                  <button
                    @click="
                      globalNotificationsEnabled = !globalNotificationsEnabled
                    "
                    :class="{
                      'bg-cyan-600': globalNotificationsEnabled,
                      'bg-gray-700': !globalNotificationsEnabled,
                    }"
                    class="relative inline-flex h-8 w-14 items-center rounded-full transition-all"
                  >
                    <span
                      :class="{
                        'translate-x-7': globalNotificationsEnabled,
                        'translate-x-1': !globalNotificationsEnabled,
                      }"
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
              </div>

              <!-- Notification Delay -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >Délai d'envoi des notifications (en secondes)</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    Délai avant d'envoyer les notifications
                  </p>
                  <input
                    v-model.number="notificationDelay"
                    type="number"
                    min="0"
                    max="3600"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>

              <!-- Max Notifications per Day -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >Notifications maximales par jour par utilisateur</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    Limite d'envoi pour éviter le spam
                  </p>
                  <input
                    v-model.number="maxNotificationsPerDay"
                    type="number"
                    min="1"
                    max="100"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import SettingsDropdown from "~/components/SettingsDropdown.vue";

definePageMeta({ layout: "default" });

const notificationSettings = reactive({
  newCourses: true,
  newExercises: true,
  subscriptionRenewal: true,
  inactiveAccountDeletion: true,
});

const globalNotificationsEnabled = ref(true);
const notificationDelay = ref(60);
const maxNotificationsPerDay = ref(10);

const toggleNotification = (key: string) => {
  notificationSettings[key as keyof typeof notificationSettings] =
    !notificationSettings[key as keyof typeof notificationSettings];
};
</script>
