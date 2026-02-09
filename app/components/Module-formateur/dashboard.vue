<template>
   <div class="dashboard-container">
      <!-- Header 
    <div class="dashboard flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Tableau de bord du formateur</h2>
      <button
        @click="goToModuleCreation"
        class="btn btn-primary"
      >
        Créer un nouveau module
      </button>
    </div> -->

    <!-- Langues -->
    <div class="langue">
      <h2 class="text-lg font-semibold mb-4">Sélectionnez une langue</h2>

      <div v-if="languages.length" class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-blue-900 text-white">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase">Titre</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="(lang, index) in languages" :key="lang.id">
              
              <td>{{ index + 1 }}</td>
              <td>{{ lang.name }}</td>
              <td>{{ lang.description }}</td>
              <td>
                <button
  @click="goToModules(lang.id)"
  class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md"
>
  Voir modules
</button>
<!-- <NuxtLink
  :to="`/moduleCrea/${lang.id}`"
  class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md inline-block"
>
  Voir modules
</NuxtLink> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-gray-500 text-sm mt-4">
        Aucune langue disponible pour le moment.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Language {
  id: string
  name: string
  description: string
}

const router = useRouter()
const languages = ref<Language[]>([])

// Redirection création module
// const goToModuleCreation = () => {
//   router.push('/module-formateur')
// }

// Redirection vers les modules d’une langue
  const goToModules = (languageId: string) => {
  const url = `module-formateur/moduleCrea/${languageId}`
  console.log('URL finale =', url)
  navigateTo(url)
}


// Récupération des langues depuis le backend
const fetchLanguages = async () => {
  try {
    const res = await fetch('https://213.32.120.11:4000/api/v1/languages')
    const result = await res.json()
    languages.value = result.data
  } catch (error) {
    console.error('Erreur lors du chargement des langues', error)
  }
}

onMounted(fetchLanguages)
</script>
