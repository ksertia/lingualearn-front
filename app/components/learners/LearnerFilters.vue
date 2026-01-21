<template>
  <div class="bg-white rounded-xl shadow p-4 md:p-5">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end"
    >
      <!-- Recherche -->
      <div class="relative">
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Recherche
        </label>

        <span class="absolute left-3 top-[38px] text-gray-400">
          🔍
        </span>

        <input
          :value="search"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Nom de l'apprenant"
          class="pl-9 pr-3 py-2 w-full rounded-lg border border-gray-300 
                 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1]
                 outline-none transition"
        />
      </div>

      <!-- Parcours -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Parcours
        </label>

        <select
          :value="parcours"
          @change="$emit('update:parcours', ($event.target as HTMLSelectElement).value)"
          class="w-full rounded-lg border border-gray-300 py-2 px-3
                 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1]
                 outline-none transition bg-white"
        >
          <option value="">Tous</option>
          <option value="A">Parcours A</option>
          <option value="B">Parcours B</option>
          <option value="C">Parcours C</option>
        </select>
      </div>

      <!-- Statut -->
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">
          Statut
        </label>

        <select
          :value="status"
          @change="$emit('update:status', ($event.target as HTMLSelectElement).value)"
          class="w-full rounded-lg border border-gray-300 py-2 px-3
                 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1]
                 outline-none transition bg-white"
        >
          <option value="">Tous</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  search: string
  parcours: string
  status: string
}>()

defineEmits([
  'update:search',
  'update:parcours',
  'update:status'
])
</script>
