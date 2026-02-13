<template>
  <div class="mt-4 border rounded-lg p-4 space-y-3">
    <label class="block text-sm font-medium text-gray-700">
      Importer un fichier (audio / vidéo)
    </label>

    <input
      type="file"
      accept="audio/*,video/*"
      @change="handleFileChange"
      class="block w-full text-sm"
    />

    <div v-if="file" class="text-sm text-gray-600">
      📎 {{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["file-selected"]);

const file = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.files?.[0];

  if (selected) {
    file.value = selected;
    emit("file-selected", selected);
  }
};
</script>
