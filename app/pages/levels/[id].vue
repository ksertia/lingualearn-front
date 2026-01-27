<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <NuxtLink to="/levels" class="text-slate-400 hover:text-brand-blue flex items-center gap-1 text-sm font-bold mb-2 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour aux niveaux
          </NuxtLink>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-black text-xl shadow-lg">
              {{ level?.levelNumber }}
            </div>
            <h1 class="text-3xl font-black text-brand-blue tracking-tight">{{ level?.name || 'Chargement...' }}</h1>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>

      <div v-else-if="level" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Stats -->
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest text-[#000099]">Attributs du niveau</h2>
            
            <div class="grid grid-cols-2 gap-8">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">XP Récompense</span>
                <div class="text-xl font-black text-brand-blue">{{ (level as any).xpReward || 0 }} XP</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Pièces Récompense</span>
                <div class="text-xl font-black text-brand-orange text-[#FF7F00]">{{ (level as any).coinReward || 0 }} Pièces</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Complété par les élèves</span>
                <div class="text-xl font-black text-emerald-500">72%</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Difficulté moyenne</span>
                <div class="text-xl font-black text-slate-800 text-brand-cyan">Modérée</div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-4">Description</h2>
            <p class="text-slate-600 leading-relaxed">{{ level.description }}</p>
          </div>

          <!-- Content (Steps) -->
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 class="text-xl font-black text-slate-800 mb-6">Étapes incluses</h2>
            <div class="space-y-4">
              <div v-for="step in level.steps" :key="step.id" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-blue/30 transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-brand-blue shadow-sm">
                        {{ step.stepNumber }}
                    </div>
                    <span class="font-bold text-slate-700">{{ step.title }}</span>
                </div>
                <NuxtLink :to="`/steps/${step.id}`" class="text-xs font-black text-brand-blue uppercase tracking-widest hover:text-brand-cyan transition-colors">
                  Voir l'étape
                </NuxtLink>
              </div>
              <div v-if="!level.steps?.length" class="text-slate-400 text-center py-4 italic">
                Aucune étape définie pour ce niveau.
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 class="text-lg font-black text-slate-800 mb-4 font-blue">Propriétés</h3>
            <div class="space-y-4">
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Points totaux</span>
                <div class="text-lg font-black text-slate-800">{{ (level as any).points || 0 }}</div>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Publié</span>
                <div class="mt-1">
                  <span :class="level.isPublished ? 'bg-brand-cyan/10 text-brand-cyan' : 'bg-slate-100 text-slate-400'" class="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                    {{ level.isPublished ? 'Oui' : 'Non' }}
                  </span>
                </div>
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
import { useLevelStore } from '~/stores/levelStore'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'lms'
})

const route = useRoute()
const levelId = route.params.id as string
const levelStore = useLevelStore()
const { levels, isLoading } = storeToRefs(levelStore)

const level = computed(() => levels.value.find(l => l.id === levelId))

onMounted(async () => {
  if (levels.value.length === 0) {
    await levelStore.fetchLevels()
  }
})
</script>
