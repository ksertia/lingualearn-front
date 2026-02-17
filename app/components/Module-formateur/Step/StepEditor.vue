<template>
  <div class="mt-6 border rounded-lg p-4">
    <div ref="editorEl" class="min-h-[250px]" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const props = defineProps<{
  modelValue: any; // Delta object maintenant
}>();

const emit = defineEmits(["update:modelValue"]);

const editorEl = ref<HTMLDivElement | null>(null);
let quill: any = null;

/* =========================
   Init Quill (Nuxt safe)
========================= */
onMounted(async () => {
  const Quill = (await import("quill")).default;

  quill = new Quill(editorEl.value!, {
    theme: "snow",
    placeholder: "Écris le contenu de l'étape ici...",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"]
      ],
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
      }
    }
  });

  /* Charger contenu existant */
  if (props.modelValue) {
    quill.setContents(props.modelValue);
  }

  /* Sync vers parent (v-model) */
  quill.on("text-change", () => {
    emit("update:modelValue", quill.getContents());
  });
});

/* =========================
   Sync si parent modifie valeur
========================= */
watch(
  () => props.modelValue,
  (value) => {
    if (!quill) return;

    const current = quill.getContents();
    if (JSON.stringify(current) !== JSON.stringify(value)) {
      quill.setContents(value || []);
    }
  }
);
</script>

<style scoped>
/* améliore visibilité */
:deep(.ql-toolbar) {
  border-radius: 8px 8px 0 0;
}
:deep(.ql-container) {
  min-height: 220px;
  border-radius: 0 0 8px 8px;
}
</style>
