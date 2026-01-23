<template>
  <div>
    <Notifications />
  </div>
</template>

<script setup lang="ts">
import Notifications from "~/components/settings-admin/notifications.vue";

definePageMeta({
  layout: "lms",
  // layout: "settings",
});
</script>
