<template>
  <div>
    <AccessControl />
  </div>
</template>

<script setup lang="ts">
import AccessControl from "~/components/settings-admin/access-control.vue";

definePageMeta({
  layout: "lms",
});
</script>
