<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto mb-8 md:flex items-center justify-between">
      <div class="mb-4 md:mb-0">
        <h1 class="text-3xl font-black text-brand-blue tracking-tight">Gestion des Exercices</h1>
        <p class="text-slate-500 text-sm mt-1">Créez et gérez les exercices pour vos leçons.</p>
      </div>
      <button 
        class="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-cyan text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-brand-blue/20 transition-all active:scale-95 group" 
        @click="openCreateModal"
      >
        <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvel exercice
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
              <tr v-else-if="!exercises.length" class="text-center">
                <td colspan="5" class="px-6 py-8 text-slate-400">
                  Aucun exercice trouvé
                </td>
              </tr>
              <tr v-for="item in exercises" :key="item.id" class="group hover:bg-slate-50/50 transition-all duration-200">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-lg shadow-sm border border-brand-blue/10">
                      {{ getExerciseIcon(item.exerciseType) }}
                    </div>
                    <div>
                      <div class="font-bold text-slate-800">
                        <NuxtLink :to="`/exercises/${item.id}`" class="hover:text-brand-blue transition-colors">
                          {{ item.title }}
                        </NuxtLink>
                      </div>
                      <div class="text-xs text-slate-400 uppercase font-black tracking-widest">{{ item.exerciseType }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-5">
                  <span class="text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    {{ getCourseTitle(item.lessonId) }}
                  </span>
                </td>

                <td class="px-6 py-5">
                  <span class="text-sm font-bold text-brand-blue">
                    {{ item.points || 0 }} pts
                  </span>
                </td>

                <td class="px-6 py-5">
                  <span 
                    :class="item.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'"
                    class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border inline-block"
                  >
                    {{ item.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </td>

                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="editExercise(item)" class="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-brand-blue transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="deleteExercise(item.id)" class="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
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
      <div class="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button @click="showModal = false" class="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 class="text-2xl font-black text-slate-800 mb-2">{{ isEditing ? 'Modifier l\'exercice' : 'Nouvel exercice' }}</h3>
        <p class="text-slate-500 text-sm mb-8">Configurez les détails et le contenu de votre exercice.</p>

        <form @submit.prevent="saveExercise" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre de l'exercice</label>
              <input v-model="form.title" type="text" required placeholder="Ex: Vocabulaire de base" class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type d'exercice</label>
              <select v-model="form.exerciseType" required class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all appearance-none">
                <option value="multiple_choice">Choix multiple</option>
                <option value="fill_blank">Texte à trous</option>
                <option value="matching">Correspondance</option>
              </select>
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sélectionner le Cours (Leçon)</label>
              <select v-model="form.lessonId" required class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
                <option value="" disabled>Choisir un cours...</option>
                <option v-for="course in coursesOptions" :key="course.id" :value="course.id">
                  {{ course.title }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instructions</label>
              <textarea v-model="form.instructions" rows="2" placeholder="Expliquez comment faire l'exercice..." class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all resize-none"></textarea>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Points</label>
              <input v-model.number="form.points" type="number" class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Récompense XP</label>
              <input v-model.number="form.xpReward" type="number" class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
            </div>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row gap-4">
            <button type="button" @click="showModal = false" class="w-full sm:w-1/3 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Annuler</button>
            <button type="submit" :disabled="exerciseStore.isLoading" class="w-full sm:w-2/3 bg-brand-blue hover:bg-brand-cyan text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-blue/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="exerciseStore.isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ exerciseStore.isLoading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer l\'exercice') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useExerciseStore } from '~/stores/exerciseStore'
import { useCourseStore } from '~/stores/courseStore'
import { storeToRefs } from 'pinia'
import type { Exercise, CreateExerciseRequest } from '~/types/learning'

definePageMeta({
  layout: 'lms'
})

const exerciseStore = useExerciseStore()
const courseStore = useCourseStore()

const { exercises, isLoading } = storeToRefs(exerciseStore)
const { courses: coursesOptions } = storeToRefs(courseStore)

const getCourseTitle = (id?: string) => {
  if (!id) return 'Inconnue'
  const course = coursesOptions.value.find(c => c.id === id)
  return course ? course.title : id
}

const columns = [
  { label: 'Exercice', key: 'title' },
  { label: 'Leçon', key: 'lesson' },
  { label: 'Points', key: 'points' },
  { label: 'État', key: 'status' }
]

const showModal = ref(false)
const isEditing = ref(false)
const currentId = ref<string | null>(null)

const form = reactive({
  title: '',
  exerciseType: 'multiple_choice' as const,
  lessonId: '',
  instructions: '',
  content: {},
  points: 10,
  xpReward: 50,
  isActive: true
})

const resetForm = () => {
  form.title = ''
  form.exerciseType = 'multiple_choice'
  form.lessonId = ''
  form.instructions = ''
  form.content = {}
  form.points = 10
  form.xpReward = 50
  form.isActive = true
}

const openCreateModal = () => {
  isEditing.value = false
  currentId.value = null
  resetForm()
  showModal.value = true
}

const editExercise = (exercise: Exercise) => {
  isEditing.value = true
  currentId.value = exercise.id
  Object.assign(form, {
    title: exercise.title,
    exerciseType: exercise.exerciseType,
    lessonId: exercise.lessonId || '',
    instructions: exercise.instructions || '',
    content: exercise.content || {},
    points: exercise.points || 0,
    xpReward: exercise.xpReward || 0,
    isActive: exercise.isActive ?? true
  })
  showModal.value = true
}

const saveExercise = async () => {
  const payload: CreateExerciseRequest = {
    ...form,
    lessonId: form.lessonId
  }

  let success = false
  if (isEditing.value && currentId.value) {
    success = await exerciseStore.updateExercise(currentId.value, payload)
  } else {
    success = await exerciseStore.createExercise(payload)
  }

  if (success) {
    showModal.value = false
  } else if (exerciseStore.error) {
    alert(exerciseStore.error)
  }
}

const deleteExercise = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
    await exerciseStore.deleteExercise(id)
  }
}

const getExerciseIcon = (type: string) => {
  switch (type) {
    case 'multiple_choice': return '?'
    case 'fill_blank': return '_'
    case 'matching': return '='
    default: return 'E'
  }
}

onMounted(() => {
  exerciseStore.fetchExercises()
  courseStore.fetchCourses()
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
