<template>
  <div class="bg-white shadow rounded-lg p-6 space-y-4">
    <h3 class="text-lg font-semibold text-blue-900">
      Nouvelle étape
    </h3>

    <!-- Titre -->
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Titre de l'étape
      </label>
      <input
        v-model="title"
        type="text"
        class="mt-1 w-full rounded-md border px-3 py-2"
      />
    </div>

    <!-- Type -->
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Type de l'étape
      </label>
      <select
        v-model="type"
        class="mt-1 w-full rounded-md border px-3 py-2"
      >
        <option disabled value="">Choisir un type</option>
        <option value="cours">Cours</option>
        <option value="exercice">Exercice</option>
        <option value="quiz">Quiz</option>
      </select>
    </div>

    <!-- Boutons principaux -->
    <div class="flex gap-3">
      <button
        @click="mode = 'create'"
        class="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Créer
      </button>

      <button
        @click="mode = 'import'"
        class="px-4 py-2 bg-teal-600 text-white rounded-md"
      >
        Importer
      </button>

      <button
        @click="reset"
        class="px-4 py-2 border rounded-md"
      >
        Annuler
      </button>
    </div>

    <!-- Zone dynamique -->
    <StepEditor
      v-if="mode === 'create'"
      v-model="content"
    />

    <StepUploader
      v-if="mode === 'import'"
      @file-selected="handleFile"
    />

    <!-- Submit -->
    <div v-if="mode" class="pt-4">
      <button
        @click="submitStep"
        class="px-6 py-2 bg-orange-500 text-white rounded-md"
      >
        Publier l'étape
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import StepEditor from "./StepEditor.vue";
import StepUploader from "./StepUploader.vue";

const props = defineProps<{
  parcoursId: string;
}>();

const emit = defineEmits(["created"]);

const title = ref("");
const type = ref("");
const mode = ref<"create" | "import" | null>(null);
const content = ref("");
const selectedFile = ref<File | null>(null);

const handleFile = (file: File) => {
  selectedFile.value = file;
};

const reset = () => {
  title.value = "";
  type.value = "";
  mode.value = null;
  content.value = "";
  selectedFile.value = null;
};

const submitStep = async () => {
  if (!title.value || !type.value) return;

  if (mode.value === "create") {
    await $fetch("/api/steps", {
      method: "POST",
      body: {
        parcoursId: props.parcoursId,
        title: title.value,
        type: type.value,
        content: content.value,
      },
    });
  }

  if (mode.value === "import" && selectedFile.value) {
    const formData = new FormData();
    formData.append("parcoursId", props.parcoursId);
    formData.append("title", title.value);
    formData.append("type", type.value);
    formData.append("file", selectedFile.value);

    await $fetch("/api/steps", {
      method: "POST",
      body: formData,
    });
  }

  emit("created");
  reset();
};
</script>
