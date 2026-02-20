<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-white to-gray-50/50">
      <div>
        <h3 class="text-xl font-bold text-slate-800">Étapes du parcours</h3>
        <p class="text-slate-500 text-sm mt-1">Gérez le contenu et l'ordre des étapes</p>
      </div>
      <div v-if="steps.length > 0" class="flex items-center gap-2">
        <span class="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 uppercase tracking-wider">
          {{ steps.length }} Étape{{ steps.length > 1 ? 's' : '' }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-12 flex flex-col items-center justify-center space-y-4">
      <div class="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
      <p class="text-slate-500 font-medium animate-pulse">Chargement des étapes...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="steps.length === 0" class="p-16 flex flex-col items-center justify-center text-center">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h4 class="text-lg font-semibold text-slate-700">Aucune étape trouvée</h4>
      <p class="text-slate-500 max-w-xs mt-2">Commencez par ajouter une première étape à votre parcours pédagogique.</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50">
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ordre</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Titre & Description</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Durée</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="step in steps" :key="step.id" :class="[
            'group transition-all duration-200',
            step.isActive ? 'hover:bg-indigo-50/30' : 'bg-slate-50/50 opacity-70 grayscale-[0.5]'
          ]">
            <td class="px-6 py-4">
              <span :class="[
                'flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm transition-all',
                step.isActive ? 'bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-slate-200 text-slate-400'
              ]">
                {{ step.index }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{{ step.title }}</span>
                <span class="text-xs text-slate-500 line-clamp-1 mt-0.5">{{ step.description || 'Pas de description' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="[
                'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                step.stepType === 'lesson' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                step.stepType === 'quiz' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                'bg-blue-50 text-blue-700 border-blue-100'
              ]">
                {{ stepTypeLabel(step.stepType) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button 
                @click="toggleStatus(step)"
                class="relative inline-flex items-center cursor-pointer group/toggle"
              >
                <div 
                  class="w-10 h-5 rounded-full transition-all duration-300"
                  :class="step.isActive ? 'bg-indigo-600' : 'bg-slate-300'"
                ></div>
                <div 
                  class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm"
                  :class="step.isActive ? 'translate-x-5' : 'translate-x-0'"
                ></div>
                <span class="ml-3 text-[10px] font-bold uppercase tracking-tighter" :class="step.isActive ? 'text-indigo-600' : 'text-slate-400'">
                  {{ step.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </button>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 font-medium">
              <div class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ step.estimatedMinutes }}m
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  @click="editStep(step)"
                  class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Modifier le contenu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  @click="confirmDelete(step)"
                  class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStepStore } from '~/stores/stepStore';
import { storeToRefs } from 'pinia';
import type { Step } from '~/types/learning';

const props = defineProps<{
  pathId: string;
}>();

const stepStore = useStepStore();
const { steps, isLoading } = storeToRefs(stepStore);
const router = useRouter();

// Fetch steps on mount
onMounted(() => {
  stepStore.fetchSteps(props.pathId);
});

const stepTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'lesson': 'Cours',
    'quiz': 'Quiz',
    'exercise': 'Exercice'
  };
  return labels[type] || type;
};

const editStep = (step: Step) => {
  router.push(`/module-formateur/etapes/edit/${step.id}`);
};

const toggleStatus = async (step: Step) => {
  const newStatus = !step.isActive;
  // On met à jour localement pour une réactivité immédiate (optimistique)
  step.isActive = newStatus;
  
  const success = await stepStore.updateStep(step.id, { isActive: newStatus });
  if (!success) {
    // Revenir en arrière si l'API échoue
    step.isActive = !newStatus;
  }
};

const confirmDelete = async (step: Step) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'étape "${step.title}" ?`)) {
    const success = await stepStore.deleteStep(step.id);
    if (success) {
      // Refresh current list
      stepStore.fetchSteps(props.pathId);
    }
  }
};
</script>
