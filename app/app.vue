<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <SessionExpiredModal />
</template>

<script setup lang="ts">
import SessionExpiredModal from "~/components/session/SessionExpiredModal.vue";
</script>

<style>


/* .page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
} */

</style>
