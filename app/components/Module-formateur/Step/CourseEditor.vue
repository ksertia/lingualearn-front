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
        <!-- <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL du contenu *</label> -->
        <!-- <input
          v-model="local.contentUrl"
          type="text"
          placeholder="https://..."
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        /> -->
        <!-- <p class="text-xs text-slate-400 mt-1">
          Le backend attend une URL valide (http/https), meme pour le type "text".
        </p> -->
        <div class="mt-3 space-y-2">
          <template v-if="local.contentType === 'text'">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contenu texte *</label>
            <textarea
              v-model="local.contentUrl"
              rows="6"
              placeholder="Entrez le texte du contenu"
              class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
            ></textarea>
            <p class="text-xs text-slate-400">
              Le contenu texte est saisi directement ici, sans upload.
            </p>
          </template>

          <template v-else>
            <button 
              @click="triggerFileInput"
              class="w-full px-4 py-3 bg-white border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              Choisir un contenu
            </button>
            <input
              ref="fileInputRef"
              type="file"
              :accept="uploadAccept"
              @change="handleFileSelect"
              class="hidden"
            />
            <p class="text-xs text-slate-400">
              Sélectionnez un fichier pour prévisualiser puis uploader.
            </p>

            <!-- Section fichier sélectionné -->
            <div v-if="selectedFile" class="mt-4 p-4 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-sm text-slate-900">{{ selectedFile.name }}</p>
                  <p class="text-xs text-slate-500">({{ (selectedFile.size / 1024).toFixed(1) }} KB)</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button 
                  @click="previewFile"
                  :disabled="!selectedFile"
                  class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Prévisualiser
                </button>
                <button 
                  @click="confirmUpload"
                  :disabled="isUploading || !selectedFile"
                  class="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-1"
                >
                  <svg v-if="isUploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-else>✅ Uploader</span>
                </button>
                <button 
                  @click="clearFile"
                  class="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 flex items-center gap-1"
                >
                  ❌ Annuler
                </button>
              </div>

              <!-- Preview -->
              <div v-if="showPreview && previewUrl" class="mt-6 p-4 border rounded-xl bg-white max-w-md max-h-96 overflow-auto">
                <div v-if="local.contentType === 'video'">
                  <video :src="previewUrl" controls class="w-full h-64 object-contain rounded-lg"></video>
                </div>
                <div v-else-if="local.contentType === 'audio'">
                  <audio :src="previewUrl" controls class="w-full"></audio>
                </div>
                <div v-else-if="local.contentType === 'image'">
                  <img :src="previewUrl" class="w-full h-64 object-contain rounded-lg">
                </div>
                <div v-else-if="local.contentType === 'pdf'">
                  <iframe :src="previewUrl" class="w-full h-96 border rounded-lg"></iframe>
                </div>
                <p v-else class="text-sm text-slate-500 text-center py-8">Prévisualisation non disponible pour ce type.</p>
              </div>
            </div>

            <p v-if="uploadSuccess" class="text-xs text-emerald-600">
              Fichier uploadé. URL mise à jour.
            </p>
            <p v-else-if="uploadError" class="text-xs text-rose-500">{{ uploadError }}</p>
            <p v-else-if="isUploading" class="text-xs text-slate-500">Upload en cours...</p>
          </template>
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
import { ref, watch, computed, watchEffect } from "vue";
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
const syncingFromParent = ref(false);

const api = useApiService();
const config = useRuntimeConfig();
const isUploading = ref(false);
const uploadError = ref<string | null>(null);
const uploadSuccess = ref(false);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const showPreview = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const uploadAccept = computed(() => {
  switch (local.value.contentType) {
    case "video":
      return "video/*";
    case "audio":
      return "audio/*,video/mp4,.mp4,.m4a";
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

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  selectedFile.value = file;
  uploadError.value = null;
  uploadSuccess.value = false;
  previewUrl.value = null;
  showPreview.value = false;
  input.value = "";
};


const previewFile = () => {
  if (!selectedFile.value) return;
  
  const file = selectedFile.value;
  previewUrl.value = URL.createObjectURL(file);
  showPreview.value = true;
};

const confirmUpload = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadError.value = null;
  uploadSuccess.value = false;

  try {
    const response = await api.uploadMedia(null, selectedFile.value);
    
    const url = extractUploadUrl(response);
    if (!url) {
      throw new Error("URL manquante dans la réponse d'upload.");
    }
    local.value.contentUrl = normalizeUploadUrl(url);
    
    // Succès - mettre à jour l'état
    isUploading.value = false;
    uploadSuccess.value = true;
    clearFile();
  } catch (err) {
    console.error("Upload cours échoué:", err);
    isUploading.value = false;
    uploadError.value = "Échec de l'upload du fichier.";
  }
};

const clearFile = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  showPreview.value = false;
};

watch(
  () => props.modelValue,
  (value) => {
    syncingFromParent.value = true;
    local.value = normalize(value);
    queueMicrotask(() => {
      syncingFromParent.value = false;
    });
  },
  { deep: true }
);

watch(
  local,
  (value) => {
    if (syncingFromParent.value) return;
    emit("update:modelValue", value);
  },
  { deep: true }
);

watch(
  () => local.value.contentType,
  () => {
    uploadError.value = null;
    clearFile();
  }
);

// Fonction pour lire texte des fichiers texte
const previewText = ref('');
watchEffect(async () => {
  if (selectedFile.value && local.value.contentType === 'text') {
    const text = await selectedFile.value.text();
    previewText.value = text;
  }
});

</script>
