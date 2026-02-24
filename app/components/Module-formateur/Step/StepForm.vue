<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
    <div class="flex items-center gap-3 mb-8">
      <div
        class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-xl font-bold text-slate-800">Nouvelle étape</h3>
        <p class="text-slate-500 text-sm">
          Définissez les bases de votre nouvelle leçon ou quiz
        </p>
      </div>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <!-- Titre -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-slate-700 mb-2"
          >Titre de l'étape *</label
        >
        <input
          v-model="form.title"
          type="text"
          placeholder="ex: Introduction à la grammaire"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
          required
        />
      </div>

      <!-- Description -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-slate-700 mb-2"
          >Description</label
        >
        <textarea
          v-model="form.description"
          placeholder="Bref résumé de ce que l'étudiant va apprendre..."
          rows="2"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
        ></textarea>
      </div>

      <!-- Type -->
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2"
          >Type d'étape *</label
        >
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="type in types"
            :key="type.id"
            type="button"
            @click="form.stepType = type.id"
            :class="[
              'px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-2',
              form.stepType === type.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50',
            ]"
          >
            <span class="text-lg">{{ type.icon }}</span>
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- Durée -->
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2"
          >Durée estimée (minutes)</label
        >
        <div class="relative">
          <input
            v-model.number="form.estimatedMinutes"
            type="number"
            class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 transition-all outline-none"
          />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="md:col-span-2 pt-4 flex justify-end gap-3">
        <button
          type="button"
          @click="reset"
          class="px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
        >
          Réinitialiser
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all disabled:bg-slate-300 disabled:shadow-none"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Création...
          </span>
          <span v-else>Créer l'étape</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useStepStore } from "~/stores/stepStore";
import { storeToRefs } from "pinia";

const props = defineProps<{
  pathId: string;
}>();

const emit = defineEmits(["created"]);

const stepStore = useStepStore();
const { isLoading } = storeToRefs(stepStore);

const types: {
  id: "lesson" | "quiz" | "exercise";
  label: string;
  icon: string;
}[] = [
  { id: "lesson", label: "Cours", icon: "📖" },
  { id: "quiz", label: "Quiz", icon: "📝" },
  { id: "exercise", label: "Exercice", icon: "🏋️" },
];

const form = reactive({
  title: "",
  description: "",
  stepType: "lesson" as "lesson" | "quiz" | "exercise",
  estimatedMinutes: 15,
  isActive: true,
});

const reset = () => {
  form.title = "";
  form.description = "";
  form.stepType = "lesson";
  form.estimatedMinutes = 15;
};

const handleSubmit = async () => {
  if (!form.title) return;

  // Calcul automatique de l'index : suite de la liste actuelle
  const nextIndex = stepStore.steps.length || 0;

  const success = await stepStore.createStep({
    pathId: props.pathId,
    ...form,
    index: nextIndex,
  });

  if (success) {
    emit("created");
    reset();
  }
};
</script>
