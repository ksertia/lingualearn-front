<template>
  <div class="relative overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
    <table class="w-full text-sm text-left text-gray-700">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3">Prénom</th>
          <th class="px-6 py-3">Nom</th>
          <th class="px-6 py-3">Email</th>
          <th class="px-6 py-3">Rôle</th>
          <th class="px-6 py-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-b hover:bg-gray-100"
        >
          <td class="px-6 py-4">{{ user.prenom }}</td>
          <td class="px-6 py-4">{{ user.nom }}</td>
          <td class="px-6 py-4">{{ user.email }}</td>

          <!-- rôle cliquable -->
          <td class="px-6 py-4">
            <button
              @click="$emit('show-details', user)"
              class="px-2 py-1 rounded-full text-xs font-semibold hover:underline"
              :class="roleColor(user.role)"
            >
              {{ user.role }}
            </button>
          </td>

          <td class="px-6 py-4 text-center">
            <button
              @click="$emit('edit', user)"
              class="text-blue-600 hover:underline text-sm"
            >
              Modifier
            </button>

            <button
              @click="$emit('delete', user)"
              class="text-orange-500 hover:underline text-sm ml-3"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  users: any[]
}>()

defineEmits<{
  (e: 'edit', user: any): void
  (e: 'delete', user: any): void
  (e: 'show-details', user: any): void
}>()

const roleColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case 'ADMINISTRATEUR':
      return 'bg-blue-800 text-white'
    case 'GESTIONNAIRE':
      return 'bg-cyan-400 text-blue-900'
    case 'FORMATEUR':
      return 'bg-orange-400 text-white'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}
</script>
