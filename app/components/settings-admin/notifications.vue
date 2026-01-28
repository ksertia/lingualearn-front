<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur mb-8">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Notifications</h1>
          <p class="mt-2 text-sm text-gray-400">
            Configurer les notifications système et les alertes
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
      <!-- Paramètres généraux -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Paramètres généraux</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="enabled"
              checked
              class="w-4 h-4 rounded border-gray-600 bg-[#0B1220] accent-cyan-500 cursor-pointer"
            />
            <label for="enabled" class="text-sm font-medium text-gray-300">
              Notifications activées
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Délai avant envoi (secondes)
            </label>
            <input
              type="number"
              placeholder="60"
              value="60"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Max notifications par utilisateur/jour
            </label>
            <input
              type="number"
              placeholder="10"
              value="10"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Horaires de notification -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Horaires de notification
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Heure de début
            </label>
            <input
              type="time"
              value="08:00"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Heure de fin
            </label>
            <input
              type="time"
              value="21:00"
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Fuseau horaire
            </label>
            <select
              class="w-full rounded-lg border border-gray-600 bg-[#0B1220] px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option>Europe/Paris</option>
              <option>Europe/London</option>
              <option>Europe/Berlin</option>
              <option>America/New_York</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Types de notifications -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">
          Types de notifications
        </h2>
        <div class="space-y-4">
          <!-- Nouveaux cours -->
          <div class="border border-gray-600 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-semibold">Nouveaux cours</h3>
                <p class="text-xs text-gray-500 mt-1">
                  Notifier les utilisateurs des nouveaux contenus
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="w-4 h-4 rounded border-gray-600 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- Nouveaux exercices -->
          <div class="border border-gray-600 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-semibold">Nouveaux exercices</h3>
                <p class="text-xs text-gray-500 mt-1">
                  Notifier des nouveaux exercices disponibles
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="w-4 h-4 rounded border-gray-600 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- Renouvellement abonnement -->
          <div class="border border-gray-600 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-semibold">
                  Renouvellement abonnement
                </h3>
                <p class="text-xs text-gray-500 mt-1">
                  Rappel avant renouvellement (7 jours avant)
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="w-4 h-4 rounded border-gray-600 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- Inactivité utilisateur -->
          <div class="border border-gray-600 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-semibold">Inactivité utilisateur</h3>
                <p class="text-xs text-gray-500 mt-1">
                  Alerte après 30 jours d'inactivité
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="w-4 h-4 rounded border-gray-600 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- Leçon déverrouillée -->
          <div class="border border-gray-600 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-semibold">Leçon déverrouillée</h3>
                <p class="text-xs text-gray-500 mt-1">
                  Notification immédiate après progression
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="w-4 h-4 rounded border-gray-600 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- Niveau complété -->
          <div class="border border-gray-600 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-semibold">Niveau complété</h3>
                <p class="text-xs text-gray-500 mt-1">
                  Félicitations après complétion d'un niveau
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="w-4 h-4 rounded border-gray-600 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- Suppression compte inactif -->
          <div class="border border-gray-600 rounded-lg p-4 bg-[#0B1220]/50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-semibold">
                  Suppression compte inactif
                </h3>
                <p class="text-xs text-gray-500 mt-1">
                  Alerte 30 jours avant suppression
                </p>
              </div>
              <input
                type="checkbox"
                checked
                class="w-4 h-4 rounded border-gray-600 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Canaux de notification -->
      <div class="rounded-lg border border-gray-700 bg-[#1a2849] p-6">
        <h2 class="text-lg font-bold text-white mb-4">Canaux disponibles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="email-channel"
              checked
              class="w-4 h-4 rounded border-gray-600 bg-[#0B1220] accent-cyan-500 cursor-pointer"
            />
            <label
              for="email-channel"
              class="text-sm font-medium text-gray-300"
            >
              ✉️ Email
            </label>
          </div>
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="push-channel"
              checked
              class="w-4 h-4 rounded border-gray-600 bg-[#0B1220] accent-cyan-500 cursor-pointer"
            />
            <label for="push-channel" class="text-sm font-medium text-gray-300">
              🔔 Push notification
            </label>
          </div>
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="sms-channel"
              class="w-4 h-4 rounded border-gray-600 bg-[#0B1220] accent-cyan-500 cursor-pointer"
            />
            <label for="sms-channel" class="text-sm font-medium text-gray-300">
              📱 SMS
            </label>
          </div>
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="whatsapp-channel"
              class="w-4 h-4 rounded border-gray-600 bg-[#0B1220] accent-cyan-500 cursor-pointer"
            />
            <label
              for="whatsapp-channel"
              class="text-sm font-medium text-gray-300"
            >
              💬 WhatsApp
            </label>
          </div>
        </div>
      </div>

      <!-- Bouton d'enregistrement -->
      <div class="flex gap-3">
        <button
          class="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition-all hover:bg-cyan-500"
        >
          Enregistrer les modifications
        </button>
        <button
          class="rounded-lg border border-gray-700 px-6 py-2 font-medium text-gray-400 transition-all hover:bg-gray-800"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsDropdown from "~/components/SettingsDropdown.vue";
</script>

<style scoped></style>
