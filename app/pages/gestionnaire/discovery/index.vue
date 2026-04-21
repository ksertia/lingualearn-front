<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">

      <!-- Header -->
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
            Gestion de la Découverte
          </h1>
          <p class="text-slate-500 mt-1">
            Créez et gérez les sections de découverte pour les utilisateurs
          </p>
        </div>
        <button
            v-if="!showForm"
            class="px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
            @click="startCreating"
        >
          + Nouvelle section
        </button>
      </header>

      <!-- Formulaire -->
      <div v-if="showForm" class="animate-fade-in">
        <DiscoverySectionForm
            :section-id="editingSectionId ?? undefined"
            @cancel="resetForm"
            @saved="handleSaved"
        />
      </div>

      <!-- Liste des sections -->
      <div v-else>
        <!-- Chargement -->
        <div v-if="store.isLoadingAdminSections" class="text-center text-slate-500 py-12">
          <div class="inline-block w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p>Chargement des sections...</p>
        </div>

        <!-- État vide -->
        <div
            v-else-if="store.adminSections.length === 0"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center"
        >
          <div class="text-5xl mb-4">📚</div>
          <p class="text-slate-600 text-lg font-medium">Aucune section pour le moment</p>
          <p class="text-slate-400 text-sm mt-1 mb-6">
            Créez une première section pour commencer
          </p>
          <button
              class="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
              @click="startCreating"
          >
            + Créer une section
          </button>
        </div>

        <!-- Grille des sections -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
              v-for="section in store.adminSections"
              :key="section.id"
              class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
          >
            <!-- Badge type + ordre -->
            <div class="flex items-center justify-between mb-3">
              <span
                  class="px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="sectionTypeClass(section.type)"
              >
                {{ sectionTypeIcon(section.type) }} {{ sectionTypeLabel(section.type) }}
              </span>
              <span v-if="section.order !== undefined" class="text-xs text-slate-400">
                #{{ section.order }}
              </span>
            </div>

            <!-- Titre -->
            <h3 class="font-bold text-slate-900 text-base mb-2 line-clamp-2">
              {{ section.title }}
            </h3>

            <!-- Statistiques contenus -->
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <span
                  v-if="section.contents?.length"
                  class="px-2 py-1 rounded bg-blue-50 text-blue-600 font-semibold"
              >
                {{ section.contents.length }} contenu{{ section.contents.length > 1 ? 's' : '' }}
              </span>
              <span v-else class="px-2 py-1 rounded bg-slate-100 text-slate-400">
                Aucun contenu
              </span>
            </div>

            <!-- Aperçu des contenus -->
            <!--<div v-if="section.contents?.length" class="mt-3 space-y-1">
              <div
                  v-for="(content, i) in section.contents.slice(0, 3)"
                  :key="i"
                  class="text-xs text-slate-500 flex items-center gap-1.5 truncate"
              >
                <span>{{ mediaTypeIcon(content.questionType) }}</span>
                <span class="truncate">{{ content.questionValue || '—' }}</span>
              </div>
              <p v-if="section.contents.length > 3" class="text-xs text-slate-400 italic">
                + {{ section.contents.length - 3 }} autre(s)...
              </p>
            </div>-->

            <!-- Actions -->
            <div class="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              <button
                  class="flex-1 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-colors"
                  @click="startEditing(section.id!)"
              >
                Éditer
              </button>
              <button
                  class="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
                  :disabled="store.isDeletingAdminSection"
                  @click="deleteSection(section.id!)"
              >
                supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <Transition name="toast">
        <div
            v-if="toast.show"
            class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg"
            :class="toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'"
        >
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </Transition>
      <div v-if="sectionToDeleteId" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Supprimer la section</h3>
          <p class="text-sm text-slate-600 mb-6">La section et ses contenus seront supprimés définitivement.</p>
          <div class="flex justify-end gap-3">
            <button class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600" @click="sectionToDeleteId = null">Annuler</button>
            <button class="px-4 py-2 rounded-lg bg-red-600 text-white" @click="confirmDeleteSection">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import DiscoverySectionForm from "~/components/gestionnaire/Discoverysectionform.vue";
import { useDiscoveryStore } from "~/stores/discoveryStore";

definePageMeta({
  layout: "gestionnaire",
});

const store = useDiscoveryStore();

const showForm      = ref(false);
const editingSectionId = ref<string | null>(null);
const sectionToDeleteId = ref<string | null>(null);

const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' });


const sectionTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    audio: 'Audio', video: 'Vidéo', qcm: 'QCM', dragdrop: 'Glisser-déposer',
    lesson: 'Cours', exercise: 'Quiz',
  };
  return map[type] ?? type;
};

const sectionTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    audio: '🎵', video: '🎬', qcm: '☑️', dragdrop: '🔀',
  };
  return map[type];
};

const sectionTypeClass = (type: string) => {
  const map: Record<string, string> = {
    audio:    'bg-blue-100 text-blue-700',
    video:    'bg-purple-100 text-purple-700',
    qcm:      'bg-orange-100 text-orange-700',
    dragdrop: 'bg-emerald-100 text-emerald-700',
    lesson:   'bg-indigo-100 text-indigo-700',
    exercise:  'bg-amber-100 text-amber-700',
  };
  return map[type] ?? 'bg-slate-100 text-slate-600';
};

//const mediaTypeIcon = (type: string) => {
 // const map: Record<string, string> = {
    //text: '📝', audio: '🎵', image: '🖼️', video: '🎬', file: '📎',
  //};
  //return map[type];
//};

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.show    = true;
  toast.message = message;
  toast.type    = type;
  setTimeout(() => (toast.show = false), 3000);
};

const loadSections = async () => {
  try {
    await store.fetchAdminSections();
  } catch {
    showToast(store.adminError ?? 'Erreur lors du chargement des sections', 'error');
  }
};

const startCreating = () => {
  editingSectionId.value = null;
  showForm.value = true;
};

const startEditing = (sectionId: string) => {
  editingSectionId.value = sectionId;
  showForm.value = true;
};

const resetForm = () => {
  showForm.value = false;
  editingSectionId.value = null;
};

const handleSaved = async () => {
  resetForm();
  await loadSections();
  showToast('Section enregistrée avec succès');
};

const deleteSection = async (sectionId: string) => {
  sectionToDeleteId.value = sectionId;
};

const confirmDeleteSection = async () => {
  if (!sectionToDeleteId.value) return;
  const success = await store.deleteAdminSection(sectionToDeleteId.value);
  if (success) {
    showToast('La section a été supprimée avec succès.');
  } else {
    showToast(store.adminError ?? 'Erreur lors de la suppression', 'error');
  }
  sectionToDeleteId.value = null;
};

// ── Init ──────────────────────────────────────────────────────────────────────

onMounted(() => {
  loadSections();
});
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.25s ease-out;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>