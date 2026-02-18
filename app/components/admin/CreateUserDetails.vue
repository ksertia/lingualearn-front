<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 class="text-xl font-bold mb-4 text-[rgb(0,0,153)]">Détails utilisateur</h2>

      <div class="space-y-2 text-sm">
        <p><strong>Prénom:</strong> {{ user.profile.firstName }}</p>
        <p><strong>Nom:</strong> {{ user.profile.lastName }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Mot de passe:</strong> {{ user.password || '********' }}</p>
        <p><strong>Date d'inscription:</strong> {{ formattedDate }}</p>
        <p><strong>Rôle:</strong> {{ user.accountType }}</p>
      </div>

      <div class="flex justify-end mt-4">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '~/types/auth'

const props = defineProps<{
  user: User & { createdAt?: string | Date; password?: string }
}>()

defineEmits(['close'])

// Formater la date
const formattedDate = computed(() => {
  if (!props.user.createdAt) return '-'
  return new Date(props.user.createdAt).toLocaleString()
})
</script>
