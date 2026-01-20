<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-6 border-l-4 border-cyan">
      <div class="flex items-center gap-3 mb-3">
        <div class="p-2 bg-cyan bg-opacity-10 rounded-lg">
          <svg
            class="w-6 h-6 text-cyan"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 7l-9 9z"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-dark-blue">
            Abonnement et Paiement
          </h1>
          <p class="text-sm text-gray-600">
            Gérez votre plan d'abonnement et vos paramètres de facturation
          </p>
        </div>
      </div>
    </div>

    <!-- Current Plan -->
    <div class="card p-6 border-l-4 border-orange">
      <h2
        class="text-lg font-semibold text-dark-blue mb-6 flex items-center gap-2"
      >
        <span class="p-2 bg-orange bg-opacity-10 rounded-lg">
          <svg
            class="w-5 h-5 text-orange"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 7l-9 9z"
            />
          </svg>
        </span>
        Plan Actuel
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Free Plan Card -->
        <div
          :class="[
            'rounded-lg p-6 border-2 transition-all',
            currentPlan === 'free'
              ? 'border-cyan bg-gradient-to-br from-cyan/10 to-turquoise/10'
              : 'border-gray-300 bg-gray-light',
          ]"
        >
          <h3 class="text-xl font-bold text-dark-blue mb-2">Gratuit</h3>
          <p class="text-gray-600 text-sm mb-4">Pour débuter</p>
          <div class="text-3xl font-bold text-cyan mb-4">0 €</div>
          <ul class="space-y-2 mb-6 text-sm">
            <li class="flex items-center text-dark-blue">
              <svg
                class="w-4 h-4 mr-2 text-cyan"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              Accès basique
            </li>
            <li class="flex items-center text-dark-blue">
              <svg
                class="w-4 h-4 mr-2 text-cyan"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              10 leçons/mois
            </li>
            <li class="flex items-center text-gray-400">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                />
              </svg>
              Sans certificat
            </li>
          </ul>
          <button
            v-if="currentPlan !== 'free'"
            @click="changePlan('free')"
            class="btn-secondary w-full"
          >
            Rétrograder
          </button>
          <button
            v-else
            disabled
            class="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
          >
            Plan actuel
          </button>
        </div>

        <!-- Pro Plan Card -->
        <div
          :class="[
            'rounded-lg p-6 border-2 transition-all relative',
            currentPlan === 'pro'
              ? 'border-orange bg-gradient-to-br from-orange/10 to-turquoise/10 shadow-lg'
              : 'border-gray-300 bg-gray-light',
          ]"
        >
          <div
            v-if="currentPlan === 'pro'"
            class="absolute -top-3 left-4 bg-orange text-white px-3 py-1 rounded-full text-xs font-bold"
          >
            ACTIF
          </div>
          <h3 class="text-xl font-bold text-dark-blue mb-2">Pro</h3>
          <p class="text-gray-600 text-sm mb-4">Le plus populaire</p>
          <div class="text-3xl font-bold text-orange mb-1">9,99 €</div>
          <p class="text-sm text-gray-600 mb-6">/mois ou 99,99 €/an</p>
          <ul class="space-y-2 mb-6 text-sm">
            <li class="flex items-center text-dark-blue">
              <svg
                class="w-4 h-4 mr-2 text-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              Accès complet
            </li>
            <li class="flex items-center text-dark-blue">
              <svg
                class="w-4 h-4 mr-2 text-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              Leçons illimitées
            </li>
            <li class="flex items-center text-dark-blue">
              <svg
                class="w-4 h-4 mr-2 text-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              Certificats inclus
            </li>
          </ul>
          <button
            v-if="currentPlan !== 'pro'"
            @click="changePlan('pro')"
            class="btn-primary w-full"
          >
            Passer au Pro
          </button>
          <button
            v-else
            disabled
            class="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
          >
            Plan actuel
          </button>
        </div>

        <!-- Premium Plan Card -->
        <div
          :class="[
            'rounded-lg p-6 border-2 transition-all',
            currentPlan === 'premium'
              ? 'border-turquoise bg-gradient-to-br from-turquoise/10 to-cyan/10'
              : 'border-gray-300 bg-gray-light',
          ]"
        >
          <h3 class="text-xl font-bold text-dark-blue mb-2">Premium</h3>
          <p class="text-gray-600 text-sm mb-4">Expérience complète</p>
          <div class="text-3xl font-bold text-turquoise mb-1">19,99 €</div>
          <p class="text-sm text-gray-600 mb-6">/mois ou 199,99 €/an</p>
          <ul class="space-y-2 mb-6 text-sm">
            <li class="flex items-center text-dark-blue">
              <svg
                class="w-4 h-4 mr-2 text-turquoise"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              Tout ce qui est Pro
            </li>
            <li class="flex items-center text-dark-blue">
              <svg
                class="w-4 h-4 mr-2 text-turquoise"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              Support prioritaire
            </li>
            <li class="flex items-center text-dark-blue">
              <svg
                class="w-4 h-4 mr-2 text-turquoise"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              Contenu exclusif
            </li>
          </ul>
          <button
            v-if="currentPlan !== 'premium'"
            @click="changePlan('premium')"
            class="btn-primary w-full"
          >
            Passer au Premium
          </button>
          <button
            v-else
            disabled
            class="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
          >
            Plan actuel
          </button>
        </div>
      </div>
    </div>

    <!-- Subscription Details -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-dark-blue mb-4 flex items-center">
        <svg
          class="w-5 h-5 mr-2 text-cyan"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.16-2.66c-.44-.53-1.25-.58-1.78-.15-.53.44-.58 1.25-.15 1.78l3.5 4.29c.375.47.92.73 1.46.73.53 0 1.085-.26 1.46-.73l4.15-5.28c.43-.53.39-1.34-.09-1.79-.48-.44-1.28-.39-1.71.09z"
          />
        </svg>
        Détails de l'Abonnement
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card p-4">
          <p class="text-sm text-gray-600 mb-1">Plan actuel</p>
          <p class="text-2xl font-bold text-orange">Pro</p>
        </div>
        <div class="card p-4">
          <p class="text-sm text-gray-600 mb-1">Cycle de facturation</p>
          <p class="text-2xl font-bold text-cyan">Mensuel</p>
        </div>
        <div class="card p-4">
          <p class="text-sm text-gray-600 mb-1">Date de renouvellement</p>
          <p class="text-xl font-bold text-dark-blue">15 février 2026</p>
          <p class="text-xs text-gray-600 mt-1">Dans 27 jours</p>
        </div>
        <div class="card p-4">
          <p class="text-sm text-gray-600 mb-1">Prochains frais</p>
          <p class="text-2xl font-bold text-dark-blue">9,99 €</p>
        </div>
      </div>
    </div>

    <!-- Billing Actions -->
    <div class="card p-6 border-l-4 border-turquoise">
      <h2
        class="text-lg font-semibold text-dark-blue mb-6 flex items-center gap-2"
      >
        <span class="p-2 bg-turquoise bg-opacity-10 rounded-lg">
          <svg
            class="w-5 h-5 text-turquoise"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </span>
        Actions
      </h2>

      <div class="space-y-3">
        <button class="btn-primary w-full flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 12h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6m0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
            />
          </svg>
          Ajouter une méthode de paiement
        </button>
        <button class="btn-secondary w-full flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 7l-9 9z"
            />
          </svg>
          Télécharger les factures
        </button>
        <button
          @click="showCancelConfirm = true"
          class="btn-danger w-full flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
            />
          </svg>
          Annuler l'abonnement
        </button>
      </div>
    </div>

    <!-- Recent Invoices -->
    <div class="card p-6 border-l-4 border-cyan">
      <h2
        class="text-lg font-semibold text-dark-blue mb-6 flex items-center gap-2"
      >
        <span class="p-2 bg-cyan bg-opacity-10 rounded-lg">
          <svg
            class="w-5 h-5 text-cyan"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z"
            />
          </svg>
        </span>
        Factures Récentes
      </h2>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-300">
              <th class="text-left py-3 px-4 text-dark-blue font-semibold">
                Date
              </th>
              <th class="text-left py-3 px-4 text-dark-blue font-semibold">
                Description
              </th>
              <th class="text-left py-3 px-4 text-dark-blue font-semibold">
                Montant
              </th>
              <th class="text-left py-3 px-4 text-dark-blue font-semibold">
                Statut
              </th>
              <th class="text-left py-3 px-4 text-dark-blue font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="invoice in invoices"
              :key="invoice.id"
              class="border-b border-gray-200 hover:bg-gray-light"
            >
              <td class="py-3 px-4">{{ invoice.date }}</td>
              <td class="py-3 px-4">{{ invoice.description }}</td>
              <td class="py-3 px-4 font-semibold text-dark-blue">
                {{ invoice.amount }}
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    invoice.status === 'Payée'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{ invoice.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <button class="text-cyan hover:underline font-medium">
                  Télécharger
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cancel Subscription Modal -->
    <div
      v-if="showCancelConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="card p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-dark-blue mb-4">
          Êtes-vous sûr de vouloir annuler votre abonnement ?
        </h3>
        <p class="text-gray-600 text-sm mb-6">
          Votre abonnement sera annulé à la fin de la période de facturation
          actuelle. Vous conserverez l'accès jusqu'au 15 février 2026.
        </p>
        <div class="flex gap-3">
          <button
            @click="showCancelConfirm = false"
            class="btn-secondary flex-1"
          >
            Continuer
          </button>
          <button @click="cancelSubscription" class="btn-danger flex-1">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <Teleport to="body" v-if="showSuccess">
      <div
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse"
      >
        ✓ {{ successMessage }}
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const currentPlan = ref("pro");
const showCancelConfirm = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");

const invoices = ref([
  {
    id: "1",
    date: "15 janvier 2026",
    description: "Abonnement Pro - Mensuel",
    amount: "9,99 €",
    status: "Payée",
  },
  {
    id: "2",
    date: "15 décembre 2025",
    description: "Abonnement Pro - Mensuel",
    amount: "9,99 €",
    status: "Payée",
  },
  {
    id: "3",
    date: "15 novembre 2025",
    description: "Abonnement Pro - Mensuel",
    amount: "9,99 €",
    status: "Payée",
  },
  {
    id: "4",
    date: "15 octobre 2025",
    description: "Abonnement Pro - Mensuel",
    amount: "9,99 €",
    status: "Payée",
  },
]);

const changePlan = (plan: string) => {
  currentPlan.value = plan;
  successMessage.value = `Vous avez changé votre plan en ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};

const cancelSubscription = () => {
  showCancelConfirm.value = false;
  successMessage.value = "Votre abonnement a été annulé";
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};
</script>
