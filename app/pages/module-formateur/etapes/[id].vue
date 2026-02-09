<template>
    <!-- détails des étapes d'un parcours -->
  <section class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-blue-900">Étapes du parcours</h1>
      <button @click="goBack" class="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Retour</button>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100">
        <h2 class="text-xl font-bold text-blue-900">{{ title || 'Parcours #' + id }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ description || 'Aucune description' }}</p>
      </div>

      <div class="px-6 py-6">
        <h3 class="text-sm font-medium text-gray-700">Étapes</h3>

        <!-- Table of steps -->
        <div class="mt-4">
          <div v-if="steps.length" class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-blue-900 text-white">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Titre de l'étape</th>
                  <!-- <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th> -->

                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cours</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Exercice</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quiz</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="(s, i) in steps" :key="s.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ i + 1 }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ s.title }}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ s.courseFile?.name || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ s.exerciseFile?.name || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ s.quizFile?.name || s.quizTitle || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button v-if="s.courseFile" @click.prevent="viewFile(s.courseFile)" class="px-3 py-1 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-sm">Voir fichier</button>
                    <button v-if="s.exerciseFile" @click.prevent="viewFile(s.exerciseFile)" class="px-3 py-1 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-sm">Voir fichier</button>
                    <button @click.prevent="removeStep(s)" class="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="mt-4 text-sm text-gray-500">Aucune étape disponible.</div>
        </div>

        <!-- Bouton pour ouvrir le modal d'ajout d'étape (upload depuis le disque) -->
        <div class="mt-6 border-t pt-4">
          <div class="flex items-center justify-between mb-3">
            <!-- <h4 class="text-sm font-medium text-gray-700">Ajouter</h4> -->
            <button @click.prevent="openAddStepModal" class="px-3 py-1 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm">+ Ajouter l'étape</button>
          </div>

          <!-- Modal d'ajout -->
          <transition name="fade">
             <div v-if="showAddStepModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
                <div class="px-6 py-4 border-b flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-blue-900">Nouvelle étape</h3>
                  <!-- <button @click="closeAddStepModal" class="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Annuler</button> -->
                </div> 

                <div class="px-6 py-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Titre</label>
                    <input v-model="newStep.title" type="text" class="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2" placeholder="Titre de l'étape" />
                  </div>
                  <!-- <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea v-model="newStep.description" class="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2" placeholder="Description de l'étape" rows="3"></textarea>
                  </div> -->

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Course upload card -->
                    <div class="p-4 border rounded-lg flex flex-col gap-3">
                      <label class="text-sm font-medium text-gray-700">Cours (import)</label>
                      <div class="flex items-center gap-3">
                        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        <div class="text-sm text-gray-700">
                          <div v-if="courseFileRef">{{ courseFileRef.name }}</div>
                          <div v-else class="text-gray-400">Aucun fichier</div>
                          <div v-if="courseFileRef" class="text-xs text-gray-400">{{ (courseFileRef.size/1024).toFixed(1) }} KB</div>
                        </div>
                      </div>
                      <input ref="courseInputRef" type="file" @change="onCourseFileChange" class="hidden" />
                    </div>

                    <!-- Exercise upload card -->
                    <div class="p-4 border rounded-lg flex flex-col gap-3">
                      <label class="text-sm font-medium text-gray-700">Exercice (import)</label>
                      <div class="flex items-center gap-3">
                        <svg class="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        <div class="text-sm text-gray-700">
                          <div v-if="exerciseFileRef">{{ exerciseFileRef.name }}</div>
                          <div v-else class="text-gray-400">Aucun fichier</div>
                          <div v-if="exerciseFileRef" class="text-xs text-gray-400">{{ (exerciseFileRef.size/1024).toFixed(1) }} KB</div>
                        </div>
                      </div>
                      <input ref="exerciseInputRef" type="file" @change="onExerciseFileChange" class="hidden" />
                    </div>

                    <!-- Quiz upload card -->
                    <div class="p-4 border rounded-lg flex flex-col gap-3">
                      <label class="text-sm font-medium text-gray-700">Quiz (import)</label>
                      <div class="flex items-center gap-3">
                        <svg class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        <div class="text-sm text-gray-700">
                          <div v-if="quizFileRef">{{ quizFileRef.name }}</div>
                          <div v-else class="text-gray-400">Aucun fichier</div>
                          <div v-if="quizFileRef" class="text-xs text-gray-400">{{ (quizFileRef.size/1024).toFixed(1) }} KB</div>
                        </div>
                      </div>
                      <input ref="quizInputRef" type="file" @change="onQuizFileChange" class="hidden" />
                    </div>
                  </div>

                  <div class="flex items-center justify-center gap-16 mt-4">
                    <button @click.prevent="triggerCourseInput" class="px-3 py-1 bg-blue-600 text-white rounded-md">Importer Cours</button>
                    <button @click.prevent="triggerExerciseInput" class="px-3 py-1 bg-blue-600 text-white rounded-md">Importer Exercice</button>
                    <button @click.prevent="triggerQuizInput" class="px-3 py-1 bg-blue-600 text-white rounded-md">Importer Quiz</button>
                  </div>

                  <div class="flex items-center justify-end gap-3 mt-4">
                    <button @click="closeAddStepModal" class="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700">Annuler</button>
                    <button @click="addStep" class="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm">Valider</button>
                  </div>

                  <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
  <!-- détails des étapes d'un parcours -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useStepStore } from '~/stores/stepStore';
import { useCourseStore } from '~/stores/courseStore';
import { useExerciseStore } from '~/stores/exerciseStore';
import { useQuizStore } from '~/stores/quizStore';

definePageMeta({
  layout: 'formateur'
});

// script étapes du parcours
const route = useRoute();
const router = useRouter();

const id = String(route.params.id || '');
const title = String(route.query.title || '');
const description = String(route.query.description || '');

// Parse steps from query and normalize to objects { id, title, courseId, exerciseId, quizTitle, content }
let parsed: any[] = [];
try {
  const raw = route.query.steps as string | undefined;
  parsed = raw ? JSON.parse(decodeURIComponent(raw as string)) : [];
} catch (err) {
  const raw = route.query.steps as string | undefined;
  parsed = raw ? (raw as string).split(',').map(s => s.trim()).filter(Boolean) : [];
}

const steps = ref<Array<{ id: number; title: string; courseId?: string; exerciseId?: string; quizId?: string; quizTitle?: string; content?: string[]; courseFile?: { name: string; size: number; type: string; content?: string } | null; exerciseFile?: { name: string; size: number; type: string; content?: string } | null; quizFile?: { name: string; size: number; type: string; content?: string } | null }>>( (parsed || []).map((it: any, idx: number): { id: number; title: string; courseId?: string; exerciseId?: string; quizId?: string; quizTitle?: string; content?: string[] } => {
  if (typeof it === 'string') return { id: idx + 1, title: it };
  return { id: it.id ?? (idx + 1), title: it.title || it.name || String(it), courseId: it.courseId || '', exerciseId: it.exerciseId || '', quizId: it.quizId || '', quizTitle: it.quizTitle || it.quiz || '', content: Array.isArray(it.content) ? it.content : (typeof it.content === 'string' ? it.content.split('\n').map((s: string) => s.trim()).filter(Boolean) : []) };
}) );

let nextStepId = steps.value.length ? Math.max(...steps.value.map(s => s.id)) + 1 : 1;

const newStep = ref<{ title: string; courseId?: string; exerciseId?: string; quizTitle?: string; content?: string }>({ title: '', courseId: '', exerciseId: '', quizTitle: '', content: '' });
const error = ref('');

// course / exercise stores
const stepStore = useStepStore();
const courseStore = useCourseStore();
const exerciseStore = useExerciseStore();
const quizStore = useQuizStore();
const { courses: coursesRef } = storeToRefs(courseStore);
const { exercises: exercisesRef } = storeToRefs(exerciseStore);
const coursesList = coursesRef;
const exercisesList = exercisesRef;

// fetch lists
if ((coursesList.value || []).length === 0) courseStore.fetchCourses();
if ((exercisesList.value || []).length === 0) exerciseStore.fetchExercises();

const findCourseName = (id?: string) => coursesList.value.find(c => c.stepId === id)?.title || '';
const findExerciseTitle = (id?: string) => exercisesList.value.find(e => e.id === id)?.title || '';



const goBack = () => router.back();

// file-upload based step creation
const showAddStepModal = ref(false);
const courseFileRef = ref<File | null>(null);
const exerciseFileRef = ref<File | null>(null);
const quizFileRef = ref<File | null>(null);
const courseInputRef = ref<HTMLInputElement | null>(null);
const exerciseInputRef = ref<HTMLInputElement | null>(null);
const quizInputRef = ref<HTMLInputElement | null>(null);
const showFileModal = ref(false);
const filePreviewName = ref('');
const filePreviewContent = ref('');

const openAddStepModal = () => {
  error.value = '';
  newStep.value = { title: '', courseId: '', exerciseId: '', quizTitle: '' };
  courseFileRef.value = null;
  exerciseFileRef.value = null;
  quizFileRef.value = null;
  showAddStepModal.value = true;
};

const closeAddStepModal = () => {
  showAddStepModal.value = false;
  error.value = '';
};

const triggerCourseInput = () => courseInputRef.value?.click();
const triggerExerciseInput = () => exerciseInputRef.value?.click();
const triggerQuizInput = () => quizInputRef.value?.click();

const onCourseFileChange = (e: Event) => {
  const f = (e.target as HTMLInputElement).files;
  courseFileRef.value = f && f[0] ? f[0] : null;
};
const onExerciseFileChange = (e: Event) => {
  const f = (e.target as HTMLInputElement).files;
  exerciseFileRef.value = f && f[0] ? f[0] : null;
};
const onQuizFileChange = (e: Event) => {
  const f = (e.target as HTMLInputElement).files;
  quizFileRef.value = f && f[0] ? f[0] : null;
};

const onCourseRemove = () => { courseFileRef.value = null; if (courseInputRef.value) courseInputRef.value.value = ''; };
const onExerciseRemove = () => { exerciseFileRef.value = null; if (exerciseInputRef.value) exerciseInputRef.value.value = ''; };
const onQuizRemove = () => { quizFileRef.value = null; if (quizInputRef.value) quizInputRef.value.value = ''; };

const readFileMeta = (file: File | null) => {
  if (!file) return Promise.resolve(null);
  return new Promise<{ name: string; size: number; type: string; content?: string }>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ name: file.name, size: file.size, type: file.type, content: typeof reader.result === 'string' ? reader.result : '' });
    };
    reader.onerror = () => resolve({ name: file.name, size: file.size, type: file.type, content: '' });
    // try read as text (for JSON/TXT/MD). For binary files content may be empty.
    try { reader.readAsText(file); } catch (err) { reader.readAsDataURL(file); }
  });
};

const viewFile = (fileMeta: any) => {
  if (!fileMeta) return;
  filePreviewName.value = fileMeta.name || 'Fichier';
  filePreviewContent.value = fileMeta.content || 'Aucun aperçu disponible.';
  showFileModal.value = true;
};

const downloadFile = (fileMeta: any) => {
  if (!fileMeta || !fileMeta.content) return;
  const blob = new Blob([fileMeta.content], { type: fileMeta.type || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileMeta.name || 'file';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const addStep = async () => {
  error.value = '';
  if (!newStep.value.title?.trim()) { error.value = "Le titre de l'étape est requis."; return; }
  const courseMeta = await readFileMeta(courseFileRef.value);
  const exerciseMeta = await readFileMeta(exerciseFileRef.value);
  const quizMeta = await readFileMeta(quizFileRef.value);

  const s = {
    id: nextStepId++,
    title: newStep.value.title.trim(),
    courseFile: courseMeta,
    exerciseFile: exerciseMeta,
    quizFile: quizMeta,
    quizTitle: newStep.value.quizTitle || ''
  };

  steps.value.push(s as any);
  closeAddStepModal();
};

const removeStep = (s: { id: number; title?: string }) => {
  if (!confirm(`Supprimer l'étape « ${s.title || s.id} » ?`)) return;
  steps.value = steps.value.filter(item => item.id !== s.id);
};

const goToCourse = (id?: string) => { if (!id) return; router.push(`/courses/${id}`); };
const goToExercise = (id?: string) => { if (!id) return; router.push(`/exercises/${id}`); }; //script étapes du parcours
</script>

<style scoped>
/* Stylisé via tailwind*/
</style>