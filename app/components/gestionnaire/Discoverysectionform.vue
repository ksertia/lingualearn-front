<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-900">
          {{ editingId ? 'Éditer la section' : 'Créer une nouvelle section' }}
        </h2>
        <span
            v-if="formData.type"
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="formData.type === 'lesson' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'"
        >
          {{ formData.type === 'lesson' ? 'Leçon' : 'Exercice' }}
        </span>
      </div>

      <!-- Champs section -->
      <div class="space-y-4">

        <!-- Titre -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Titre *
          </label>
          <input
              v-model="formData.title"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="Ex: Introduction au Wolof"
          />
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Type *
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
                type="button"
                class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                :class="formData.type === 'lesson'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                @click="formData.type = 'lesson'"
            >
              Leçon
            </button>
            <button
                type="button"
                class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                :class="formData.type === 'exercise'
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                @click="formData.type = 'exercise'"
            >
              Exercice
            </button>
          </div>
        </div>

        <!-- Langue -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Langue *
          </label>
          <select
              v-model="formData.language"
              class="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
              :disabled="languageStore.loading"
          >
            <option value="" disabled>
              {{ languageStore.loading ? 'Chargement...' : 'Sélectionner une langue' }}
            </option>
            <option
                v-for="lang in languageStore.visibleLanguages"
                :key="lang.id"
                :value="lang.name"
            >
              {{ lang.name }}
            </option>
          </select>
          <p v-if="!languageStore.loading && !languageStore.visibleLanguages.length" class="text-xs text-red-400 mt-1">
            Aucune langue disponible
          </p>
        </div>

      </div>

      <!-- Contenus -->
      <div class="mt-8 pt-8 border-t border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-900">
            Contenus
            <span v-if="formData.contents.length" class="ml-2 text-sm font-normal text-slate-400">
              ({{ formData.contents.length }})
            </span>
          </h3>
          <button
              type="button"
              class="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
              @click="addContent"
          >
            + Ajouter un contenu
          </button>
        </div>

        <div
            v-for="(content, cIndex) in formData.contents"
            :key="cIndex"
            class="mb-4 p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3"
        >
          <!-- Header contenu -->
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Contenu {{ cIndex + 1 }}
            </span>
            <button
                type="button"
                class="text-red-400 hover:text-red-600 text-xs font-semibold"
                @click="removeContent(cIndex)"
            >
              Supprimer
            </button>
          </div>

          <!-- Ordre -->
          <div class="flex items-center gap-3">
            <label class="text-xs font-semibold text-slate-500 shrink-0">Ordre</label>
            <input
                v-model.number="content.order"
                type="number"
                min="0"
                class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm bg-white"
            />
          </div>

          <!-- Question -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Type de question *
              </label>
              <select
                  v-model="content.questionType"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                <option v-for="mt in mediaTypes" :key="mt.value" :value="mt.value">
                  {{ mt.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Valeur de la question *
              </label>
              <template v-if="content.questionType === 'text'">
                <textarea
                    v-model="content.questionValue"
                    rows="2"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    placeholder="Texte de la question"
                />
              </template>
              <template v-else>
                <div class="flex gap-2">
                  <input
                      v-model="content.questionValue"
                      type="text"
                      class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                      placeholder="URL ou uploader un fichier"
                  />
                  <button
                      type="button"
                      class="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
                      :disabled="uploadingMap[`q-${cIndex}`]"
                      @click="triggerUpload(`q-${cIndex}`)"
                  >
                    {{ uploadingMap[`q-${cIndex}`] ? '...' : '📎' }}
                  </button>
                  <input
                      :ref="el => setUploadRef(el, `q-${cIndex}`)"
                      type="file"
                      class="hidden"
                      :accept="acceptForType(content.questionType)"
                      @change="e => handleUpload(e, cIndex, 'question')"
                  />
                </div>
              </template>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Type de réponse
              </label>
              <select
                  v-model="content.answerType"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              >
                <option value="">Aucun</option>
                <option v-for="mt in mediaTypes" :key="mt.value" :value="mt.value">
                   {{ mt.label }}
                </option>
              </select>
            </div>
            <div v-if="content.answerType">
              <label class="block text-xs font-semibold text-slate-600 mb-1">
                Valeur de la réponse
              </label>
              <template v-if="content.answerType === 'text'">
                <textarea
                    v-model="content.answerValue"
                    rows="2"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                    placeholder="Texte de la réponse"
                />
              </template>
              <template v-else>
                <div class="flex gap-2">
                  <input
                      v-model="content.answerValue"
                      type="text"
                      class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
                      placeholder="URL ou uploader"
                  />
                  <button
                      type="button"
                      class="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
                      :disabled="uploadingMap[`a-${cIndex}`]"
                      @click="triggerUpload(`a-${cIndex}`)"
                  >
                    {{ uploadingMap[`a-${cIndex}`] ? '...' : 'choisir un contenu' }}
                  </button>
                  <input
                      :ref="el => setUploadRef(el, `a-${cIndex}`)"
                      type="file"
                      class="hidden"
                      :accept="acceptForType(content.answerType)"
                      @change="e => handleUpload(e, cIndex, 'answer')"
                  />
                </div>
              </template>
            </div>
          </div>

          <!-- Options (uniquement pour exercise) -->
          <div v-if="formData.type === 'exercise'">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold text-slate-600">
                Options
                <span class="text-slate-400 font-normal ml-1">(cocher la bonne réponse)</span>
              </label>
              <button
                  type="button"
                  class="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
                  @click="addOption(cIndex)"
              >
                + Option
              </button>
            </div>
            <div
                v-for="(opt, oIndex) in content.options"
                :key="oIndex"
                class="flex items-center gap-2 mb-2"
            >
              <input
                  v-model="opt.isCorrect"
                  type="checkbox"
                  class="w-4 h-4 rounded accent-indigo-600"
                  title="Réponse correcte"
              />
              <input
                  v-model="opt.value"
                  type="text"
                  class="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white"
                  :placeholder="`Option ${oIndex + 1}`"
              />
              <input
                  v-model.number="opt.order"
                  type="number"
                  class="w-14 rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white"
                  placeholder="Ord."
              />
              <button
                  type="button"
                  class="text-red-400 hover:text-red-600 text-xs"
                  @click="removeOption(cIndex, oIndex)"
              >
                ✕
              </button>
            </div>
            <p v-if="!content.options?.length" class="text-xs text-slate-400 italic">
              Ajoutez des options pour cet exercice
            </p>
          </div>
        </div>

        <p v-if="!formData.contents.length" class="text-sm text-slate-400 italic text-center py-6">
          Aucun contenu. Cliquez sur "+ Ajouter un contenu" pour commencer.
        </p>
      </div>

      <!-- Boutons -->
      <div class="flex gap-3 mt-8 pt-6 border-t border-slate-200">
        <button
            type="button"
            class="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
            :disabled="isSubmitting"
            @click="handleSubmit"
        >
          {{ isSubmitting ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Créer la section') }}
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

    <!-- Toast -->
    <Transition name="toast">
      <div
          v-if="toast.show"
          class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg"
          :class="toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'"
      >
        <span class="font-medium">{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useDiscoveryStore } from "~/stores/discoveryStore";
import type {
  DiscoverContent,
  SectionType,
  CreateDiscoverSectionRequest,
  CreateDiscoverContentRequest,
} from "~/types/discovery";

import { useLanguageStore } from "~/stores/languageStore";

const languageStore = useLanguageStore();

// ── Props / Emits ─────────────────────────────────────────────────────────────

const props = defineProps<{
  sectionId?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  saved: [];
}>();

const store = useDiscoveryStore();
const editingId = props.sectionId ?? null;

// ── Constantes UI ─────────────────────────────────────────────────────────────

const mediaTypes = [
  { value: 'text',  label: 'Texte' },
  { value: 'audio', label: 'Audio'},
  { value: 'image', label: 'Image'},
  { value: 'video', label: 'Vidéo'},
  { value: 'file',  label: 'Fichier'},
];

// ── État formulaire ────────────────────────────────────────────────────────────

const formData = reactive<{
  title: string;
  type: SectionType;
  language: string;
  contents: DiscoverContent[];
}>({
  title: '',
  type: 'lesson',
  language: '',
  contents: [],
});

const isSubmitting = ref(false);
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' });

// ── Upload ────────────────────────────────────────────────────────────────────

const uploadRefs = ref<Record<string, HTMLInputElement | null>>({});
const uploadingMap = ref<Record<string, boolean>>({});

const setUploadRef = (el: any, key: string) => {
  if (el) uploadRefs.value[key] = el as HTMLInputElement;
};
const triggerUpload = (key: string) => uploadRefs.value[key]?.click();

const acceptForType = (type?: string) => {
  if (type === 'audio') return 'audio/*,video/mp4,.mp4,.m4a';
  if (type === 'video') return 'video/*';
  if (type === 'image') return 'image/*';
  return '*/*';
};

const handleUpload = async (event: Event, cIndex: number, field: 'question' | 'answer') => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const key = `${field === 'question' ? 'q' : 'a'}-${cIndex}`;
  uploadingMap.value[key] = true;
  console.log('le fichier : ', file)
  console.log('le type : ', typeof file, file instanceof File)
  try {
    const extension = file.name.split('.').pop()
    const safeName = `image-${Date.now()}.${extension}`
    const safeFile = new File([file], safeName, { type: file.type })
    const data = await store.uploadAdminMedia(safeFile);
    //console.log('le data : ', data)
    // enlever l'url
    //const config = useRuntimeConfig();
    //const baseUrl = config.public.apiBase
    //const url = baseUrl  + data;
    //console.log('le url : ', url)

    if (data) {
      const content = formData.contents[cIndex];
      if (content) {
        if (field === 'question') content.questionValue = data;
        else content.answerValue = data;
      }
      showToast('Fichier uploadé avec succès');
      console.log('Reponse backend', data)
    } else {
      showToast("Échec de l'upload", 'error');
    }
  } catch {
    showToast("Erreur lors de l'upload", 'error');
  } finally {
    uploadingMap.value[key] = false;
    target.value = '';
  }
};

// ── Gestion contenus ──────────────────────────────────────────────────────────

const addContent = () => {
  formData.contents.push({
    order: formData.contents.length,
    questionType: 'text',
    questionValue: '',
    answerType: undefined,
    answerValue: '',
    options: [],
  });
};

const removeContent = (index: number) => {
  formData.contents.splice(index, 1);
};

const addOption = (cIndex: number) => {
  const c = formData.contents[cIndex];
  if (!c) return;
  if (!c.options) c.options = [];
  c.options.push({ value: '', isCorrect: false, order: c.options.length });
};

const removeOption = (cIndex: number, oIndex: number) => {
  formData.contents[cIndex]?.options?.splice(oIndex, 1);
};

// ── Toast ─────────────────────────────────────────────────────────────────────

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.show = true;
  toast.message = message;
  toast.type = type;
  setTimeout(() => (toast.show = false), 3000);
};

// ── Chargement édition ────────────────────────────────────────────────────────

const loadSectionForEdit = async () => {
  if (!editingId) return;
  let section = store.adminSections.find(s => s.id === editingId);
  if (!section) {
    await store.fetchAdminSections();
    section = store.adminSections.find(s => s.id === editingId);
  }
  if (section) {
    formData.title    = section.title;
    formData.type     = section.type;
    formData.language = section.language;
    formData.contents = JSON.parse(JSON.stringify(section.contents ?? []));
  } else {
    showToast('Section introuvable', 'error');
  }
};

// ── Soumission ────────────────────────────────────────────────────────────────

const handleSubmit = async () => {
  if (!formData.title.trim()) {
    showToast('Le titre est obligatoire', 'error');
    return;
  }
  if (!formData.language.trim()) {
    showToast('La langue est obligatoire', 'error');
    return;
  }
  for (const c of formData.contents) {
    if (!c.questionValue.trim()) {
      showToast('Tous les contenus doivent avoir une valeur de question', 'error');
      return;
    }
  }

  isSubmitting.value = true;

  try {
    // Payload section — exactement ce qu'attend l'API
    const sectionPayload: CreateDiscoverSectionRequest = {
      title:    formData.title.trim(),
      type:     formData.type,
      language: formData.language.trim(),
    };

    let sectionId: string;

    if (editingId) {
      const result = await store.updateAdminSection(editingId, sectionPayload);
      if (!result) {
        showToast(store.adminError ?? 'Erreur mise à jour', 'error');
        return;
      }
      sectionId = editingId;

      // Sync contenus
      const existing = store.adminSections.find(s => s.id === editingId)?.contents ?? [];
      for (const content of formData.contents) {
        const payload: CreateDiscoverContentRequest = buildContentPayload(content);
        if (content.id) {
          await store.updateContent(content.id, payload);
        } else {
          await store.addContentToSection(sectionId, payload);
        }
      }
      // Supprimer les contenus retirés
      for (const ex of existing) {
        if (ex.id && !formData.contents.some(c => c.id === ex.id)) {
          await store.deleteContent(sectionId, ex.id);
        }
      }
      showToast('Section mise à jour avec succès');
    } else {
      const result = await store.createAdminSection(sectionPayload);
      if (!result?.id) {
        showToast(store.adminError ?? 'Erreur création', 'error');
        return;
      }
      sectionId = result.id;

      for (const content of formData.contents) {
        await store.addContentToSection(sectionId, buildContentPayload(content));
      }
      showToast('Section créée avec succès');
    }

    emit('saved');
  } catch (err: any) {
    showToast(err?.message ?? "Erreur lors de l'enregistrement", 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Construit le payload contenu propre
const buildContentPayload = (content: DiscoverContent): CreateDiscoverContentRequest => ({
  ...(content.order !== undefined ? { order: content.order } : {}),
  questionType:  content.questionType,
  questionValue: content.questionValue,
  ...(content.answerType  ? { answerType:  content.answerType  } : {}),
  ...(content.answerValue ? { answerValue: content.answerValue } : {}),
  ...(content.options?.length ? { options: content.options } : {}),
});

// ── Init ──────────────────────────────────────────────────────────────────────

onMounted(async () => {
  if (!languageStore.languages.length) {
    await languageStore.fetchLanguages();
  }
  if (editingId) await loadSectionForEdit();
});
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>