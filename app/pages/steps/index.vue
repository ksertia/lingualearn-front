<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto mb-8 md:flex items-center justify-between">
      <div class="mb-4 md:mb-0">
        <h1 class="text-3xl font-black text-brand-blue tracking-tight">Gestion des Étapes</h1>
        <p class="text-slate-500 text-sm mt-1">Gérez les étapes de vos niveaux pédagogiques.</p>
      </div>
      <button 
        class="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-cyan text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-brand-blue/20 transition-all active:scale-95 group" 
        @click="openCreateModal"
      >
        <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvelle étape
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
              <tr v-else-if="!steps.length" class="text-center">
                <td colspan="5" class="px-6 py-8 text-slate-400">
                  Aucune étape trouvée
                </td>
              </tr>
              <tr v-for="item in steps" :key="item.id" class="group hover:bg-slate-50/50 transition-all duration-200">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-lg shadow-sm border border-brand-blue/10">
                      {{ item.stepNumber }}
                    </div>
                    <div class="font-bold text-slate-800">
                      <NuxtLink :to="`/steps/${item.id}`" class="hover:text-brand-blue transition-colors">
                        {{ item.title }}
                      </NuxtLink>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-5">
                  <span class="text-xs font-black text-brand-blue/60 uppercase tracking-widest block mb-1">Niveau</span>
                  <div class="font-bold text-slate-700">{{ getLevelName(item.levelId) }}</div>
                </td>

                <td class="px-6 py-5">
                  <span class="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/50">
                    {{ item.estimatedDurationMinutes || 0 }} min
                  </span>
                </td>

                <td class="px-6 py-5">
                  <span 
                    :class="item.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'"
                    class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border inline-block"
                  >
                    {{ item.isPublished ? 'Publié' : 'Brouillon' }}
                  </span>
                </td>

                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="editStep(item)" class="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-brand-blue transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="deleteStep(item.id)" class="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
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

    <!-- Modal Création/Edition -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl relative">
        <button @click="showModal = false" class="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 class="text-2xl font-black text-slate-800 mb-2">{{ isEditing ? 'Modifier l\'étape' : 'Nouvelle étape' }}</h3>
        <p class="text-slate-500 text-sm mb-8">Informations générales de l'étape.</p>

        <form @submit.prevent="saveStep" class="space-y-6">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre de l'étape</label>
            <input v-model="form.title" type="text" required placeholder="Ex: Grammaire de base" class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numéro d'ordre</label>
            <input v-model.number="form.stepNumber" type="number" required class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sélectionner le Niveau</label>
            <select v-model="form.levelId" required class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all appearance-none">
              <option value="" disabled>Choisir un niveau...</option>
              <option v-for="lvl in levelsOptions" :key="lvl.id" :value="lvl.id">
                {{ lvl.name }}
              </option>
            </select>
          </div>

          <div class="pt-4 flex gap-4">
            <button type="button" @click="showModal = false" class="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Annuler</button>
            <button type="submit" :disabled="stepStore.isLoading" class="flex-[2] bg-brand-blue hover:bg-brand-cyan text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-blue/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="stepStore.isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ stepStore.isLoading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer l\'étape') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useStepStore } from '~/stores/stepStore'
import { useLevelStore } from '~/stores/levelStore'
import { storeToRefs } from 'pinia'
import type { Step, CreateStepRequest } from '~/types/learning'

definePageMeta({
  layout: 'lms'
})

const stepStore = useStepStore()
const levelStore = useLevelStore()

const { steps, isLoading } = storeToRefs(stepStore)
const { levels: levelsOptions } = storeToRefs(levelStore)

const getLevelName = (id?: string) => {
  if (!id) return 'Inconnu'
  const lvl = levelsOptions.value.find(l => l.id === id)
  return lvl ? lvl.name : id
}

const columns = [
  { label: 'Etape', key: 'title' },
  { label: 'Niveau', key: 'level' },
  { label: 'Durée', key: 'duration' },
  { label: 'État', key: 'status' }
]

const showModal = ref(false)
const isEditing = ref(false)
const currentId = ref<string | null>(null)

const form = reactive({
  title: '',
  stepNumber: 1,
  levelId: ''
})

const resetForm = () => {
  form.title = ''
  form.stepNumber = 1
  form.levelId = ''
}

const openCreateModal = () => {
  isEditing.value = false
  currentId.value = null
  resetForm()
  showModal.value = true
}

const editStep = (step: Step) => {
  isEditing.value = true
  currentId.value = step.id
  form.title = step.title
  form.stepNumber = step.stepNumber
  form.levelId = step.levelId
  showModal.value = true
}

const saveStep = async () => {
  const payload: CreateStepRequest = { ...form }
  
  let success = false
  if (isEditing.value && currentId.value) {
    success = await stepStore.updateStep(currentId.value, payload)
  } else {
    success = await stepStore.createStep(payload)
  }

  if (success) {
    showModal.value = false
  } else if (stepStore.error) {
    alert(stepStore.error)
  }
}

const deleteStep = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette étape ?')) {
    await stepStore.deleteStep(id)
  }
}

onMounted(() => {
  stepStore.fetchSteps()
  levelStore.fetchLevels()
})
</script>
