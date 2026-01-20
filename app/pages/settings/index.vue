<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
  >
    <!-- Header Section -->
    <div
      class="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-cyan-500/20 rounded-lg">
            <svg
              class="w-6 h-6 text-cyan-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l1.72-1.34c.15-.12.19-.34.09-.51l-1.64-2.84c-.1-.17-.32-.21-.49-.12l-2.03 1.59c-.42-.32-.9-.59-1.42-.78l-.3-2.16c-.04-.2-.22-.35-.42-.35h-3.28c-.2 0-.39.15-.43.35l-.3 2.16c-.52.19-1 .46-1.42.78l-2.03-1.59c-.16-.13-.38-.09-.49.12L2.7 8.21c-.1.17-.06.39.09.51l1.72 1.34c-.05.3-.07.62-.07.94s.02.64.07.94l-1.72 1.34c-.15.12-.19.34-.09.51l1.64 2.84c.1.17.32.21.49.12l2.03-1.59c.42.32.9.59 1.42.78l.3 2.16c.05.2.23.35.43.35h3.28c.2 0 .39-.15.43-.35l.3-2.16c.52-.19 1-.46 1.42-.78l2.03 1.59c.16.13.38.09.49-.12l1.64-2.84c.1-.17.06-.39-.09-.51l-1.72-1.34M12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Paramètres</h1>
            <p class="text-slate-400 mt-1">
              Gérez vos préférences et paramètres de compte
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Settings Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Profile Card -->
        <NuxtLink to="/pageSetting/profile" class="group">
          <div
            class="h-full p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
          >
            <div class="flex items-center gap-4 mb-4">
              <div
                class="p-3 bg-cyan-500/20 rounded-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-6 h-6 text-cyan-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Mon Profil</h2>
                <p class="text-sm text-slate-400">Informations personnelles</p>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
              Gérez votre photo de profil, votre nom et autres informations
              personnelles
            </p>
            <div
              class="flex items-center gap-2 text-cyan-400 text-sm font-semibold group-hover:translate-x-2 transition-transform"
            >
              <span>Accéder</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Security Card -->
        <NuxtLink to="/pageSetting/security" class="group">
          <div
            class="h-full p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
          >
            <div class="flex items-center gap-4 mb-4">
              <div
                class="p-3 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-6 h-6 text-orange-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Sécurité</h2>
                <p class="text-sm text-slate-400">Protection du compte</p>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
              Changez votre mot de passe, gérez l'authentification à deux
              facteurs
            </p>
            <div
              class="flex items-center gap-2 text-orange-400 text-sm font-semibold group-hover:translate-x-2 transition-transform"
            >
              <span>Accéder</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Billing Card -->
        <NuxtLink to="/pageSetting/billing" class="group">
          <div
            class="h-full p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
          >
            <div class="flex items-center gap-4 mb-4">
              <div
                class="p-3 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-6 h-6 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Facturation</h2>
                <p class="text-sm text-slate-400">Plans et paiements</p>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
              Gérez vos abonnements, moyens de paiement et historique de
              facturation
            </p>
            <div
              class="flex items-center gap-2 text-green-400 text-sm font-semibold group-hover:translate-x-2 transition-transform"
            >
              <span>Accéder</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Preferences Card -->
        <NuxtLink to="/pageSetting/Preferences" class="group">
          <div
            class="h-full p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
          >
            <div class="flex items-center gap-4 mb-4">
              <div
                class="p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-6 h-6 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l1.72-1.34c.15-.12.19-.34.09-.51l-1.64-2.84c-.1-.17-.32-.21-.49-.12l-2.03 1.59c-.42-.32-.9-.59-1.42-.78l-.3-2.16c-.04-.2-.22-.35-.42-.35h-3.28c-.2 0-.39.15-.43.35l-.3 2.16c-.52.19-1 .46-1.42.78l-2.03-1.59c-.16-.13-.38-.09-.49.12L2.7 8.21c-.1.17-.06.39.09.51l1.72 1.34c-.05.3-.07.62-.07.94s.02.64.07.94l-1.72 1.34c-.15.12-.19.34-.09.51l1.64 2.84c.1.17.32.21.49.12l2.03-1.59c.42.32.9.59 1.42.78l.3 2.16c.05.2.23.35.43.35h3.28c.2 0 .39-.15.43-.35l.3-2.16c.52-.19 1-.46 1.42-.78l2.03 1.59c.16.13.38.09.49-.12l1.64-2.84c.1-.17.06-.39-.09-.51l-1.72-1.34M12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Préférences</h2>
                <p class="text-sm text-slate-400">Notifications et thème</p>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
              Configurez vos notifications, langue et préférences d'apparence
            </p>
            <div
              class="flex items-center gap-2 text-blue-400 text-sm font-semibold group-hover:translate-x-2 transition-transform"
            >
              <span>Accéder</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Organization Card -->
        <NuxtLink to="/pageSetting/organization" class="group">
          <div
            class="h-full p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
          >
            <div class="flex items-center gap-4 mb-4">
              <div
                class="p-3 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform"
              >
                <svg
                  class="w-6 h-6 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm8.59-12.23l-4.24 4.24c-.2.2-.51.2-.71 0l-1.06-1.06c-.2-.2-.2-.51 0-.71l4.24-4.24c.2-.2.51-.2.71 0l1.06 1.06c.2.2.2.51 0 .71z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Organisation</h2>
                <p class="text-sm text-slate-400">Équipe et partage</p>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-4">
              Gérez les membres de votre équipe et les paramètres de
              l'organisation
            </p>
            <div
              class="flex items-center gap-2 text-purple-400 text-sm font-semibold group-hover:translate-x-2 transition-transform"
            >
              <span>Accéder</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Quick Stats Section -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p class="text-slate-400 text-sm mb-2">Compte créé le</p>
          <p class="text-2xl font-bold text-cyan-400">19 Jan 2026</p>
        </div>
        <div class="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p class="text-slate-400 text-sm mb-2">Abonnement</p>
          <p class="text-2xl font-bold text-green-400">Premium</p>
        </div>
        <div class="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p class="text-slate-400 text-sm mb-2">Sessions actives</p>
          <p class="text-2xl font-bold text-orange-400">2</p>
        </div>
        <div class="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p class="text-slate-400 text-sm mb-2">Sécurité</p>
          <p class="text-2xl font-bold text-blue-400">✓ Sécurisé</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
