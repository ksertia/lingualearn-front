<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <NuxtLink to="/parcours" class="text-slate-400 hover:text-brand-blue flex items-center gap-1 text-sm font-bold mb-2 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour aux parcours
          </NuxtLink>
          <h1 class="text-3xl font-black text-brand-blue tracking-tight">{{ parcours?.title || 'Chargement...' }}</h1>
        </div>
        <div class="flex gap-3">
          <button @click="navigateTo(`/parcours/${parcoursId}/edit`)" class="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            Modifier
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>

      <div v-else-if="parcours" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Stats -->
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest text-[#000099]">Résumé de la progression</h2>
            
            <div class="space-y-8">
              <!-- Completé -->
              <div>
                <div class="flex justify-between items-end mb-2">
                  <span class="text-slate-500 font-bold uppercase text-xs tracking-widest">Global Complété</span>
                  <span class="text-2xl font-black text-brand-blue">{{ mockStats.completion }}%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                  <div class="bg-gradient-to-r from-brand-blue to-brand-cyan h-full rounded-full transition-all duration-1000" :style="{ width: `${mockStats.completion}%` }"></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-8">
                <div>
                  <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Temps estimé restant</span>
                  <div class="text-xl font-black text-slate-800">{{ mockStats.timeRemaining }}</div>
                </div>
                <div>
                  <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Taux de réussite moyen</span>
                  <div class="text-xl font-black text-emerald-500">{{ mockStats.successRate }}%</div>
                </div>
                <div>
                  <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Date de début</span>
                  <div class="text-xl font-black text-slate-800">{{ mockStats.startDate }}</div>
                </div>
                <div>
                  <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Apprenants actifs</span>
                  <div class="text-xl font-black text-slate-800">{{ mockStats.activeLearners }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-4">Description du parcours</h2>
            <p class="text-slate-600 leading-relaxed">{{ parcours.description }}</p>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="bg-brand-blue rounded-[2rem] p-8 text-white shadow-xl shadow-brand-blue/20">
            <h3 class="text-lg font-black mb-4">Structure</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-blue-100 text-sm">Niveaux</span>
                <span class="font-black">{{ parcours.levels?.length || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100 text-sm">État</span>
                <span class="px-2 py-1 bg-white/20 rounded-lg text-xs font-black uppercase tracking-widest">
                  {{ parcours.isPublished ? 'Publié' : 'Brouillon' }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 class="text-lg font-black text-slate-800 mb-4">Dernière activité</h3>
            <p class="text-sm text-slate-500">Mise à jour le {{ new Date(parcours.updatedAt || parcours.createdAt || Date.now()).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useParcoursStore } from '~/stores/parcoursStore'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'lms'
})

const route = useRoute()
const parcoursId = route.params.id as string
const parcoursStore = useParcoursStore()
const { allParcours, isLoading } = storeToRefs(parcoursStore)

const parcours = computed(() => allParcours.value.find(p => p.id === parcoursId))

const mockStats = ref({
  completion: 68,
  timeRemaining: '12h 30min',
  startDate: '12 Janv. 2024',
  successRate: 84,
  activeLearners: 124
})

onMounted(async () => {
  if (allParcours.value.length === 0) {
    await parcoursStore.fetchParcours()
  }
})
</script>
