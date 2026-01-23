<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#1a2849] to-[#0B1220]"
  >
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur">
      <div class="mx-auto max-w-7xl px-6 py-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Paramètres Globaux</h1>
            <p class="mt-2 text-gray-400">
              Configurez les paramètres généraux de la plateforme
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
          <!-- Timezone Settings -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">Localisation</h2>

            <div class="space-y-4">
              <!-- Timezone -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white">Fuseau horaire</span>
                  <p class="mt-1 text-sm text-gray-400">
                    Fuseau horaire par défaut de la plateforme
                  </p>
                  <select
                    v-model="timezone"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  >
                    <!-- UTC -->
                    <option value="UTC">
                      UTC (Coordinated Universal Time)
                    </option>

                    <!-- Europe -->
                    <option value="Europe/London">
                      Europe/London (GMT+0/+1)
                    </option>
                    <option value="Europe/Paris">
                      Europe/Paris (GMT+1/+2)
                    </option>
                    <option value="Europe/Berlin">
                      Europe/Berlin (GMT+1/+2)
                    </option>

                    <!-- Amérique -->
                    <option value="America/New_York">
                      America/New_York (EST/EDT)
                    </option>
                    <option value="America/Los_Angeles">
                      America/Los_Angeles (PST/PDT)
                    </option>

                    <!-- Asie -->
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    <option value="Asia/Shanghai">Asia/Shanghai (CST)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>

                    <!-- Afrique -->
                    <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                    <option value="Africa/Johannesburg">
                      Africa/Johannesburg (SAST)
                    </option>
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="Africa/Accra">Africa/Accra (GMT)</option>
                    <option value="Africa/Ouagadougou">
                      Africa/Ouagadougou (GMT)
                    </option>
                    <option value="Africa/Abidjan">Africa/Abidjan (GMT)</option>

                    <!-- Australie / Océanie -->
                    <option value="Australia/Sydney">
                      Australia/Sydney (AEDT)
                    </option>
                  </select>
                </label>
              </div>

              <!-- Default Language -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white">Langue par défaut</span>
                  <p class="mt-1 text-sm text-gray-400">
                    Langue d'interface par défaut pour les nouveaux utilisateurs
                  </p>
                  <select
                    v-model="defaultLanguage"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                  </select>
                </label>
              </div>

              <!-- Date Format -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white">Format de date</span>
                  <p class="mt-1 text-sm text-gray-400">
                    Format d'affichage des dates sur la plateforme
                  </p>
                  <select
                    v-model="dateFormat"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (20/01/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (01/20/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2026-01-20)</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY (20-01-2026)</option>
                  </select>
                </label>
              </div>

              <!-- Time Format -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white">Format d'heure</span>
                  <p class="mt-1 text-sm text-gray-400">
                    Format d'affichage des heures sur la plateforme
                  </p>
                  <select
                    v-model="timeFormat"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  >
                    <option value="12">Format 12 heures (HH:MM AM/PM)</option>
                    <option value="24">Format 24 heures (HH:MM)</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <!-- Platform Settings -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">
              Paramètres de la Plateforme
            </h2>

            <div class="space-y-4">
              <!-- Platform Name -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >Nom de la plateforme</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    Nom affiché dans les communications
                  </p>
                  <input
                    v-model="platformName"
                    type="text"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>

              <!-- Support Email -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white">Email de support</span>
                  <p class="mt-1 text-sm text-gray-400">
                    Adresse email pour les demandes de support
                  </p>
                  <input
                    v-model="supportEmail"
                    type="email"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>

              <!-- Support URL -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >URL du centre d'aide</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    Lien vers votre centre d'aide/support
                  </p>
                  <input
                    v-model="supportUrl"
                    type="url"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>

              <!-- Max Concurrent Sessions -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >Sessions concurrentes par utilisateur</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    Nombre maximum de connexions simultanées par utilisateur
                  </p>
                  <input
                    v-model.number="maxConcurrentSessions"
                    type="number"
                    min="1"
                    max="10"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>
            </div>
          </div>

          <!-- Maintenance Settings -->
          <div class="rounded-lg bg-[#1a2849] p-6 border border-gray-800">
            <h2 class="text-xl font-bold text-white mb-6">Maintenance</h2>

            <div class="space-y-4">
              <!-- Maintenance Mode -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-white">Mode maintenance</h3>
                    <p class="mt-1 text-sm text-gray-400">
                      Activer le mode maintenance (accès administrateur
                      uniquement)
                    </p>
                  </div>
                  <button
                    @click="maintenanceMode = !maintenanceMode"
                    :class="{
                      'bg-red-600': maintenanceMode,
                      'bg-gray-700': !maintenanceMode,
                    }"
                    class="relative inline-flex h-8 w-14 items-center rounded-full transition-all"
                  >
                    <span
                      :class="{
                        'translate-x-7': maintenanceMode,
                        'translate-x-1': !maintenanceMode,
                      }"
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition-all"
                    />
                  </button>
                </div>
              </div>

              <!-- Maintenance Message -->
              <div
                v-if="maintenanceMode"
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >Message de maintenance</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    Message affiché aux utilisateurs en mode maintenance
                  </p>
                  <textarea
                    v-model="maintenanceMessage"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                    rows="4"
                  ></textarea>
                </label>
              </div>

              <!-- Scheduled Backups -->
              <div
                class="rounded-lg bg-[#0B1220]/50 p-4 border border-gray-700"
              >
                <label class="block">
                  <span class="font-medium text-white"
                    >Heure des sauvegardes automatiques</span
                  >
                  <p class="mt-1 text-sm text-gray-400">
                    L'heure à laquelle effectuer les sauvegardes quotidiennes
                  </p>
                  <input
                    v-model="backupTime"
                    type="time"
                    class="mt-3 w-full rounded-lg bg-[#0B1220] px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </label>
              </div>

              <!-- Last Backup -->
              <div
                class="rounded-lg bg-green-500/10 p-4 border border-green-500/30"
              >
                <p class="text-sm text-green-400">
                  <span class="font-bold">✓ Dernière sauvegarde :</span> 20
                  Janvier 2026 à 03:00
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between gap-4">
            <div class="flex gap-4">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SettingsDropdown from "~/components/SettingsDropdown.vue";

definePageMeta({ layout: "default" });

// Localization
const timezone = ref("Europe/Paris");
const defaultLanguage = ref("fr");
const dateFormat = ref("DD/MM/YYYY");
const timeFormat = ref("24");

// Platform Settings
const platformName = ref("LinguaLearn");
const supportEmail = ref("support@lingualearn.com");
const supportUrl = ref("https://help.lingualearn.com");
const maxConcurrentSessions = ref(3);

// Maintenance
const maintenanceMode = ref(false);
const maintenanceMessage = ref(
  "La plateforme est actuellement en maintenance. Veuillez réessayer plus tard.",
);
const backupTime = ref("03:00");
</script>
