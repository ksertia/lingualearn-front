<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/steps" class="text-slate-400 hover:text-brand-blue flex items-center gap-1 text-sm font-bold mb-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour aux étapes
        </NuxtLink>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-black text-xl shadow-lg">
            {{ step?.stepNumber }}
          </div>
          <h1 class="text-3xl font-black text-brand-blue tracking-tight">{{ step?.title || 'Chargement...' }}</h1>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>

      <div v-else-if="step" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Stats -->
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest text-[#000099]">Détails de l'étape</h2>
            
            <div class="grid grid-cols-2 gap-8">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Durée estimée</span>
                <div class="text-xl font-black text-slate-800">{{ step.estimatedDurationMinutes || 0 }} min</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Récompense XP</span>
                <div class="text-xl font-black text-brand-blue">{{ step.xpReward || 0 }} XP</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Taux de passage</span>
                <div class="text-xl font-black text-emerald-500">89%</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Statut</span>
                <div class="mt-1">
                  <span :class="step.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'" class="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border inline-block">
                    {{ step.isPublished ? 'Publié' : 'Brouillon' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Content (Courses) -->
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-6">Cours associés</h2>
            <div class="space-y-4">
              <div v-for="course in step.courses" :key="course.id" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="font-bold text-slate-700">{{ course.title }}</span>
                <NuxtLink :to="`/courses/${course.id}`" class="text-xs font-black text-brand-blue uppercase tracking-widest hover:text-brand-cyan transition-colors">
                  Voir le cours
                </NuxtLink>
              </div>
              <div v-if="!step.courses?.length" class="text-slate-400 text-center py-4 italic">
                Aucun cours défini pour cette étape.
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 class="text-lg font-black text-slate-800 mb-4 font-blue">Informations</h3>
            <div class="space-y-4">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">ID du Niveau</span>
                <div class="text-sm font-mono bg-slate-50 p-2 rounded-lg break-all text-slate-600">{{ step.levelId }}</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Créé le</span>
                <div class="text-sm text-slate-600">{{ step.createdAt ? new Date(step.createdAt).toLocaleDateString() : 'N/A' }}</div>
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
import { useStepStore } from '~/stores/stepStore'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'lms'
})

const route = useRoute()
const stepId = route.params.id as string
const stepStore = useStepStore()
const { steps, isLoading } = storeToRefs(stepStore)

const step = computed(() => (steps.value as any[]).find(s => s.id === stepId))

onMounted(async () => {
  if (steps.value.length === 0) {
    await stepStore.fetchSteps()
  }
})
</script>
