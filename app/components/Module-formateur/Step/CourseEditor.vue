<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="md:col-span-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Titre du cours *</label>
        <input
          v-model="local.title"
          type="text"
          placeholder="Titre du cours"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
        <textarea
          v-model="local.description"
          rows="2"
          placeholder="Description du cours"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type de contenu *</label>
        <select
          v-model="local.contentType"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        >
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="text">Texte</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL du contenu *</label>
        <input
          v-model="local.contentUrl"
          type="text"
          placeholder="https://..."
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
        <p class="text-xs text-slate-400 mt-1">
          Le backend attend une URL valide (http/https), meme pour le type "text".
        </p>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duree (secondes)</label>
        <input
          v-model.number="local.duration"
          type="number"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ordre</label>
        <input
          v-model.number="local.order"
          type="number"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-6">
      <label class="flex items-center gap-3 cursor-pointer">
        <input v-model="local.isPublished" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
        <span class="text-sm font-semibold text-slate-600">Publie</span>
      </label>
      <label class="flex items-center gap-3 cursor-pointer">
        <input v-model="local.isActive" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
        <span class="text-sm font-semibold text-slate-600">Actif</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface CourseForm {
  id?: string;
  title: string;
  description?: string;
  contentType: "video" | "audio" | "text" | "pdf";
  contentUrl: string;
  duration?: number;
  order?: number;
  isPublished?: boolean;
  isActive?: boolean;
}

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const normalize = (value: any): CourseForm => {
  const v = value && typeof value === "object" ? value : {};

  return {
    id: v.id,
    title: typeof v.title === "string" ? v.title : "",
    description: typeof v.description === "string" ? v.description : "",
    contentType: ["video", "audio", "text", "pdf"].includes(v.contentType)
      ? v.contentType
      : "text",
    contentUrl: typeof v.contentUrl === "string" ? v.contentUrl : "",
    duration: typeof v.duration === "number" ? v.duration : undefined,
    order: typeof v.order === "number" ? v.order : undefined,
    isPublished: typeof v.isPublished === "boolean" ? v.isPublished : false,
    isActive: typeof v.isActive === "boolean" ? v.isActive : true,
  };
};

const local = ref<CourseForm>(normalize(props.modelValue));

watch(
  () => props.modelValue,
  (value) => {
    local.value = normalize(value);
  },
  { deep: true }
);

watch(
  local,
  (value) => {
    emit("update:modelValue", value);
  },
  { deep: true }
);
</script>
