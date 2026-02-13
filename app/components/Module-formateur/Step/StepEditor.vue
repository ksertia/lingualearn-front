<template>
  <div class="mt-6 border rounded-lg p-4 space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-2 border-b pb-3">
  <button @click="toggleBold"
    class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
    Gras
  </button>
  
  <button @click="toggleItalic"
    class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
    Italique
  </button>

  <button @click="toggleHeading"
    class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
    Titre  
  </button> 

  <button @click="toggleBulletList"
    class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
    Liste à puces
  </button>

  <button @click="undo"
    class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
    Annuler
  </button>

  <button @click="redo"
    class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
    Refaire
  </button>    
</div>

    <!-- Editor -->
    <EditorContent
      :editor="editor"
      class="min-h-[200px] p-3 border rounded-md focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const editor = new Editor({
  extensions: [StarterKit],
  content: props.modelValue || "",
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

/* =========================
   Toolbar actions
========================= */

const toggleBold = () => editor.chain().focus().toggleBold().run();
const toggleItalic = () => editor.chain().focus().toggleItalic().run();
const toggleHeading = () =>
  editor.chain().focus().toggleHeading({ level: 2 }).run();
const toggleBulletList = () =>
  editor.chain().focus().toggleBulletList().run();
const undo = () => editor.chain().focus().undo().run();
const redo = () => editor.chain().focus().redo().run();

/* =========================
   Sync si parent modifie valeur
========================= */

watch(
  () => props.modelValue,
  (value) => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }
);
</script>

<style scoped>

</style>
