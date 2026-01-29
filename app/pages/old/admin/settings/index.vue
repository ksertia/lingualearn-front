<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-800 bg-[#0B1220]/50 backdrop-blur">
      <div class="mx-auto max-w-7xl px-6 py-8 flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white">PARAMÈTRES LMS</h1>
          <p class="mt-2 text-gray-400">
            Gestion complète de la plateforme d'apprentissage
          </p>
        </div>
        <div class="flex items-center gap-3">
          <SettingsDropdown />
          <NuxtLink
            to="/dashboard"
            class="rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-400 transition-all hover:bg-gray-800 whitespace-nowrap"
          >
            Retour
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-6 py-8">
      <!-- Platform Section -->
      <div class="mb-8">
        <h2 class="text-sm font-semibold uppercase text-gray-500 mb-4">
          PLATEFORME
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <SettingsCard
            title="Paramètres généraux"
            description="Configuration globale, langue, devise, fuseau horaire"
            icon="⚙️"
            to="/admin/settings/general"
            color="blue"
          />
        </div>
      </div>

      <!-- Business Section -->
      <div class="mb-8">
        <h2 class="text-sm font-semibold uppercase text-gray-500 mb-4">
          BUSINESS
        </h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SettingsCard
            title="Plans d'abonnement"
            description="Gratuit, payant, durées, renouvellement"
            icon="💳"
            to="/admin/settings/subscriptions"
            color="cyan"
          />
          <SettingsCard
            title="Contrôle d'accès"
            description="Droits par plan, limites d'utilisation"
            icon="🔐"
            to="/admin/settings/access-control"
            color="green"
          />
          <SettingsCard
            title="Blocage/Déblocage"
            description="Expiration, période de grâce, messages"
            icon="🔒"
            to="/admin/settings/blocking"
            color="red"
          />
          <SettingsCard
            title="Monétisation"
            description="Codes promo, réductions, offres spéciales"
            icon="💰"
            to="/admin/settings/monetization"
            color="yellow"
          />
        </div>
      </div>

      <!-- Communication Section -->
      <div class="mb-8">
        <h2 class="text-sm font-semibold uppercase text-gray-500 mb-4">
          COMMUNICATION
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <SettingsCard
            title="Notifications"
            description="Système, pédagogiques, canaux, fréquence"
            icon="🔔"
            to="/admin/settings/notifications"
            color="orange"
          />
          <SettingsCard
            title="Support & Communication"
            description="Email, WhatsApp, FAQ, ressources"
            icon="💬"
            to="/admin/settings/support"
            color="pink"
          />
        </div>
      </div>

      <!-- Learning Section -->
      <div class="mb-8">
        <h2 class="text-sm font-semibold uppercase text-gray-500 mb-4">
          APPRENTISSAGE
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <SettingsCard
            title="Qualité pédagogique"
            description="Seuils, tentatives, temps minimum, progression"
            icon="📚"
            to="/admin/settings/quality"
            color="purple"
          />
          <SettingsCard
            title="Contenu gratuit & Marketing"
            description="Leçons gratuites, essai, accès sans inscription"
            icon="🎁"
            to="/admin/settings/free-content"
            color="teal"
          />
        </div>
      </div>

      <!-- Security Section -->
      <div class="mb-8">
        <h2 class="text-sm font-semibold uppercase text-gray-500 mb-4">
          SÉCURITÉ
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <SettingsCard
            title="Sécurité & Prévention"
            description="Connexions simultanées, détection d'abus, limite tentatives"
            icon="⚔️"
            to="/admin/settings/security"
            color="red"
          />
          <SettingsCard
            title="Paramètres légaux"
            description="CGU, politique de confidentialité, RGPD, consentements"
            icon="⚖️"
            to="/admin/settings/legal"
            color="indigo"
          />
        </div>
      </div>

      <!-- Analytics Section -->
      <div class="mb-8">
        <h2 class="text-sm font-semibold uppercase text-gray-500 mb-4">
          SUIVI
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <SettingsCard
            title="Statistiques & Analytics"
            description="Suivi des données, conservation, exports, services tiers"
            icon="📊"
            to="/admin/settings/analytics"
            color="slate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsDropdown from "~/components/old code/SettingsDropdown.vue";

const SettingsCard = defineAsyncComponent(
  () => import("~/components/settings-admin/SettingsCard.vue"),
);

definePageMeta({
  layout: "lms",
});
</script>
