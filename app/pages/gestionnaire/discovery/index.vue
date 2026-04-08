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
            Créez et gérez les leçons de découverte pour les utilisateurs
          </p>
        </div>
        <button
          v-if="!showForm"
          class="px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
          @click="startCreating"
        >
          + Nouvelle leçon
        </button>
      </header>

      <!-- Form Section -->
      <div v-if="showForm" class="animate-fade-in">
        <DiscoveryLessonForm
          :lesson-id="editingLessonId || undefined"
          @cancel="resetForm"
          @saved="handleSaved"
        />
      </div>

      <!-- Lessons List -->
      <div v-else>
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center text-slate-500 py-10">
          Chargement des leçons...
        </div>

        <!-- Empty State -->
        <div v-else-if="lessons.length === 0" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p class="text-slate-500 text-lg">Aucune leçon pour le moment</p>
          <p class="text-slate-400 text-sm mt-1">
            Créez une première leçon pour commencer
          </p>
        </div>

        <!-- Lessons Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="lesson in lessons"
            :key="lesson.id"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
          >
            <!-- Thumbnail -->
            <div v-if="lesson.thumbnail" class="mb-4 rounded-lg overflow-hidden bg-slate-100 h-40">
              <img :src="lesson.thumbnail" :alt="lesson.title" class="w-full h-full object-cover" />
            </div>
            <div v-else class="mb-4 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 h-40 flex items-center justify-center">
              <span class="text-slate-400">Aucune image</span>
            </div>

            <!-- Content -->
            <h3 class="font-bold text-slate-900">{{ lesson.title }}</h3>
            <p class="text-sm text-slate-600 mt-1 line-clamp-2">
              {{ lesson.description || 'Aucune description' }}
            </p>

            <!-- Meta -->
            <div class="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span class="px-2 py-1 rounded bg-slate-100">
                {{ lesson.languageCode }}
              </span>
              <span v-if="lesson.sections?.length" class="px-2 py-1 rounded bg-blue-100 text-blue-700">
                {{ lesson.sections.length }} section{{ lesson.sections.length > 1 ? 's' : '' }}
              </span>
              <span
                v-if="lesson.isPublished"
                class="px-2 py-1 rounded bg-emerald-100 text-emerald-700"
              >
                Publié
              </span>
              <span v-else class="px-2 py-1 rounded bg-slate-100 text-slate-600">
                Brouillon
              </span>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex gap-2">
              <button
                class="flex-1 px-3 py-2 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold hover:bg-indigo-200"
                @click="startEditing(lesson.id)"
              >
                Éditer
              </button>
              <button
                class="flex-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200"
                @click="togglePublish(lesson.id, !lesson.isPublished)"
                :disabled="isToggling"
              >
                {{ lesson.isPublished ? 'Dépublier' : 'Publier' }}
              </button>
              <button
                class="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-bold hover:bg-red-200"
                @click="deleteLesson(lesson.id)"
                :disabled="isDeleting"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 transition-all duration-300 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg"
        :class="toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'"
      >
        <span class="font-medium">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import DiscoveryLessonForm from "~/components/gestionnaire/DiscoveryLessonForm.vue";
import { useApiService } from "~/services/api";
import type { DiscoveryLessonAdmin } from "~/types/discovery";

definePageMeta({
  layout: "gestionnaire",
});

const api = useApiService();

const lessons = ref<DiscoveryLessonAdmin[]>([]);
const showForm = ref(false);
const editingLessonId = ref<string | null>(null);
const isLoading = ref(false);
const isDeleting = ref(false);
const isToggling = ref(false);

const toast = reactive({ show: false, message: "", type: "success" as "success" | "error" });

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.show = true;
  toast.message = message;
  toast.type = type;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

const loadLessons = async () => {
  isLoading.value = true;
  try {
    const response = await api.getDiscoverLessons({});
    const data = response.data || response;
    lessons.value = Array.isArray(data) ? data : [];
  } catch (error) {
    showToast("Erreur lors du chargement des leçons", "error");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const startCreating = () => {
  editingLessonId.value = null;
  showForm.value = true;
};

const startEditing = (lessonId: string) => {
  editingLessonId.value = lessonId;
  showForm.value = true;
};

const resetForm = () => {
  showForm.value = false;
  editingLessonId.value = null;
};

const handleSaved = async () => {
  resetForm();
  await loadLessons();
  showToast("Leçon enregistrée avec succès");
};

const togglePublish = async (lessonId: string, isPublished: boolean) => {
  isToggling.value = true;
  try {
    await api.publishDiscoverLesson(lessonId);
    const lesson = lessons.value.find((l) => l.id === lessonId);
    if (lesson) {
      lesson.isPublished = isPublished;
    }
    showToast(isPublished ? "Leçon publiée" : "Leçon dépubliée");
  } catch (error) {
    showToast("Erreur lors de la mise à jour du statut", "error");
    console.error(error);
  } finally {
    isToggling.value = false;
  }
};

const deleteLesson = async (lessonId: string) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette leçon?")) return;

  isDeleting.value = true;
  try {
    await api.deleteDiscoverLesson(lessonId);
    lessons.value = lessons.value.filter((l) => l.id !== lessonId);
    showToast("Leçon supprimée");
  } catch (error) {
    showToast("Erreur lors de la suppression", "error");
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  loadLessons();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in;
}
</style>
