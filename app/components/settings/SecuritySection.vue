<script setup lang="ts">
import PasswordPolicy from './security/PasswordPolicy.vue'
import LoginAttempts from './security/LoginAttempts.vue'
import LoginLogs from './security/LoginLogs.vue'

defineEmits<{
  (e: 'message', type: 'success' | 'error', text: string): void
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Politique de mot de passe -->
    <PasswordPolicy />

    <!-- Limitation des tentatives de connexion -->
    <LoginAttempts />

    <!-- Journal des connexions -->
    <LoginLogs />
  </div>
</template>

