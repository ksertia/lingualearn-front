<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="md:col-span-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Titre *</label>
        <input
          v-model="local.title"
          type="text"
          placeholder="Titre de l'exercice"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type d'exercice *</label>
        <select
          v-model="local.exerciseType"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        >
          <option value="multiple_choice">Multiple choice</option>
          <option value="fill_blank">Fill blank</option>
          <option value="matching">Matching</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions</label>
        <textarea
          v-model="local.instructions"
          rows="2"
          placeholder="Consignes pour l'apprenant"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        ></textarea>
      </div>

      <div class="md:col-span-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Media (optionnel)
        </label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            v-model="local.mediaType"
            class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
          >
            <option value="">Aucun</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="pdf">PDF</option>
          </select>
          <input
            v-model="local.mediaUrl"
            type="text"
            :disabled="!local.mediaType"
            placeholder="https://..."
            class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm disabled:bg-slate-50"
          />
          <input
            type="file"
            :disabled="!local.mediaType"
            :accept="mediaAccept"
            @change="handleMediaUpload"
            class="block w-full text-sm text-slate-600"
          />
        </div>
        <p class="text-xs text-slate-400 mt-2">
          Choisis un type, colle une URL ou importe un fichier.
        </p>
        <p v-if="mediaUploading" class="text-xs text-slate-500 mt-1">Upload en cours...</p>
        <p v-else-if="mediaUploadError" class="text-xs text-rose-500 mt-1">{{ mediaUploadError }}</p>
        <p v-else-if="mediaUploadSuccess" class="text-xs text-emerald-600 mt-1">
          Media uploade. URL mise a jour.
        </p>
      </div>
    </div>

    <div v-if="local.exerciseType === 'multiple_choice'">
      <QuizEditor v-model="local.questions" />
    </div>

    <div v-else-if="local.exerciseType === 'fill_blank'" class="space-y-3">
      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Questions a trou</label>
      <div
        v-for="(item, index) in local.fillBlankItems"
        :key="index"
        class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">Item {{ index + 1 }}</span>
          <button
            v-if="local.fillBlankItems.length > 1"
            @click="removeFillBlankItem(index)"
            type="button"
            class="text-xs font-bold text-rose-500 hover:text-rose-600"
          >
            Supprimer
          </button>
        </div>
        <input
          v-model="item.prompt"
          type="text"
          placeholder="Phrase avec ___ (ex: Je ___ du pain)"
          class="w-full bg-white px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
        <input
          v-model="item.answer"
          type="text"
          placeholder="Reponse attendue"
          class="w-full bg-white px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>
      <button
        type="button"
        @click="addFillBlankItem"
        class="text-indigo-600 text-xs font-bold hover:text-indigo-700 flex items-center gap-1 px-1"
      >
        Ajouter un trou
      </button>
      <p class="text-xs text-slate-400">Utilise ___ pour indiquer la position du trou.</p>
    </div>

    <div v-else class="space-y-3">
      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Paires a associer</label>
      <div
        v-for="(pair, index) in local.matchPairs"
        :key="index"
        class="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div class="md:col-span-2 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">Paire {{ index + 1 }}</span>
          <button
            v-if="local.matchPairs.length > 1"
            @click="removeMatchPair(index)"
            type="button"
            class="text-xs font-bold text-rose-500 hover:text-rose-600"
          >
            Supprimer
          </button>
        </div>
        <input
          v-model="pair.left"
          type="text"
          placeholder="Element gauche"
          class="w-full bg-white px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
        <input
          v-model="pair.right"
          type="text"
          placeholder="Element droite"
          class="w-full bg-white px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>
      <button
        type="button"
        @click="addMatchPair"
        class="text-indigo-600 text-xs font-bold hover:text-indigo-700 flex items-center gap-1 px-1"
      >
        Ajouter une paire
      </button>
    </div>

    <div class="space-y-3">
      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Hints</label>
      <div v-if="local.hints.length === 0" class="text-xs text-slate-400">Aucun hint pour le moment.</div>
      <div v-for="(hint, hIndex) in local.hints" :key="hIndex" class="flex items-center gap-2">
        <input
          v-model="local.hints[hIndex]"
          type="text"
          placeholder="Hint"
          class="flex-1 bg-white px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
        <button
          type="button"
          @click="removeHint(hIndex)"
          class="text-slate-300 hover:text-rose-400 transition-colors"
        >
          Retirer
        </button>
      </div>
      <button
        type="button"
        @click="addHint"
        class="text-indigo-600 text-xs font-bold hover:text-indigo-700 flex items-center gap-1 px-1"
      >
        Ajouter un hint
      </button>
    </div>

    <div class="space-y-2">
      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Lier a un cours existant</label>
      <select
        class="w-full bg-white px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        :value="selectedCourseId ?? ''"
        @change="onCourseChange"
      >
        <option value="">Selectionner un cours</option>
        <option value="__create">Creer un cours associe</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title || 'Cours sans titre' }}
        </option>
      </select>
      <p v-if="coursesLoading" class="text-xs text-slate-400">Chargement des cours...</p>
      <p v-else-if="coursesError" class="text-xs text-rose-500">{{ coursesError }}</p>
      <p v-else-if="courses.length === 0" class="text-xs text-slate-400">
        Aucun cours disponible. Utilise "Creer un cours associe".
      </p>
      <p v-else class="text-xs text-slate-400">
        Choisis un cours pour lier l'exercice. Tu peux aussi creer un cours associe.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="md:col-span-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Explication</label>
        <textarea
          v-model="local.explanation"
          rows="3"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Points</label>
        <input
          v-model.number="local.points"
          type="number"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">XP</label>
        <input
          v-model.number="local.xpReward"
          type="number"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Coins</label>
        <input
          v-model.number="local.coinReward"
          type="number"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max attempts</label>
        <input
          v-model.number="local.maxAttempts"
          type="number"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time limit (seconds)</label>
        <input
          v-model.number="local.timeLimitSeconds"
          type="number"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sort order</label>
        <input
          v-model.number="local.sortOrder"
          type="number"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div class="flex items-center gap-3">
        <input
          id="is-active"
          v-model="local.isActive"
          type="checkbox"
          class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label for="is-active" class="text-sm font-semibold text-slate-600">Actif</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import QuizEditor from "@/components/Module-formateur/Step/QuizEditor.vue";
import { useApiService } from "~/services/api";

interface ExerciseQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface FillBlankItem {
  prompt: string;
  answer: string;
}

interface MatchPair {
  left: string;
  right: string;
}

interface ExerciseForm {
  id?: string;
  title: string;
  exerciseType: "multiple_choice" | "fill_blank" | "matching";
  instructions?: string;
  questions: ExerciseQuestion[];
  fillBlankItems: FillBlankItem[];
  matchPairs: MatchPair[];
  hints: string[];
  explanation?: string;
  points?: number;
  xpReward?: number;
  coinReward?: number;
  maxAttempts?: number;
  timeLimitSeconds?: number;
  sortOrder?: number;
  isActive: boolean;
  mediaType?: "image" | "video" | "audio" | "pdf";
  mediaUrl?: string;
}

type CourseOption = {
  id: string;
  title?: string;
};

const props = defineProps<{
  modelValue: any;
  courses?: CourseOption[];
  coursesLoading?: boolean;
  coursesError?: string | null;
  selectedCourseId?: string | null;
  hasCourse?: boolean;
  courseFormOpen?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "toggle-course", "update:selectedCourseId"]);

const allowedTypes = new Set(["multiple_choice", "fill_blank", "matching"]);
const allowedMediaTypes = new Set(["image", "video", "audio", "pdf"]);

type UploadKind = "image" | "video" | "audio" | "pdf" | "content";

const normalize = (value: any): ExerciseForm => {
  const v = value && typeof value === "object" ? value : {};
  const exerciseType = allowedTypes.has(v.exerciseType) ? v.exerciseType : "multiple_choice";
  const mediaFromContent =
    v?.content && typeof v.content === "object" && !Array.isArray(v.content)
      ? v.content.media
      : null;
  const mediaTypeCandidate =
    typeof v.mediaType === "string"
      ? v.mediaType
      : typeof mediaFromContent?.type === "string"
        ? mediaFromContent.type
        : "";
  const mediaUrlCandidate =
    typeof v.mediaUrl === "string"
      ? v.mediaUrl
      : typeof mediaFromContent?.url === "string"
        ? mediaFromContent.url
        : "";

  return {
    id: v.id,
    title: typeof v.title === "string" ? v.title : "",
    exerciseType,
    instructions: typeof v.instructions === "string" ? v.instructions : "",
    questions: Array.isArray(v.questions) ? v.questions : [],
    fillBlankItems: Array.isArray(v.fillBlankItems)
      ? v.fillBlankItems.map((item: any) => ({
          prompt: typeof item?.prompt === "string" ? item.prompt : "",
          answer: typeof item?.answer === "string" ? item.answer : "",
        }))
      : [],
    matchPairs: Array.isArray(v.matchPairs)
      ? v.matchPairs.map((pair: any) => ({
          left: typeof pair?.left === "string" ? pair.left : "",
          right: typeof pair?.right === "string" ? pair.right : "",
        }))
      : [],
    hints: Array.isArray(v.hints) ? v.hints.filter((h: any) => typeof h === "string") : [],
    explanation: typeof v.explanation === "string" ? v.explanation : "",
    points: typeof v.points === "number" ? v.points : undefined,
    xpReward: typeof v.xpReward === "number" ? v.xpReward : undefined,
    coinReward: typeof v.coinReward === "number" ? v.coinReward : undefined,
    maxAttempts: typeof v.maxAttempts === "number" ? v.maxAttempts : undefined,
    timeLimitSeconds: typeof v.timeLimitSeconds === "number" ? v.timeLimitSeconds : undefined,
    sortOrder: typeof v.sortOrder === "number" ? v.sortOrder : undefined,
    isActive: typeof v.isActive === "boolean" ? v.isActive : true,
    mediaType: allowedMediaTypes.has(mediaTypeCandidate) ? mediaTypeCandidate : undefined,
    mediaUrl: mediaUrlCandidate,
  };
};

const local = ref<ExerciseForm>(normalize(props.modelValue));

const api = useApiService();
const config = useRuntimeConfig();
const mediaUploading = ref(false);
const mediaUploadError = ref<string | null>(null);
const mediaUploadSuccess = ref(false);

const mediaAccept = computed(() => {
  switch (local.value.mediaType) {
    case "image":
      return "image/*";
    case "video":
      return "video/*";
    case "audio":
      return "audio/*";
    case "pdf":
      return "application/pdf";
    default:
      return "";
  }
});

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

const handleMediaUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !local.value.mediaType) return;

  mediaUploadError.value = null;
  mediaUploadSuccess.value = false;
  mediaUploading.value = true;

  try {
    const response = await api.uploadMedia(local.value.mediaType as UploadKind, file);
    if (response?.success === false) {
      throw new Error("Upload refuse par le serveur.");
    }
    const url = extractUploadUrl(response);
    if (!url) {
      throw new Error("URL manquante dans la reponse d'upload.");
    }
    local.value.mediaUrl = normalizeUploadUrl(url);
    mediaUploadSuccess.value = true;
  } catch (err) {
    console.error("Upload media exercice echoue:", err);
    mediaUploadError.value = "Echec de l'upload du media.";
  } finally {
    mediaUploading.value = false;
    input.value = "";
  }
};

const courses = computed(() => props.courses ?? []);
const coursesLoading = computed(() => Boolean(props.coursesLoading));
const coursesError = computed(() => props.coursesError ?? null);
const selectedCourseId = computed(() => props.selectedCourseId ?? null);
const hasCourse = computed(() => Boolean(props.hasCourse ?? selectedCourseId.value));

const onCourseChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  if (value === "__create") {
    emit("update:selectedCourseId", null);
    emit("toggle-course");
    return;
  }
  emit("update:selectedCourseId", value || null);
};

const ensureDefaults = () => {
  if (local.value.exerciseType === "fill_blank" && local.value.fillBlankItems.length === 0) {
    local.value.fillBlankItems.push({ prompt: "", answer: "" });
  }
  if (local.value.exerciseType === "matching" && local.value.matchPairs.length === 0) {
    local.value.matchPairs.push({ left: "", right: "" });
  }
};

ensureDefaults();

watch(
  () => props.modelValue,
  (value) => {
    local.value = normalize(value);
    ensureDefaults();
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
  () => local.value.exerciseType,
  () => {
    ensureDefaults();
  }
);

watch(
  () => local.value.mediaType,
  (value) => {
    mediaUploadError.value = null;
    mediaUploadSuccess.value = false;
    if (!value) {
      local.value.mediaUrl = "";
    }
  }
);

const addFillBlankItem = () => {
  local.value.fillBlankItems.push({ prompt: "", answer: "" });
};

const removeFillBlankItem = (index: number) => {
  local.value.fillBlankItems.splice(index, 1);
  if (local.value.fillBlankItems.length === 0) {
    addFillBlankItem();
  }
};

const addMatchPair = () => {
  local.value.matchPairs.push({ left: "", right: "" });
};

const removeMatchPair = (index: number) => {
  local.value.matchPairs.splice(index, 1);
  if (local.value.matchPairs.length === 0) {
    addMatchPair();
  }
};

const addHint = () => {
  local.value.hints.push("");
};

const removeHint = (index: number) => {
  local.value.hints.splice(index, 1);
};
</script>
