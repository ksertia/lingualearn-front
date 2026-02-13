<script setup lang="ts">
import PlatformConfig from './general/PlatformConfig.vue'
import LogoUpload from './general/LogoUpload.vue'
import LanguageSelect from './general/LanguageSelect.vue'
import TimezoneSelect from './general/TimezoneSelect.vue'

defineEmits<{
  (e: 'message', type: 'success' | 'error', text: string): void
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Configuration de la plateforme -->
    <PlatformConfig />

    <!-- Upload du logo -->
    <LogoUpload />

    <!-- Sélection de la langue et du fuseau horaire -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LanguageSelect />
      <TimezoneSelect />
    </div>
  </div>
</template>

