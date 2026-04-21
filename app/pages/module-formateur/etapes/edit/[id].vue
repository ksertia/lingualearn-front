<template>
  <section class="max-w-5xl mx-auto p-8 pb-32">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <button
          class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group -ml-1 sm:-ml-2"
          @click="router.back()"
          title="Retour"
        >
          <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Configuration de l'étape</h1>
          <p class="text-slate-500 font-medium">Édition du contenu et des paramètres</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="saveStep"
          :disabled="isSaving"
          class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all disabled:bg-slate-300 disabled:shadow-none flex items-center gap-2"
        >
          <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
        </button>
        <div v-if="message" class="success-message">
          {{ message }}
        </div>
        <button
          v-if="stepData.stepType === 'quiz' && existingQuizId"
          @click="removeStepQuiz"
          :disabled="isSaving"
          class="px-5 py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transform hover:-translate-y-0.5 transition-all disabled:bg-slate-300 disabled:shadow-none"
        >
          Supprimer le quiz
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-500 font-bold animate-pulse">Chargement de l'étape...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Sidebar Settings -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 pb-4 border-b border-slate-50">Paramètres généraux</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Titre</label>
              <input 
                v-model="stepData.title" 
                class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea 
                v-model="stepData.description" 
                rows="3"
                class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-600 resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Minute(s)</label>
                <input 
                  v-model.number="stepData.estimatedMinutes" 
                  type="number"
                  class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ordre</label>
                <input 
                  v-model.number="stepData.index" 
                  type="number"
                  class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                />
              </div>
            </div>

            <div class="pt-4">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="stepData.isActive" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span class="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Étape active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Editor Content -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30 flex justify-between items-center">
            <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider">
              Contenu du {{ stepData.stepType === 'lesson' ? 'Cours' : stepData.stepType === 'quiz' ? 'Quiz' : 'Exercice' }}
            </h3>
            <span :class="[
              'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
              stepData.stepType === 'lesson'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : stepData.stepType === 'quiz'
                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                  : 'bg-blue-50 text-blue-700 border-blue-100'
            ]">
              {{ stepData.stepType === 'lesson' ? 'Mode Editeur' : stepData.stepType === 'quiz' ? 'Mode Configuration' : 'Mode Exercice' }}
            </span>
          </div>

          <div class="p-8">
            <template v-if="stepData.stepType === 'lesson'">
              <CourseEditor v-model="courseData" />
            </template>
            <template v-else-if="stepData.stepType === 'quiz'">
              <QuizEditor v-model="quizData" />
            </template>
            <template v-else>
              <ExerciseEditor
                v-model="exerciseData"
                :courses="courseStore.courses"
                :courses-loading="courseStore.isLoading"
                :courses-error="courseStore.error"
                :selected-course-id="existingCourseId"
                :has-course="Boolean(existingCourseId)"
                :course-form-open="showCourseForm"
                @update:selected-course-id="selectCourseById"
                @toggle-course="toggleCourseForm"
              />
              <div v-if="showCourseForm" class="mt-6">
                <CourseEditor v-model="courseData" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStepStore } from '~/stores/stepStore';
import CourseEditor from '@/components/Module-formateur/Step/CourseEditor.vue';
import QuizEditor from '@/components/Module-formateur/Step/QuizEditor.vue';
import ExerciseEditor from '@/components/Module-formateur/Step/ExerciseEditor.vue';
import { useExerciseStore } from '~/stores/exerciseStore';
import { useCourseStore } from '~/stores/courseStore';
import { useQuizStore } from '~/stores/quizStore';
import { useApiService } from '~/services/api';
import type { Exercise, CreateExerciseRequest, Course, CreateCourseRequest, StepQuiz, CreateStepQuizRequest, QuizQuestion } from '~/types/learning';

definePageMeta({
  layout: "formateur",
});

const route = useRoute();
const router = useRouter();
const stepStore = useStepStore();
const api = useApiService();
const config = useRuntimeConfig();

const id = String(route.params.id);
const isLoading = ref(true);
const isSaving = ref(false);

const stepData = ref<any>({
  title: '',
  description: '',
  estimatedMinutes: 15,
  index: 0,
  isActive: true,
  stepType: 'lesson',
  content: null
});

type ExerciseQuestion = {
  text: string;
  options: string[];
  correctAnswer: number;
};

type FillBlankItem = {
  prompt: string;
  answer: string;
};

type MatchPair = {
  left: string;
  right: string;
};

type ExerciseForm = {
  id?: string;
  title: string;
  exerciseType: 'multiple_choice' | 'fill_blank' | 'matching';
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
  mediaType?: 'image' | 'video' | 'audio' | 'pdf';
  mediaUrl?: string;
};

type QuizQuestionForm = {
  text: string;
  options: string[];
  correctAnswer: number;
};

type QuizForm = {
  id?: string;
  questions: QuizQuestionForm[];
  passingScore?: number;
  maxAttempts?: number;
  timeLimitMinutes?: number;
  xpReward?: number;
  coinReward?: number;
  isActive: boolean;
};

type CourseForm = {
  id?: string;
  title: string;
  description?: string;
  contentType: 'video' | 'audio' | 'text' | 'pdf' | 'image';
  contentUrl: string;
  duration?: number;
  order?: number;
  isPublished?: boolean;
  isActive?: boolean;
};

const exerciseStore = useExerciseStore();
const existingExerciseId = ref<string | null>(null);
const courseStore = useCourseStore();
const existingCourseId = ref<string | null>(null);
const quizStore = useQuizStore();
const existingQuizId = ref<string | null>(null);
const showCourseForm = ref(false);
const message = ref<string | null>(null);

const defaultExerciseForm = (): ExerciseForm => ({
  title: '',
  exerciseType: 'multiple_choice',
  instructions: '',
  questions: [],
  fillBlankItems: [],
  matchPairs: [],
  hints: [],
  explanation: '',
  points: undefined,
  xpReward: undefined,
  coinReward: undefined,
  maxAttempts: undefined,
  timeLimitSeconds: undefined,
  sortOrder: undefined,
  isActive: true,
  mediaType: undefined,
  mediaUrl: '',
});

const exerciseData = ref<ExerciseForm>(defaultExerciseForm());

const defaultQuizForm = (): QuizForm => ({
  questions: [],
  passingScore: undefined,
  maxAttempts: undefined,
  timeLimitMinutes: undefined,
  xpReward: undefined,
  coinReward: undefined,
  isActive: true,
});

const quizData = ref<QuizForm>(defaultQuizForm());

const defaultCourseForm = (): CourseForm => ({
  title: '',
  description: '',
  contentType: 'text',
  contentUrl: '',
  duration: undefined,
  order: undefined,
  isPublished: false,
  isActive: true,
});

const courseData = ref<CourseForm>(defaultCourseForm());

const parseMaybeJson = (value: any) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

const normalizeQuizQuestions = (source: any[]): QuizQuestionForm[] => {
  return source.map((question) => {
    const options = Array.isArray(question?.options) ? question.options : [];
    const rawAnswer = question?.correctAnswer;
    let correctIndex = 0;

    if (typeof rawAnswer === 'number' && Number.isFinite(rawAnswer)) {
      correctIndex = rawAnswer;
    } else if (typeof rawAnswer === 'string') {
      const optionIndex = options.findIndex((opt: any) => opt === rawAnswer);
      if (optionIndex >= 0) {
        correctIndex = optionIndex;
      } else if (/^\d+$/.test(rawAnswer)) {
        correctIndex = Number.parseInt(rawAnswer, 10);
      }
    } else if (Array.isArray(rawAnswer) && typeof rawAnswer[0] === 'string') {
      const optionIndex = options.findIndex((opt: any) => opt === rawAnswer[0]);
      if (optionIndex >= 0) {
        correctIndex = optionIndex;
      }
    }

    return {
      text: typeof question?.text === 'string'
        ? question.text
        : typeof question?.questionText === 'string'
          ? question.questionText
          : '',
      options: options.length ? options : ['', ''],
      correctAnswer: correctIndex,
    };
  });
};

const mapContentToQuizQuestions = (content: any): QuizQuestionForm[] => {
  if (Array.isArray(content)) {
    return normalizeQuizQuestions(content);
  }
  if (content && Array.isArray(content.questions)) {
    return normalizeQuizQuestions(content.questions);
  }
  return [];
};

const ensureQuizDefaults = () => {
  if (quizData.value.questions.length === 0) {
    quizData.value.questions.push({
      text: '',
      options: ['', ''],
      correctAnswer: 0,
    });
  }
  quizData.value.questions = quizData.value.questions.map((question) => {
    const options = Array.isArray(question.options) ? question.options : [];
    while (options.length < 2) {
      options.push('');
    }
    const maxIndex = Math.max(options.length - 1, 0);
    const correctAnswer = typeof question.correctAnswer === 'number' && question.correctAnswer <= maxIndex
      ? question.correctAnswer
      : 0;
    return {
      ...question,
      options,
      correctAnswer,
    };
  });
  if (typeof quizData.value.isActive !== 'boolean') {
    quizData.value.isActive = true;
  }
};

const mapQuizToForm = (quiz: StepQuiz): QuizForm => ({
  id: quiz.id,
  questions: normalizeQuizQuestions(Array.isArray(quiz.questions) ? quiz.questions : []),
  passingScore: quiz.passingScore ?? undefined,
  maxAttempts: quiz.maxAttempts ?? undefined,
  timeLimitMinutes: quiz.timeLimitMinutes ?? undefined,
  xpReward: quiz.xpReward ?? undefined,
  coinReward: quiz.coinReward ?? undefined,
  isActive: quiz.isActive ?? true,
});

const mapQuizQuestionsToApi = (questions: QuizQuestionForm[]): QuizQuestion[] => {
  return (questions || []).map((question) => {
    const options = Array.isArray(question.options)
      ? question.options.map((opt) => (typeof opt === 'string' ? opt.trim() : ''))
      : [];
    const index = typeof question.correctAnswer === 'number' ? question.correctAnswer : 0;
    const boundedIndex = index >= 0 && index < options.length ? index : 0;
    const answerText = options[boundedIndex] ?? '';

    return {
      questionText: (question.text || '').trim(),
      questionType: 'multiple_choice',
      options,
      correctAnswer: answerText,
    };
  }) as QuizQuestion[];
};

const buildQuizPayload = (): CreateStepQuizRequest => ({
  stepId: id,
  title: (stepData.value.title || 'Quiz').trim(),
  description: stepData.value.description?.trim() || undefined,
  questions: mapQuizQuestionsToApi(quizData.value.questions),
  passingScore: quizData.value.passingScore,
  maxAttempts: quizData.value.maxAttempts,
  timeLimitMinutes: quizData.value.timeLimitMinutes,
  xpReward: quizData.value.xpReward,
  coinReward: quizData.value.coinReward,
  isActive: quizData.value.isActive ?? stepData.value.isActive ?? true,
});

const validateQuizData = (): string | null => {
  const questions = (quizData.value.questions || []) as QuizQuestionForm[];
  if (questions.length === 0) {
    return 'Ajoute au moins une question.';
  }
  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i];
    const text = question?.text?.trim();
    if (!text) {
      return `La question ${i + 1} est vide.`;
    }
    const options = Array.isArray(question?.options) ? question.options.map((opt) => (typeof opt === 'string' ? opt.trim() : '')) : [];
    const nonEmpty = options.filter((opt) => opt);
    if (nonEmpty.length < 2) {
      return `La question ${i + 1} doit avoir au moins deux options.`;
    }
    const correctIndex = typeof question?.correctAnswer === 'number' ? question.correctAnswer : 0;
    const boundedIndex = correctIndex >= 0 && correctIndex < options.length ? correctIndex : 0;
    if (!options[boundedIndex]) {
      return `La réponse correcte de la question ${i + 1} est vide.`;
    }
  }
  if (typeof quizData.value.passingScore === 'number') {
    if (quizData.value.passingScore < 0 || quizData.value.passingScore > 100) {
      return 'Le score de réussite doit être compris entre 0 et 100.';
    }
  }
  return null;
};

const mapCourseToForm = (course: Course): CourseForm => ({
  id: course.id,
  title: course.title || stepData.value.title || '',
  description: course.description || stepData.value.description || '',
  contentType: course.contentType || 'text',
  contentUrl: course.contentUrl || '',
  duration: course.duration ?? undefined,
  order: course.order ?? undefined,
  isPublished: course.isPublished ?? false,
  isActive: course.isActive ?? true,
});

const getApiOrigin = () => {
  if (config.public.apiBase) {
    try {
      return new URL(config.public.apiBase).origin;
    } catch (err) {
      return '';
    }
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

const normalizeCourseContentUrl = (value: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return '';
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    const origin = getApiOrigin();
    if (origin) {
      normalized = normalized.startsWith('/') ? `${origin}${normalized}` : `${origin}/${normalized}`;
    }
  }
  return encodeURI(normalized);
};

const buildCoursePayload = (includeStepId = true): any => {
  const normalizedUrl = normalizeCourseContentUrl(courseData.value.contentUrl);
  if (normalizedUrl && normalizedUrl !== courseData.value.contentUrl) {
    courseData.value.contentUrl = normalizedUrl;
  }

  const payload: any = {
    ...(includeStepId ? { stepId: id } : {}),
    title: courseData.value.title || stepData.value.title || 'Cours',
    description: courseData.value.description ?? '',
    contentType: courseData.value.contentType,
    contentUrl: normalizedUrl || courseData.value.contentUrl || '',
    duration: courseData.value.duration,
    order: courseData.value.order ?? stepData.value.index,
    isPublished: courseData.value.isPublished ?? false,
    isActive: courseData.value.isActive ?? true,
  };

  if (!payload.contentUrl) {
    delete payload.contentUrl;
  }
  if (payload.duration === undefined) {
    delete payload.duration;
  }
  if (payload.order === undefined) {
    delete payload.order;
  }

  return payload;
};

const isValidHttpUrl = (value: string) => {
  const normalized = normalizeCourseContentUrl(value);
  if (!normalized) return false;
  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

const loadCourseForStep = async (fetchAll = false) => {
  await courseStore.fetchCourses(fetchAll ? undefined : id);

  const existing = courseStore.courses.find((c) => c.stepId === id);

  if (existing) {
    existingCourseId.value = existing.id;
    courseData.value = mapCourseToForm(existing);
    return;
  }

  if (fetchAll && courseStore.courses.length > 0) {
    const fallback = courseStore.courses[0]!;
    if (!existingCourseId.value) {
      existingCourseId.value = fallback.id;
    }
    const selected = courseStore.courses.find((c) => c.id === existingCourseId.value) || fallback;
    if (selected) {
      courseData.value = mapCourseToForm(selected);
      return;
    }
  }

  existingCourseId.value = null;
  courseData.value = defaultCourseForm();
  courseData.value.title = stepData.value.title || '';
  courseData.value.description = stepData.value.description || '';
  courseData.value.order = stepData.value.index ?? undefined;
};

const loadQuizForStep = async () => {
  await quizStore.fetchQuizzes(id);

  const existing = quizStore.quizzes.find((q) => q.stepId === id);

  if (existing) {
    existingQuizId.value = existing.id;
    quizData.value = mapQuizToForm(existing);
    ensureQuizDefaults();
    return;
  }

  const fallbackQuestions = mapContentToQuizQuestions(stepData.value.content);
  quizData.value = {
    ...defaultQuizForm(),
    questions: fallbackQuestions,
    isActive: stepData.value.isActive ?? true,
  };
  ensureQuizDefaults();
};

const toggleCourseForm = () => {
  showCourseForm.value = !showCourseForm.value;
};

const selectCourseById = (courseId: string | null) => {
  existingCourseId.value = courseId;
  if (!courseId) return;
  const course = courseStore.courses.find((c) => c.id === courseId);
  if (course) {
    courseData.value = mapCourseToForm(course);
  }
  showCourseForm.value = false;
};

const mapExerciseToForm = (exercise: Exercise): ExerciseForm => {
  const content = parseMaybeJson(exercise.content);
  const correct = parseMaybeJson(exercise.correctAnswers);
  const hintsRaw = parseMaybeJson(exercise.hints);
  const media =
    content && typeof content === 'object' && !Array.isArray(content)
      ? (content as any).media
      : null;

  const form = defaultExerciseForm();
  form.id = exercise.id;
  form.title = exercise.title || stepData.value.title || '';
  form.exerciseType = exercise.exerciseType || 'multiple_choice';
  form.instructions = exercise.instructions || '';
  form.explanation = exercise.explanation || '';
  form.points = exercise.points ?? undefined;
  form.xpReward = exercise.xpReward ?? undefined;
  form.coinReward = exercise.coinReward ?? undefined;
  form.maxAttempts = exercise.maxAttempts ?? undefined;
  form.timeLimitSeconds = exercise.timeLimitSeconds ?? undefined;
  form.sortOrder = exercise.sortOrder ?? undefined;
  form.isActive = exercise.isActive ?? true;

  if (media && typeof media === 'object') {
    const type = typeof media.type === 'string' ? media.type : '';
    const url = typeof media.url === 'string' ? media.url : '';
    if (['image', 'video', 'audio', 'pdf'].includes(type)) {
      form.mediaType = type as ExerciseForm['mediaType'];
    }
    if (url) {
      form.mediaUrl = url;
    }
  }

  if (Array.isArray(hintsRaw)) {
    form.hints = hintsRaw.filter((h) => typeof h === 'string');
  } else if (Array.isArray((hintsRaw as any)?.items)) {
    form.hints = (hintsRaw as any).items.filter((h: any) => typeof h === 'string');
  } else if (typeof hintsRaw === 'string' && hintsRaw.trim()) {
    form.hints = [hintsRaw];
  }

  if (form.exerciseType === 'multiple_choice') {
    const questionsSource = Array.isArray((content as any)?.questions)
      ? (content as any).questions
      : Array.isArray(content)
        ? content
        : [];
    const answers = Array.isArray((correct as any)?.answers) ? (correct as any).answers : [];

    form.questions = questionsSource.map((q: any, index: number) => ({
      text: typeof q.text === 'string' ? q.text : '',
      options: Array.isArray(q.options) ? q.options : ['', ''],
      correctAnswer: typeof q.correctAnswer === 'number'
        ? q.correctAnswer
        : typeof answers[index] === 'number'
          ? answers[index]
          : 0,
    }));
  } else if (form.exerciseType === 'fill_blank') {
    let promptItems: any[] = [];
    if (Array.isArray((content as any)?.items)) {
      promptItems = (content as any).items;
    } else if (Array.isArray((content as any)?.prompts)) {
      promptItems = (content as any).prompts;
    } else if (Array.isArray(content)) {
      promptItems = content as any[];
    }

    const prompts = promptItems.map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') return item.prompt || item.text || '';
      return '';
    });

    let answersSource: any[] = [];
    if (Array.isArray((correct as any)?.answers)) {
      answersSource = (correct as any).answers;
    } else if (Array.isArray(correct)) {
      answersSource = correct as any[];
    } else if (Array.isArray(promptItems)) {
      answersSource = promptItems.map((item) =>
        item && typeof item === 'object' ? item.answer : ''
      );
    }

    const length = Math.max(prompts.length, answersSource.length);
    for (let i = 0; i < length; i += 1) {
      form.fillBlankItems.push({
        prompt: prompts[i] ?? '',
        answer: answersSource[i] ?? '',
      });
    }
  } else {
    let pairsSource: any[] = [];
    if (Array.isArray((content as any)?.pairs)) {
      pairsSource = (content as any).pairs;
    } else if (Array.isArray((correct as any)?.pairs)) {
      pairsSource = (correct as any).pairs;
    } else if (Array.isArray(content)) {
      pairsSource = content as any[];
    } else if (Array.isArray((content as any)?.left) && Array.isArray((content as any)?.right)) {
      const lefts = (content as any).left;
      const rights = (content as any).right;
      const length = Math.max(lefts.length, rights.length);
      for (let i = 0; i < length; i += 1) {
        form.matchPairs.push({
          left: lefts[i] ?? '',
          right: rights[i] ?? '',
        });
      }
    }

    if (pairsSource.length) {
      form.matchPairs = pairsSource.map((pair) => {
        if (Array.isArray(pair)) {
          return {
            left: pair[0] ?? '',
            right: pair[1] ?? '',
          };
        }
        return {
          left: pair?.left ?? '',
          right: pair?.right ?? '',
        };
      });
    }
  }

  if (form.exerciseType === 'fill_blank' && form.fillBlankItems.length === 0) {
    form.fillBlankItems.push({ prompt: '', answer: '' });
  }
  if (form.exerciseType === 'matching' && form.matchPairs.length === 0) {
    form.matchPairs.push({ left: '', right: '' });
  }

  return form;
};

const buildExercisePayload = (lessonId: string): CreateExerciseRequest => {
  const hints = exerciseData.value.hints && exerciseData.value.hints.length
    ? { items: exerciseData.value.hints }
    : undefined;
  const mediaType = exerciseData.value.mediaType;
  const mediaUrl = exerciseData.value.mediaUrl?.trim();
  const media = mediaType && mediaUrl ? { type: mediaType, url: mediaUrl } : undefined;

  const base = {
    lessonId,
    title: exerciseData.value.title || stepData.value.title || 'Exercice',
    exerciseType: exerciseData.value.exerciseType,
    instructions: exerciseData.value.instructions || undefined,
    hints,
    explanation: exerciseData.value.explanation || undefined,
    points: exerciseData.value.points,
    xpReward: exerciseData.value.xpReward,
    coinReward: exerciseData.value.coinReward,
    maxAttempts: exerciseData.value.maxAttempts,
    timeLimitSeconds: exerciseData.value.timeLimitSeconds,
    sortOrder: exerciseData.value.sortOrder,
    isActive: exerciseData.value.isActive,
  };

  if (exerciseData.value.exerciseType === 'multiple_choice') {
    const questions = exerciseData.value.questions || [];
    return {
      ...base,
      content: {
        questions: questions.map((q) => ({
          text: q.text,
          options: Array.isArray(q.options) ? q.options : [],
        })),
        ...(media ? { media } : {}),
      },
      correctAnswers: {
        answers: questions.map((q) => q.correctAnswer),
      },
    };
  }

  if (exerciseData.value.exerciseType === 'fill_blank') {
    const items = (exerciseData.value.fillBlankItems || []).filter(
      (item) => item.prompt || item.answer
    );

    return {
      ...base,
      content: {
        items: items.map((item) => ({
          prompt: item.prompt,
        })),
        ...(media ? { media } : {}),
      },
      correctAnswers: {
        answers: items.map((item) => item.answer),
      },
    };
  }

  const pairs = (exerciseData.value.matchPairs || []).filter(
    (pair) => pair.left || pair.right
  );

  return {
    ...base,
    content: {
      pairs: pairs.map((pair) => ({
        left: pair.left,
        right: pair.right,
      })),
      ...(media ? { media } : {}),
    },
    correctAnswers: {
      pairs: pairs.map((pair) => ({
        left: pair.left,
        right: pair.right,
      })),
    },
  };
};

const buildStepPayload = () => {
  const payload: Record<string, any> = {
    title: stepData.value.title,
    description: stepData.value.description,
    estimatedMinutes: stepData.value.estimatedMinutes,
    index: stepData.value.index,
    isActive: stepData.value.isActive,
  };

  if (stepData.value.stepType === 'quiz') {
    const questions = quizData.value.questions || [];
    payload.content = questions.length ? JSON.stringify(questions) : null;
  }

  return payload;
};

const loadExerciseForStep = async () => {
  await exerciseStore.fetchExercises(id);
  const existing = exerciseStore.exercises.find(
    (ex) => ex.lessonId === id || ex.stepId === id
  ) || exerciseStore.exercises[0];

  if (existing) {
    existingExerciseId.value = existing.id;
    if (existing.lessonId) {
      existingCourseId.value = existing.lessonId;
    }
    exerciseData.value = mapExerciseToForm(existing);
  } else {
    exerciseData.value = defaultExerciseForm();
    exerciseData.value.title = stepData.value.title || '';
  }
};

onMounted(async () => {
  try {
    const response: any = await api.getStep(id); // I need to ensure getStep exists
    if (response) {
      stepData.value = { ...response };
      // Handle content if it's stored as string
      if (typeof stepData.value.content === 'string') {
        try {
          stepData.value.content = JSON.parse(stepData.value.content);
        } catch (e) {}
      }

      if (stepData.value.stepType === 'exercise') {
        await loadExerciseForStep();
        await loadCourseForStep(true);
        showCourseForm.value = false;
      }
      if (stepData.value.stepType === 'quiz') {
        await loadQuizForStep();
      }
      if (stepData.value.stepType === 'lesson') {
        await loadCourseForStep();
      }
    }
  } catch (err) {
    console.error("Erreur chargement étape:", err);
  } finally {
    isLoading.value = false;
  }
});

const saveStep = async () => {
  isSaving.value = true;
  try {
    let stepSuccess = true;
    if (stepData.value.stepType !== 'quiz') {
      stepSuccess = await stepStore.updateStep(id, buildStepPayload());
    }

    if (stepData.value.stepType === 'exercise') {
      let courseId = existingCourseId.value;

      if (!courseId) {
        if (!isValidHttpUrl(courseData.value.contentUrl)) {
          alert('Vous devez fournir du contenu.');
          return;
        }

        const createdCourse = await courseStore.createCourse(buildCoursePayload());
        if (!createdCourse?.id) {
          return;
        }
        existingCourseId.value = createdCourse.id;
        courseId = createdCourse.id;
        showCourseForm.value = false;
      }

      const exercisePayload = buildExercisePayload(courseId);
      if (existingExerciseId.value) {
        await exerciseStore.updateExercise(existingExerciseId.value, exercisePayload);
      } else {
        const created = await exerciseStore.createExercise(exercisePayload);
        if (created?.id) {
          existingExerciseId.value = created.id;
        }
      }
    }

    if (stepData.value.stepType === 'quiz') {
      const quizError = validateQuizData();
      if (quizError) {
        alert(quizError);
        return;
      }
      if (!existingQuizId.value) {
        await quizStore.fetchQuizzes(id);
        const existing = quizStore.quizzes.find((q) => q.stepId === id);
        if (existing) {
          existingQuizId.value = existing.id;
        }
      }
      const quizPayload = buildQuizPayload();
      if (existingQuizId.value) {
        const updated = await quizStore.updateQuiz(existingQuizId.value, quizPayload as Partial<StepQuiz>);
        if (!updated) {
          alert(quizStore.error || 'Impossible de mettre à jour le quiz d\'étape.');
          return;
        }
      } else {
        const createdQuiz = await quizStore.createQuiz(quizPayload);
        if (!createdQuiz) {
          alert(quizStore.error || 'Impossible de créer le quiz d\'étape.');
          return;
        }
        existingQuizId.value = createdQuiz.id;
      }
    }

    if (stepData.value.stepType === 'lesson') {
      if (!isValidHttpUrl(courseData.value.contentUrl)) {
        alert('Vous devez fournir du contenu');
      } else {
        const coursePayload = buildCoursePayload();
        if (existingCourseId.value) {
          await courseStore.updateCourse(existingCourseId.value, buildCoursePayload(false));
        } else {
          const created = await courseStore.createCourse(buildCoursePayload(true));
          if (created?.id) {
            existingCourseId.value = created.id;
          }
        }
      }
    }
    if (stepSuccess) {
      message.value = stepData.value.stepType === 'quiz'
          ? "Le quiz a été créé avec succès"
          : "Le cours a été créé avec succès";

      setTimeout(() => {
        router.back(); // retourne à la page d'où vous venez
      }, 2000);
    }

    if (!stepSuccess) {
      console.warn("Mise a jour de l'etape echouee, mais le contenu associe a ete traite.");
    }
  } catch (err) {
    console.error("Erreur sauvegarde:", err);
  } finally {
    isSaving.value = false;
  }
};

const removeStepQuiz = async () => {
  if (!existingQuizId.value) {
    return;
  }

  if (!confirm("Êtes-vous sûr de vouloir supprimer ce quiz d'étape ?")) {
    return;
  }

  isSaving.value = true;
  try {
    const success = await quizStore.deleteQuiz(existingQuizId.value);
    if (success) {
      existingQuizId.value = null;
      await loadQuizForStep();
      alert('Quiz d\'étape supprimé avec succès.');
    } else {
      alert(quizStore.error || 'Impossible de supprimer le quiz d\'étape.');
    }
  } catch (err) {
    console.error('Erreur suppression quiz:', err);
    alert('Erreur lors de la suppression du quiz d\'étape.');
  } finally {
    isSaving.value = false;
  }
};


</script>
