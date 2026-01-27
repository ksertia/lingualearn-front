<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto mb-8 md:flex items-center justify-between">
      <div class="mb-4 md:mb-0">
        <h1 class="text-3xl font-black text-brand-blue tracking-tight">Gestion des Cours</h1>
        <p class="text-slate-500 text-sm mt-1">Créez et gérez le contenu de vos étapes pédagogiques.</p>
      </div>
      <button 
        class="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-cyan text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-brand-blue/20 transition-all active:scale-95 group" 
        @click="openCreateModal"
      >
        <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouveau cours
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
              <tr v-else-if="!courses.length" class="text-center">
                <td colspan="5" class="px-6 py-8 text-slate-400">
                  Aucun cours trouvé
                </td>
              </tr>
              <tr v-for="item in courses" :key="item.id" class="group hover:bg-slate-50/50 transition-all duration-200">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black shadow-sm border border-brand-blue/10">
                      <component :is="getContentIcon(item.contentType)" class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="font-bold text-slate-800">
                        <NuxtLink :to="`/courses/${item.id}`" class="hover:text-brand-blue transition-colors">
                          {{ item.title }}
                        </NuxtLink>
                      </div>
                      <div class="text-[10px] text-slate-400 uppercase font-black tracking-widest">{{ item.contentType }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-5">
                  <span class="text-xs text-slate-500 font-medium">Étape ID: {{ item.stepId }}</span>
                </td>

                <td class="px-6 py-5">
                  <span class="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/50">
                    {{ formatDuration(item.duration) }}
                  </span>
                </td>

                <td class="px-6 py-5">
                  <div class="flex flex-col gap-1">
                    <span 
                      :class="item.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'"
                      class="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border text-center w-fit"
                    >
                      {{ item.isPublished ? 'Publié' : 'Brouillon' }}
                    </span>
                    <span 
                      :class="item.isActive ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-400 border-rose-100'"
                      class="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border text-center w-fit"
                    >
                      {{ item.isActive ? 'Actif' : 'Inactif' }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="editCourse(item)" class="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-brand-blue transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="deleteCourse(item.id)" class="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
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

        <h3 class="text-2xl font-black text-slate-800 mb-2">{{ isEditing ? 'Modifier le cours' : 'Nouveau cours' }}</h3>
        <p class="text-slate-500 text-sm mb-8">Définissez les paramètres de votre contenu pédagogique.</p>

        <form @submit.prevent="saveCourse" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1.5 md:col-span-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre du cours</label>
              <input v-model="form.title" type="text" required placeholder="Ex: Introduction à la grammaire" class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea v-model="form.description" rows="2" placeholder="Décrivez brièvement le contenu..." class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all resize-none"></textarea>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de contenu</label>
              <select v-model="form.contentType" required class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
                <option value="video">Vidéo</option>
                <option value="audio">Audio</option>
                <option value="text">Texte</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID de l'étape (Step)</label>
              <input v-model="form.stepId" type="text" required placeholder="ID de l'étape parente" class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
            </div>

            <div class="space-y-1.5 md:col-span-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL du contenu</label>
              <input v-model="form.contentUrl" type="url" required placeholder="https://..." class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Durée (secondes)</label>
              <input v-model.number="form.duration" type="number" placeholder="Ex: 1200" class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ordre</label>
              <input v-model.number="form.order" type="number" placeholder="1" class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all">
            </div>

            <div class="flex items-center gap-8 md:col-span-2 p-2">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative">
                  <input v-model="form.isPublished" type="checkbox" class="sr-only peer">
                  <div class="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-400 transition-all"></div>
                  <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-all shadow-sm"></div>
                </div>
                <span class="text-xs font-black text-slate-500 uppercase tracking-widest">Publié</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative">
                  <input v-model="form.isActive" type="checkbox" class="sr-only peer">
                  <div class="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-400 transition-all"></div>
                  <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-all shadow-sm"></div>
                </div>
                <span class="text-xs font-black text-slate-500 uppercase tracking-widest">Actif</span>
              </label>
            </div>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row gap-4">
            <button type="button" @click="showModal = false" class="w-full sm:w-1/3 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Annuler</button>
            <button type="submit" :disabled="courseStore.isLoading" class="w-full sm:w-2/3 bg-brand-blue hover:bg-brand-cyan text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand-blue/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="courseStore.isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ courseStore.isLoading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le cours') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, h } from 'vue'
import { useCourseStore } from '~/stores/courseStore'
import { storeToRefs } from 'pinia'
import type { Course, CreateCourseRequest } from '~/types/learning'

definePageMeta({
  layout: 'lms'
})

const courseStore = useCourseStore()
const { courses, isLoading } = storeToRefs(courseStore)

const columns = [
  { label: 'Cours', key: 'title' },
  { label: 'Étape', key: 'step' },
  { label: 'Durée', key: 'duration' },
  { label: 'État', key: 'status' }
]

const showModal = ref(false)
const isEditing = ref(false)
const currentId = ref<string | null>(null)

const form = reactive({
  stepId: '',
  title: '',
  description: '',
  contentType: 'video' as 'video' | 'audio' | 'text' | 'pdf',
  contentUrl: '',
  duration: 0,
  order: 1,
  isPublished: false,
  isActive: true
})

const resetForm = () => {
  form.stepId = ''
  form.title = ''
  form.description = ''
  form.contentType = 'video'
  form.contentUrl = ''
  form.duration = 0
  form.order = 1
  form.isPublished = false
  form.isActive = true
}

const openCreateModal = () => {
  isEditing.value = false
  currentId.value = null
  resetForm()
  showModal.value = true
}

const editCourse = (course: Course) => {
  isEditing.value = true
  currentId.value = course.id
  Object.assign(form, {
    stepId: course.stepId,
    title: course.title,
    description: course.description || '',
    contentType: course.contentType,
    contentUrl: course.contentUrl,
    duration: course.duration || 0,
    order: course.order || 1,
    isPublished: course.isPublished || false,
    isActive: course.isActive ?? true
  })
  showModal.value = true
}

const saveCourse = async () => {
  const payload: CreateCourseRequest = { ...form }
  
  let success = false
  if (isEditing.value && currentId.value) {
    success = await courseStore.updateCourse(currentId.value, payload)
  } else {
    success = await courseStore.createCourse(payload)
  }

  if (success) {
    showModal.value = false
  } else if (courseStore.error) {
    alert(courseStore.error)
  }
}

const deleteCourse = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
    await courseStore.deleteCourse(id)
  }
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return 'N/A'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getContentIcon = (type: string) => {
  const icons: Record<string, any> = {
    video: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    audio: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' })
    ]),
    text: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ]),
    pdf: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ])
  }
  return icons[type] || icons.text
}

onMounted(() => {
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
