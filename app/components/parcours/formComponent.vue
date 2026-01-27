<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <div class="max-w-4xl mx-auto mb-10 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-brand-blue tracking-tight">{{ isEdit ? 'Modifier le Parcours' : 'Nouveau Parcours' }}</h1>
        <p class="text-slate-500 text-sm mt-1">{{ isEdit ? 'Mettez à jour les informations de votre programme.' : 'Configurez votre programme et assignez-le à un apprenant.' }}</p>
      </div>
      <button 
        @click="navigateTo('/parcours')"
        class="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-brand-blue transition-all group shadow-sm hover:shadow-md border border-transparent hover:border-slate-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
    </div>

    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden p-8 md:p-12">
        <form @submit.prevent class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2 md:col-span-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Titre du parcours</label>
              <input 
                v-model="courseForm.title"
                type="text" 
                placeholder="Ex: Mooré intensif pour débutants"
                class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-brand-blue transition-all"
              >
            </div>
            <!-- <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Niveau</label>
              <select 
                v-model="courseForm.level"
                class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all appearance-none"
              >
                <option value="débutant">Débutant</option>
                <option value="intermédiaire">Intermédiaire</option>
                <option value="avancé">Avancé</option>
              </select>
            </div> -->
            <!-- <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Attribuer à</label>
              <select 
                v-model="courseForm.assignedTo"
                class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 focus:ring-2 focus:ring-brand-blue transition-all appearance-none"
              >
                <option value="">Sélectionner un étudiant</option>
                <option value="user_1">Jean Dupont</option>
                <option value="user_2">Marie Koné</option>
              </select>
            </div> -->
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              v-model="courseForm.description"
              rows="4"
              placeholder="Décrivez les objectifs pédagogiques..."
              class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-brand-blue transition-all resize-none"
            ></textarea>
          </div>

          <!-- <div class="space-y-2">
            <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contenu du cours</label>
            <div 
              class="relative border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center cursor-pointer group"
              :class="isDragging ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
            >
              <div v-if="!courseForm.file" class="text-center">
                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <svg class="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p class="font-bold text-slate-700 italic">Glissez votre fichier ici</p>
                <p class="text-xs text-slate-400 mt-1">PDF, MP4 ou ZIP (Max 50Mo)</p>
              </div>
              
              <div v-else class="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-brand-blue/10">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-700 truncate max-w-[200px]">{{ courseForm.file.name }}</p>
                    <p class="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{{ (courseForm.file.size / 1024 / 1024).toFixed(2) }} MB</p>
                  </div>
                </div>
                <button @click.stop="courseForm.file = null" class="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div> -->

          <div class="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <button 
              @click="submitParcours('brouillon')"
              :disabled="parcoursStore.isLoading"
              class="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
            >
              Enregistrer en brouillon
            </button>
            <button 
              @click="submitParcours('publié')"
              :disabled="parcoursStore.isLoading"
              class="w-full sm:w-auto bg-brand-blue hover:bg-brand-cyan text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-brand-blue/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span v-if="parcoursStore.isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ parcoursStore.isLoading ? 'Publication...' : 'Publier le parcours' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useParcoursStore } from '~/stores/parcoursStore';
import { useRoute } from 'vue-router';

const props = defineProps<{
  id?: string
}>();

const parcoursStore = useParcoursStore();
const route = useRoute();
const isDragging = ref(false);
const isEdit = ref(false);

const courseForm = reactive({
  title: '',
  description: '',
  isPublished: false,
});

onMounted(async () => {
  const pathId = props.id || route.params.id as string;
  if (pathId) {
    isEdit.value = true;
    // On cherche dans le store d'abord
    let existing = parcoursStore.allParcours.find(p => p.id === pathId);
    
    // Si pas trouvé (ex: refresh page), on peut soit fetch la liste soit fetch l'unité
    if (!existing) {
       await parcoursStore.fetchParcours();
       existing = parcoursStore.allParcours.find(p => p.id === pathId);
    }

    if (existing) {
      courseForm.title = existing.title;
      courseForm.description = existing.description;
      courseForm.isPublished = existing.isPublished || false;
    }
  }
});

function handleFileDrop(e: DragEvent) {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    // courseForm.file = files[0];
  }
}

async function submitParcours(status: 'brouillon' | 'publié') {
  if (!courseForm.title) return alert('Le titre est requis');
  
  const payload: any = {
    title: courseForm.title,
    description: courseForm.description,
    isPublished: status === 'publié'
  };

  let result = false;
  const pathId = props.id || route.params.id as string;
  
  console.log("Submitting parcours form:", { isEdit: isEdit.value, pathId, payload });

  if (isEdit.value && pathId) {
    result = await parcoursStore.updateParcours(pathId, payload);
  } else {
    result = await parcoursStore.createParcours(payload);
  }
  
  if (result) {
    navigateTo('/parcours');
  } else if (parcoursStore.error) {
    alert(parcoursStore.error);
  }
}
</script>

<style scoped>
.max-w-4xl {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

textarea::-webkit-scrollbar {
  width: 6px;
}
textarea::-webkit-scrollbar-thumb {
  background-color: #f1f5f9;
  border-radius: 10px;
}
</style>
