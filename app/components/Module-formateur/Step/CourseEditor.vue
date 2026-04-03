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
          <option value="image">Image</option>
          <option value="text">Texte</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      <div>
        <!-- <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL du contenu *</label>
        <input
          v-model="local.contentUrl"
          type="text"
          placeholder="https://..."
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
        <p class="text-xs text-slate-400 mt-1">
          Le backend attend une URL valide (http/https), meme pour le type "text".
        </p> -->
        <div class="mt-3 space-y-2">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Importer un fichier
          </label>
          <input
            type="file"
            :accept="uploadAccept"
            @change="handleUpload"
            class="block w-full text-sm text-slate-600"
          />
          <p class="text-xs text-slate-400">
            L'URL sera remplie automatiquement apres l'upload.
          </p>
          <p v-if="isUploading" class="text-xs text-slate-500">Upload en cours...</p>
          <p v-else-if="uploadError" class="text-xs text-rose-500">{{ uploadError }}</p>
          <p v-else-if="uploadSuccess" class="text-xs text-emerald-600">
            Fichier uploade. URL mise a jour.
          </p>
        </div>
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
import { ref, watch, computed } from "vue";
import { useApiService } from "~/services/api";

interface CourseForm {
  id?: string;
  title: string;
  description?: string;
  contentType: "video" | "audio" | "text" | "pdf" | "image";
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

type UploadKind = "image" | "video" | "audio" | "pdf" | "content";

const normalize = (value: any): CourseForm => {
  const v = value && typeof value === "object" ? value : {};

  return {
    id: v.id,
    title: typeof v.title === "string" ? v.title : "",
    description: typeof v.description === "string" ? v.description : "",
    contentType: ["video", "audio", "text", "pdf", "image"].includes(v.contentType)
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

const api = useApiService();
const config = useRuntimeConfig();
const isUploading = ref(false);
const uploadError = ref<string | null>(null);
const uploadSuccess = ref(false);

const uploadAccept = computed(() => {
  switch (local.value.contentType) {
    case "video":
      return "video/*";
    case "audio":
      return "audio/*";
    case "pdf":
      return "application/pdf";
    case "image":
      return "image/*";
    case "text":
      return "text/*,.txt,.md,.html,.json";
    default:
      return "*/*";
  }
});

const uploadKind = computed<UploadKind>(() =>
  (local.value.contentType === "text"
    ? "content"
    : local.value.contentType) as UploadKind
);

const extractUploadUrl = (payload: any): string | null => {
  if (!payload) return null;
  if (typeof payload === "string") return payload;
  const candidates = [
    payload.data?.url,
    payload.url,
    payload.fileUrl,
    payload.location,
    payload.path,
    payload.data?.fileUrl,
    payload.data?.location,
    payload.data?.path,
    payload.data?.data?.url,
  ];
  return candidates.find((value) => typeof value === "string" && value.trim()) || null;
};

const getUploadOrigin = () => {
  if (config.public.apiBase) {
    try {
      return new URL(config.public.apiBase).origin;
    } catch (err) {
      return "";
    }
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
};

const normalizeUploadUrl = (value: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return encodeURI(trimmed);
  const origin = getUploadOrigin();
  if (!origin) return encodeURI(trimmed);
  if (trimmed.startsWith("/")) {
    return encodeURI(`${origin}${trimmed}`);
  }
  return encodeURI(`${origin}/${trimmed}`);
};

const handleUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploadError.value = null;
  uploadSuccess.value = false;
  isUploading.value = true;

  try {
    const response = await api.uploadMedia(uploadKind.value, file);
    if (response?.success === false) {
      throw new Error("Upload refuse par le serveur.");
    }
    const url = extractUploadUrl(response);
    if (!url) {
      throw new Error("URL manquante dans la reponse d'upload.");
    }
    local.value.contentUrl = normalizeUploadUrl(url);
    uploadSuccess.value = true;
  } catch (err) {
    console.error("Upload cours echoue:", err);
    uploadError.value = "Echec de l'upload du fichier.";
  } finally {
    isUploading.value = false;
    input.value = "";
  }
};

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

watch(
  () => local.value.contentType,
  () => {
    uploadError.value = null;
    uploadSuccess.value = false;
  }
);
</script>
