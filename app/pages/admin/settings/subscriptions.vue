<template>
  <div>
    <SubscriptionPlans />
  </div>
</template>

<script setup lang="ts">
import SubscriptionPlans from "~/components/settings-admin/subscription-plans.vue";

definePageMeta({
  layout: "lms",
});
</script>
