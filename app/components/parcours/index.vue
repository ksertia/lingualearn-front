<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    
    <div class="max-w-7xl mx-auto mb-8 md:flex items-center justify-between">
      <div class="mb-4 md:mb-0">
        <h1 class="text-3xl font-black text-brand-blue tracking-tight">Gestion des Parcours</h1>
        <p class="text-slate-500 text-sm mt-1">Gérez vos programmes pédagogiques et suivez vos apprenants.</p>
      </div>
      <button 
        class="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-cyan text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-brand-blue/20 transition-all active:scale-95 group" @click="goToForm"
      >
        <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouveau parcours
      </button>
    </div>

    
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            
            <thead class="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th v-for="col in columns" :key="col.key" class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                  {{ col.label }}
                </th>
                <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>

            
            <tbody class="divide-y divide-slate-50">
              <tr v-if="isLoading" class="text-center">
                <td colspan="5" class="px-6 py-8">
                  <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="!learningPathsOptions.length" class="text-center">
                <td colspan="5" class="px-6 py-8 text-slate-400">
                  Aucun parcours trouvé
                </td>
              </tr>
              <tr v-for="item in learningPathsOptions" :key="item.id" class="group hover:bg-slate-50/50 transition-all duration-200">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-lg shadow-sm border border-brand-blue/10">
                      {{ item.title.charAt(0) }}
                    </div>
                    <div>
                      <div class="font-bold text-slate-800">{{ item.title }}</div>
                      <div class="text-xs text-slate-400 max-w-[200px] truncate">{{ item.description }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-5">
                  <span class="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/50">
                    {{ getLevelsCount(item) }} niveaux
                  </span>
                </td>

                <td class="px-6 py-5">
                  <span class="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/50">
                    {{ getDurationText(item.estimatedDurationWeeks || 0) }}
                  </span>
                </td>

                <td class="px-6 py-5">
                  <span 
                    :class="getStatusClasses(item.isPublished || false)"
                    class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border inline-block min-w-[80px] text-center"
                  >
                    {{ item.isPublished ? 'Publié' : 'Brouillon' }}
                  </span>
                </td>

                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="navigateTo(`/parcours/${item.id}`)" class="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-brand-blue transition-all" title="Voir les détails">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button @click="editLearningPath(item.id)" class="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-brand-blue transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="deleteLearningPath(item.id)" class="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useParcoursStore } from '~/stores/parcoursStore'
import { storeToRefs } from 'pinia'

const parcoursStore = useParcoursStore()
const { allParcours: learningPathsOptions, isLoading } = storeToRefs(parcoursStore)

const columns = [
  { label: 'Titre du Parcours', key: 'title' },
  { label: 'Niveaux', key: 'levels' },
  { label: 'Durée', key: 'duration' },
  { label: 'État', key: 'status' }
]

const getStatusClasses = (isPublished: boolean) => {
  return isPublished 
    ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
    : 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
}

const getLevelsCount = (item: any) => {
  return item.levels?.length || 0
}

const getDurationText = (weeks: number) => {
  return weeks ? `${weeks} sem` : 'N/A'
}

const goToForm = () => {
  navigateTo('/parcours/form')
}

const editLearningPath = (id: string) => {
  navigateTo(`/parcours/${id}/edit`)
}

const deleteLearningPath = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce parcours ?')) {
     await parcoursStore.deleteParcours(id)
  }
}

onMounted(() => {
  parcoursStore.fetchParcours()
})
</script>

<style scoped>

.max-w-7xl {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
