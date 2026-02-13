<script setup lang="ts">
import Subscriptions from './payment/Subscriptions.vue'
import PaymentMethods from './payment/PaymentMethods.vue'
import Transactions from './payment/Transactions.vue'
import AccessRestrictions from './payment/AccessRestrictions.vue'

defineEmits<{
  (e: 'message', type: 'success' | 'error', text: string): void
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Abonnements -->
    <Subscriptions />

    <!-- Méthodes de paiement -->
    <PaymentMethods />

    <!-- Restrictions d'accès -->
    <AccessRestrictions />

    <!-- Historique des transactions -->
    <Transactions />
  </div>
</template>

