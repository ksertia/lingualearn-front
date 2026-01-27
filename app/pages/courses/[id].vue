<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/courses" class="text-slate-400 hover:text-brand-blue flex items-center gap-1 text-sm font-bold mb-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour aux cours
        </NuxtLink>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-black text-xl shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h1 class="text-3xl font-black text-brand-blue tracking-tight">{{ course?.title || 'Chargement...' }}</h1>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>

      <div v-else-if="course" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Stats -->
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest text-[#000099]">Données du cours</h2>
            
            <div class="grid grid-cols-2 gap-8">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Type de contenu</span>
                <div class="text-xl font-black text-brand-blue uppercase">{{ course.contentType }}</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Durée</span>
                <div class="text-xl font-black text-slate-800">{{ formatDuration(course.duration) }}</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Taux de complétion</span>
                <div class="text-xl font-black text-emerald-500">92%</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Ordre</span>
                <div class="text-xl font-black text-slate-800">{{ course.order || 1 }}</div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-4">Description</h2>
            <p class="text-slate-600 leading-relaxed">{{ course.description || 'Aucune description disponible.' }}</p>
          </div>

          <!-- Content Preview / Link -->
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-6 font-blue">Lien vers le contenu</h2>
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span class="text-slate-500 font-mono text-sm truncate max-w-xs">{{ course.contentUrl }}</span>
                <a :href="course.contentUrl" target="_blank" class="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:bg-brand-cyan transition-all">
                    Ouvrir
                </a>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 class="text-lg font-black text-slate-800 mb-4">Paramètres</h3>
            <div class="space-y-4">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">ID de l'étape</span>
                <div class="text-xs font-mono bg-slate-50 p-2 rounded-lg break-all text-slate-600">{{ course.stepId }}</div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Actif</span>
                <span :class="course.isActive ? 'text-emerald-500' : 'text-rose-500'" class="font-black uppercase text-xs">
                  {{ course.isActive ? 'Oui' : 'Non' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Publié</span>
                <span :class="course.isPublished ? 'text-emerald-500' : 'text-slate-400'" class="font-black uppercase text-xs">
                  {{ course.isPublished ? 'Oui' : 'Non' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '~/stores/courseStore'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'lms'
})

const route = useRoute()
const courseId = route.params.id as string
const courseStore = useCourseStore()
const { courses, isLoading } = storeToRefs(courseStore)

const course = computed(() => (courses.value as any[]).find(c => c.id === courseId))

const formatDuration = (seconds?: number) => {
  if (!seconds) return 'N/A'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(async () => {
  if (courses.value.length === 0) {
    await courseStore.fetchCourses()
  }
})
</script>
