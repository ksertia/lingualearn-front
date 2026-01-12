<!-- <template>
    <div>
        <slot />
    </div>
</template> -->
<template>
  <div class="min-h-screen bg-[#0B1220] text-white">
      <Header class="sticky top-0 z-50 bg-[#0B1220]/95 backdrop-blur border-b border-white/10"/>
    <main>
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
<script setup>
import TheHeader from "~/components/Header/index.vue";
</script>
