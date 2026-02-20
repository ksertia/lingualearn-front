<template>
  <section class="max-w-5xl mx-auto p-8 pb-32">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <button 
          @click="router.back()"
          class="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Configuration de l'étape</h1>
          <p class="text-slate-500 font-medium">Édition du contenu et des paramètres</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="saveStep"
          :disabled="isSaving"
          class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all disabled:bg-slate-300 disabled:shadow-none flex items-center gap-2"
        >
          <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-500 font-bold animate-pulse">Chargement de l'étape...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Sidebar Settings -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 pb-4 border-b border-slate-50">Paramètres généraux</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Titre</label>
              <input 
                v-model="stepData.title" 
                class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea 
                v-model="stepData.description" 
                rows="3"
                class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-600 resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Minute(s)</label>
                <input 
                  v-model.number="stepData.estimatedMinutes" 
                  type="number"
                  class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ordre</label>
                <input 
                  v-model.number="stepData.index" 
                  type="number"
                  class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                />
              </div>
            </div>

            <div class="pt-4">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="stepData.isActive" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span class="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Étape active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Editor Content -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30 flex justify-between items-center">
            <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">
              Contenu du {{ stepData.stepType === 'lesson' ? 'Cours' : 'Quiz' }}
            </h3>
            <span :class="[
              'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
              stepData.stepType === 'lesson' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
            ]">
              {{ stepData.stepType === 'lesson' ? 'Mode Éditeur' : 'Mode Configuration' }}
            </span>
          </div>

          <div class="p-8">
            <template v-if="stepData.stepType === 'lesson'">
              <StepEditor v-model="stepData.content" />
            </template>
            <template v-else-if="stepData.stepType === 'quiz'">
              <QuizEditor v-model="stepData.content" />
            </template>
            <template v-else>
               <div class="py-12 text-center">
                 <p class="text-slate-400 font-medium italic">Contenu non géré pour ce type d'étape (exercice)</p>
               </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStepStore } from '~/stores/stepStore';
import StepEditor from '@/components/Module-formateur/Step/StepEditor.vue';
import QuizEditor from '@/components/Module-formateur/Step/QuizEditor.vue';
import { useApiService } from '~/services/api';

definePageMeta({
  layout: "formateur",
});

const route = useRoute();
const router = useRouter();
const stepStore = useStepStore();
const api = useApiService();

const id = String(route.params.id);
const isLoading = ref(true);
const isSaving = ref(false);

const stepData = ref<any>({
  title: '',
  description: '',
  estimatedMinutes: 15,
  index: 0,
  isActive: true,
  stepType: 'lesson',
  content: null
});

onMounted(async () => {
  try {
    const response: any = await api.getStep(id); // I need to ensure getStep exists
    if (response) {
      stepData.value = { ...response };
      // Handle content if it's stored as string
      if (typeof stepData.value.content === 'string') {
        try {
          stepData.value.content = JSON.parse(stepData.value.content);
        } catch (e) {}
      }
    }
  } catch (err) {
    console.error("Erreur chargement étape:", err);
  } finally {
    isLoading.value = false;
  }
});

const saveStep = async () => {
  isSaving.value = true;
  try {
    const payload = { 
      ...stepData.value,
      content: JSON.stringify(stepData.value.content)
    };
    const success = await stepStore.updateStep(id, payload);
    if (success) {
      // Small toast or notification could go here
    }
  } catch (err) {
    console.error("Erreur sauvegarde:", err);
  } finally {
    isSaving.value = false;
  }
};
</script>
