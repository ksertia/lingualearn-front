<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/exercises" class="text-slate-400 hover:text-brand-blue flex items-center gap-1 text-sm font-bold mb-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour aux exercices
        </NuxtLink>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-black text-xl shadow-lg">
            {{ getExerciseIcon(exercise?.exerciseType) }}
          </div>
          <h1 class="text-3xl font-black text-brand-blue tracking-tight">{{ exercise?.title || 'Chargement...' }}</h1>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>

      <div v-else-if="exercise" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest text-[#000099]">Configuration</h2>
            
            <div class="grid grid-cols-2 gap-8">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Type</span>
                <div class="text-xl font-black text-brand-blue uppercase">{{ exercise.exerciseType }}</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Points</span>
                <div class="text-xl font-black text-slate-800">{{ exercise.points || 0 }} pts</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">XP Récompensé</span>
                <div class="text-xl font-black text-brand-cyan">{{ exercise.xpReward || 0 }} XP</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Statut</span>
                <div class="mt-1">
                  <span :class="exercise.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'" class="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border inline-block">
                    {{ exercise.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-4 font-blue">Instructions</h2>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed italic">
                "{{ exercise.instructions || 'Aucune instruction fournie.' }}"
            </div>
          </div>

          <!-- Content JSON Preview (Simplified) -->
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-4">Structure du contenu</h2>
            <div class="bg-slate-900 rounded-2xl p-6 overflow-hidden">
                <pre class="text-emerald-400 text-xs font-mono overflow-x-auto">{{ JSON.stringify(exercise.content, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 class="text-lg font-black text-slate-800 mb-4">Contexte</h3>
            <div class="space-y-4">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Cours (Lesson) ID</span>
                <div class="text-xs font-mono bg-slate-50 p-2 rounded-lg break-all text-slate-600">{{ exercise.lessonId }}</div>
              </div>
              <div v-if="course">
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Titre du cours</span>
                <NuxtLink :to="`/courses/${course.id}`" class="text-sm font-bold text-brand-blue hover:underline">{{ course.title }}</NuxtLink>
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
import { useExerciseStore } from '~/stores/exerciseStore'
import { useCourseStore } from '~/stores/courseStore'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'lms'
})

const route = useRoute()
const exerciseId = route.params.id as string
const exerciseStore = useExerciseStore()
const courseStore = useCourseStore()
const { exercises, isLoading } = storeToRefs(exerciseStore)
const { courses } = storeToRefs(courseStore)

const exercise = computed(() => (exercises.value as any[]).find(e => e.id === exerciseId))
const course = computed(() => courses.value.find(c => c.id === (exercise.value as any)?.lessonId))

const getExerciseIcon = (type?: string) => {
  switch (type) {
    case 'multiple_choice': return '?'
    case 'fill_blank': return '_'
    case 'matching': return '='
    default: return 'E'
  }
}

onMounted(async () => {
  if (exercises.value.length === 0) {
    await exerciseStore.fetchExercises()
  }
  if (courses.value.length === 0) {
    await courseStore.fetchCourses()
  }
})
</script>
