<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#1a2849] to-[#0B1220]"
  >
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur">
      <div class="mx-auto max-w-7xl px-6 py-8">
        <h1 class="text-3xl font-bold text-white">Paramètres Administrateur</h1>
        <p class="mt-2 text-gray-400">
          Gérez les paramètres globaux de la plateforme LMS
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-6 py-8">
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Sidebar -->
        <AdminSidebar />

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Cards Overview -->
          <div class="grid gap-4 md:grid-cols-2">
            <!-- Subscription Card -->
            <div
              class="rounded-lg border border-gray-700 bg-[#1a2849] p-6 hover:border-cyan-500/50 transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-400">
                    Gestion des Abonnements
                  </p>
                  <p class="mt-2 text-2xl font-bold text-white">Plans</p>
                  <p class="mt-1 text-xs text-gray-500">Créer et modifier</p>
                </div>
                <div class="rounded-full bg-cyan-500/20 p-3">
                  <svg
                    class="h-6 w-6 text-cyan-400"
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
              </div>
              <NuxtLink
                to="/admin/settings/subscriptions"
                class="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Gérer →
              </NuxtLink>
            </div>

            <!-- Notifications Card -->
            <div
              class="rounded-lg border border-gray-700 bg-[#1a2849] p-6 hover:border-cyan-500/50 transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-400">
                    Notifications Auto
                  </p>
                  <p class="mt-2 text-2xl font-bold text-white">4 types</p>
                  <p class="mt-1 text-xs text-gray-500">
                    Cours, exercices, etc.
                  </p>
                </div>
                <div class="rounded-full bg-orange-500/20 p-3">
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 1118 14.158V11a6 6 0 10-9 5.753v3.5M4.3 4.3a6 6 0 008.4 8.4m0-9.9a6 6 0 018.4 8.4"
                    />
                  </svg>
                </div>
              </div>
              <NuxtLink
                to="/admin/settings/notifications"
                class="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Gérer →
              </NuxtLink>
            </div>

            <!-- Inactive Accounts Card -->
            <div
              class="rounded-lg border border-gray-700 bg-[#1a2849] p-6 hover:border-cyan-500/50 transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-400">
                    Comptes Inactifs
                  </p>
                  <p class="mt-2 text-2xl font-bold text-white">Maintenance</p>
                  <p class="mt-1 text-xs text-gray-500">Suppression auto</p>
                </div>
                <div class="rounded-full bg-red-500/20 p-3">
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
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <NuxtLink
                to="/admin/settings/inactive-accounts"
                class="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Gérer →
              </NuxtLink>
            </div>

            <!-- Global Settings Card -->
            <div
              class="rounded-lg border border-gray-700 bg-[#1a2849] p-6 hover:border-cyan-500/50 transition-all"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-400">
                    Paramètres Globaux
                  </p>
                  <p class="mt-2 text-2xl font-bold text-white">Plateforme</p>
                  <p class="mt-1 text-xs text-gray-500">Fuseau, langue, etc.</p>
                </div>
                <div class="rounded-full bg-blue-500/20 p-3">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <NuxtLink
                to="/admin/settings/global"
                class="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Gérer →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });
</script>
