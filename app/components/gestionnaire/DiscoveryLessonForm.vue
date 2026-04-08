<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">
        {{ editingId ? 'Éditer la leçon' : 'Créer une nouvelle leçon' }}
      </h2>

      <!-- Form Fields -->
      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Titre de la leçon *
          </label>
          <input
            v-model="formData.title"
            type="text"
            class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            placeholder="Ex: Grammaire Française"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            v-model="formData.description"
            class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            rows="3"
            placeholder="Description de la leçon"
          />
        </div>

        <!-- Language Code -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Langue *
          </label>
          <select
            v-model="formData.languageCode"
            class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">Sélectionner une langue</option>
            <option v-for="lang in availableLanguages" :key="lang.id" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <!-- Media Upload -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Type de média
          </label>
          <div class="grid gap-3 md:grid-cols-2">
            <select
              v-model="selectedMediaType"
              class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">Sélectionner un média</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="video">Vidéo</option>
            </select>
            <div class="flex items-center gap-4">
              <input
                ref="fileInputRef"
                type="file"
                :accept="selectedMediaType === 'image' ? 'image/*' : selectedMediaType === 'audio' ? 'audio/*' : selectedMediaType === 'video' ? 'video/*' : '*/*'"
                class="hidden"
                @change="handleFileSelect"
              />
              <button
                type="button"
                class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200"
                :disabled="!selectedMediaType"
                @click="fileInputRef?.click()"
              >
                Choisir le fichier
              </button>
            </div>
          </div>
          <p class="text-sm text-slate-500 mt-2" v-if="selectedFile">
            Fichier sélectionné : {{ selectedFile.name }}
          </p>
          <p class="text-sm text-slate-400 mt-2" v-else>
            Choisissez d'abord un type de média puis un fichier.
          </p>
        </div>

        <!-- Publish Status -->
        <div>
          <label class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              v-model="formData.isPublished"
              type="checkbox"
              class="rounded border-slate-300"
            />
            Publier cette leçon
          </label>
        </div>
      </div>

      <!-- Sections -->
      <div class="mt-8 pt-8 border-t border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-900">Sections</h3>
          <button
            type="button"
            class="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
            @click="addSection"
          >
            + Ajouter une section
          </button>
        </div>

        <div v-for="(section, sIndex) in formData.sections" :key="sIndex" class="mb-6 p-4 border border-slate-200 rounded-lg">
          <div class="space-y-3">
            <!-- Section Title -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">
                Titre de la section *
              </label>
              <input
                v-model="section.title"
                type="text"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Ex: Verbes réguliers"
              />
            </div>

            <!-- Section Description -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                v-model="section.description"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                rows="2"
                placeholder="Description de la section"
              />
            </div>

            <!-- Exercises -->
            <div class="mt-4">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-semibold text-slate-600">Exercices</label>
                <button
                  type="button"
                  class="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                  @click="addExercise(sIndex)"
                >
                  + Ajouter
                </button>
              </div>

              <div v-for="(exercise, eIndex) in section.exercises" :key="eIndex" class="mb-3 p-3 bg-slate-50 rounded border border-slate-200">
                <div class="space-y-2 text-sm">
                  <!-- Exercise Type -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">
                      Type d'exercice
                    </label>
                    <select
                      v-model="exercise.type"
                      class="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    >
                      <option value="multiple_choice">Choix multiples</option>
                      <option value="fill_blank">Remplir les blancs</option>
                      <option value="matching">Appariement</option>
                      <option value="text">Texte libre</option>
                    </select>
                  </div>

                  <!-- Exercise Question -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">
                      Question/Énoncé *
                    </label>
                    <textarea
                      v-model="exercise.question"
                      class="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                      rows="2"
                      placeholder="Question ou énoncé"
                    />
                  </div>

                  <!-- Exercise Content (JSON) -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">
                      Contenu (JSON)
                    </label>
                    <textarea
                      v-model="exercise.contentJson"
                      class="w-full rounded border border-slate-300 px-2 py-1 text-xs font-mono"
                      rows="3"
                      placeholder='{"options": [], "correctAnswer": 0}'
                    />
                  </div>

                  <!-- Remove Button -->
                  <button
                    type="button"
                    class="w-full px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200"
                    @click="removeExercise(sIndex, eIndex)"
                  >
                    Supprimer cet exercice
                  </button>
                </div>
              </div>
            </div>

            <!-- Remove Section Button -->
            <button
              type="button"
              class="w-full px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-bold hover:bg-red-200"
              @click="removeSection(sIndex)"
            >
              Supprimer cette section
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          class="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          {{ isSubmitting ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Créer la leçon') }}
        </button>
        <button
          type="button"
          class="flex-1 px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
          @click="$emit('cancel')"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Toast Message -->
    <div
      v-if="toast.show"
      class="fixed bottom-6 right-6 z-50 transition-all duration-300 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg"
      :class="toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'"
    >
      <span class="font-medium">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useApiService } from "~/services/api";
import type { DiscoveryLanguage } from "~/types/discovery";

const props = defineProps<{
  lessonId?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  saved: [];
}>();

const api = useApiService();

const formData = reactive({
  title: "",
  description: "",
  languageCode: "",
  isPublished: false,
  sections: [] as any[],
});

const availableLanguages = ref<DiscoveryLanguage[]>([]);
const selectedMediaType = ref<string>("");
const selectedFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isSubmitting = ref(false);
const editingId = props.lessonId || null;

const toast = reactive({ show: false, message: "", type: "success" as "success" | "error" });

const showToast = (message: string, type: "success" | "error" = "success") => {
  toast.show = true;
  toast.message = message;
  toast.type = type;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

const loadLanguages = async () => {
  try {
    const response = await api.discoverLanguages();
    const data = response.data || response;
    availableLanguages.value = Array.isArray(data) ? data : [];
  } catch (error) {
    showToast("Erreur lors du chargement des langues", "error");
    console.error(error);
  }
};

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    selectedFile.value = file;
  }
};

const addSection = () => {
  formData.sections.push({
    id: `section-${Date.now()}`,
    title: "",
    description: "",
    index: formData.sections.length,
    exercises: [],
  });
};

const removeSection = (index: number) => {
  formData.sections.splice(index, 1);
};

const addExercise = (sectionIndex: number) => {
  const section = formData.sections[sectionIndex];
  if (!section) return;

  section.exercises.push({
    id: `exercise-${Date.now()}`,
    type: "multiple_choice",
    question: "",
    index: section.exercises.length,
    contentJson: "",
  });
};

const removeExercise = (sectionIndex: number, exerciseIndex: string | number) => {
  const section = formData.sections[sectionIndex];
  if (!section) return;

  section.exercises.splice(Number(exerciseIndex), 1);
};

const handleSubmit = async () => {
  if (!formData.title || !formData.languageCode) {
    showToast("Veuillez remplir tous les champs obligatoires", "error");
    return;
  }

  isSubmitting.value = true;

  try {
    // Créer FormData pour l'upload
    const lessonData = {
      title: formData.title,
      description: formData.description,
      languageCode: formData.languageCode,
      isPublished: formData.isPublished,
      content: "",
      sections: formData.sections.map((section) => ({
        ...section,
        exercises: section.exercises.map((ex: any) => ({
          ...ex,
          content: ex.contentJson ? JSON.parse(ex.contentJson) : {},
        })),
      })),
    };

    const formDataPayload = new FormData();
    formDataPayload.append("lessonData", JSON.stringify(lessonData));

    if (selectedMediaType.value === "image") {
      if (selectedFile.value) {
        formDataPayload.append("thumbnail", selectedFile.value);
      } else {
        formDataPayload.append("thumbnail", "");
      }
      formDataPayload.append("audioFiles", "");
      formDataPayload.append("videoFiles", "");
    } else if (selectedMediaType.value === "audio") {
      if (selectedFile.value) {
        formDataPayload.append("audioFiles", selectedFile.value);
      } else {
        formDataPayload.append("audioFiles", "");
      }
      formDataPayload.append("thumbnail", "");
      formDataPayload.append("videoFiles", "");
    } else if (selectedMediaType.value === "video") {
      if (selectedFile.value) {
        formDataPayload.append("videoFiles", selectedFile.value);
      } else {
        formDataPayload.append("videoFiles", "");
      }
      formDataPayload.append("thumbnail", "");
      formDataPayload.append("audioFiles", "");
    } else {
      formDataPayload.append("thumbnail", "");
      formDataPayload.append("audioFiles", "");
      formDataPayload.append("videoFiles", "");
    }

    if (editingId) {
      await api.updateDiscoverLesson(editingId, formDataPayload as any);
      showToast("Leçon mise à jour avec succès");
    } else {
      await api.createDiscoverLesson(formDataPayload as any);
      showToast("Leçon créée avec succès");
    }

    emit("saved");
  } catch (error: any) {
    console.error("Erreur:", error);
    showToast(error?.message || "Erreur lors de l'enregistrement", "error");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadLanguages();
});
</script>

<style scoped></style>
