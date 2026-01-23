<!-- <template>
  <div>
    <NuxtPage />
  </div>
</template> -->

<template>
  <div class="flex min-h-screen bg-[#0B1220] text-white">
    <AdminSidebar />

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from "~/components/settings-admin/AdminSidebar.vue";
</script>
