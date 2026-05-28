<template>
  <div class="ed-root">

    <!-- Header -->
    <div class="ed-header">
      <div class="ed-header-left">
        <button class="ed-btn-back" @click="router.back()" title="Retour">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="ed-back-ico">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="ed-title">Configuration de l'étape</h1>
          <p class="ed-sub">Édition du contenu et des paramètres</p>
        </div>
      </div>

      <div class="ed-header-right">
        <button @click="saveStep" :disabled="isSaving" class="ed-btn-save">
          <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="ed-btn-ico">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <svg v-else class="ed-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="ed-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
        </button>
        <div v-if="message" :class="messageType === 'error' ? 'error-message' : 'success-message'">
          {{ message }}
        </div>
        <button
          v-if="stepData.stepType === 'quiz' && existingQuizId"
          @click="removeStepQuiz"
          :disabled="isSaving"
          class="ed-btn-del-quiz"
        >
          Supprimer le quiz
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="ed-loading">
      <div class="ed-load-spinner"></div>
      <p class="ed-load-text">Chargement de l'étape…</p>
    </div>

    <!-- Two-col layout -->
    <div v-else class="ed-layout">

      <!-- Sidebar -->
      <div class="ed-sidebar">
        <div class="ed-card">
          <p class="ed-section-title">Paramètres généraux</p>

          <div class="ed-field">
            <label class="ed-label">Titre</label>
            <input v-model="stepData.title" class="ed-input" />
          </div>

          <div class="ed-field">
            <label class="ed-label">Description</label>
            <textarea v-model="stepData.description" rows="3" class="ed-textarea"></textarea>
          </div>

          <div class="ed-two-col">
            <div class="ed-field">
              <label class="ed-label">Minute(s)</label>
              <input v-model.number="stepData.estimatedMinutes" type="number" class="ed-input" />
            </div>
            <div class="ed-field">
              <label class="ed-label">Ordre</label>
              <input v-model.number="stepData.index" type="number" class="ed-input" />
            </div>
          </div>

          <div class="ed-field">
            <label class="ed-toggle">
              <input type="checkbox" v-model="stepData.isActive" class="ed-toggle-input" />
              <span class="ed-toggle-track"></span>
              <span class="ed-toggle-text">Étape active</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Main editor -->
      <div class="ed-main">
        <div class="ed-card ed-card--flush">
          <div class="ed-editor-head">
            <p class="ed-editor-label">
              Contenu du {{ stepData.stepType === 'lesson' ? 'Cours' : stepData.stepType === 'quiz' ? 'Quiz' : 'Exercice' }}
            </p>
            <span class="ed-type-badge" :class="`ed-type-badge--${stepData.stepType}`">
              {{ stepData.stepType === 'lesson' ? 'Mode Éditeur' : stepData.stepType === 'quiz' ? 'Mode Configuration' : 'Mode Exercice' }}
            </span>
          </div>

          <div class="ed-editor-body">
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
              <div v-if="showCourseForm" class="ed-course-extra">
                <CourseEditor v-model="courseData" />
              </div>
            </template>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Delete quiz modal -->
  <div v-if="confirmDeleteQuiz" class="ed-overlay">
    <div class="ed-modal">
      <div class="ed-del-header">
        <div class="ed-del-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="ed-del-icon-svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div>
          <p class="ed-del-title">Supprimer le quiz</p>
          <p class="ed-del-sub">Cette action est irréversible.</p>
        </div>
      </div>
      <p class="ed-del-msg">Voulez-vous vraiment supprimer ce quiz d'étape ?</p>
      <div class="ed-del-actions">
        <button class="ed-btn-cancel" @click="confirmDeleteQuiz = false">Annuler</button>
        <button class="ed-btn-danger" @click="confirmRemoveStepQuiz">Supprimer</button>
      </div>
    </div>
  </div>
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
const confirmDeleteQuiz = ref(false);
const messageType = ref<'success' | 'error'>('success');
let messageTimer: ReturnType<typeof setTimeout> | null = null;

const showMessage = (text: string, type: 'success' | 'error' = 'success', duration = 3000) => {
  messageType.value = type;
  message.value = text;
  if (messageTimer) {
    clearTimeout(messageTimer);
  }
  if (duration > 0) {
    messageTimer = setTimeout(() => {
      message.value = null;
    }, duration);
  }
};

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
          showMessage('Vous devez fournir du contenu valide pour le cours.', 'error');
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
        showMessage(quizError, 'error');
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
          showMessage(quizStore.error || "Impossible de modifier le quiz de l'étape.", 'error');
          return;
        }
      } else {
        const createdQuiz = await quizStore.createQuiz(quizPayload);
        if (!createdQuiz) {
          showMessage(quizStore.error || "Impossible de créer le quiz de l'étape.", 'error');
          return;
        }
        existingQuizId.value = createdQuiz.id;
      }
    }

    if (stepData.value.stepType === 'lesson') {
      if (!isValidHttpUrl(courseData.value.contentUrl)) {
        showMessage('Vous devez fournir du contenu valide pour le cours.', 'error');
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
          ? "Le quiz de l'étape a été enregistré avec succès."
          : "Le cours de l'étape a été enregistré avec succès.";
      messageType.value = 'success';

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

  confirmDeleteQuiz.value = true;
};

const confirmRemoveStepQuiz = async () => {
  confirmDeleteQuiz.value = false;
  isSaving.value = true;
  try {
    const success = await quizStore.deleteQuiz(existingQuizId.value);
    if (success) {
      existingQuizId.value = null;
      await loadQuizForStep();
      showMessage("Le quiz de l'étape a été supprimé avec succès.");
    } else {
      showMessage(quizStore.error || "Impossible de supprimer le quiz de l'étape.", 'error');
    }
  } catch (err) {
    console.error('Erreur suppression quiz:', err);
    showMessage("Erreur lors de la suppression du quiz de l'étape.", 'error');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.ed-root {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

/* Header */
.ed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.ed-header-left { display: flex; align-items: center; gap: 14px; }
.ed-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.ed-btn-back {
  width: 34px; height: 34px;
  border: 1px solid #E5E7EB;
  background: #fff;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #374151; flex-shrink: 0;
  transition: background 0.12s, border-color 0.12s;
}
.ed-btn-back:hover { background: #F3F4F6; border-color: #D1D5DB; }
.ed-back-ico { width: 16px; height: 16px; }

.ed-title { font-size: 18px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.02em; }
.ed-sub { font-size: 12px; color: #9CA3AF; margin: 2px 0 0; }

.ed-btn-save {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  background: #16A34A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(22,163,74,.3);
  transition: background 0.15s;
  font-family: inherit;
}
.ed-btn-save:hover:not(:disabled) { background: #15803D; }
.ed-btn-save:disabled { background: #D1D5DB; box-shadow: none; cursor: not-allowed; }
.ed-btn-ico { width: 16px; height: 16px; }

.ed-spinner { width: 16px; height: 16px; animation: ed-spin 0.8s linear infinite; }
.ed-spinner-track { opacity: 0.25; }
@keyframes ed-spin { to { transform: rotate(360deg); } }

.success-message {
  padding: 7px 12px;
  background: #DCFCE7;
  color: #166534;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}
.error-message {
  padding: 7px 12px;
  background: #FEE2E2;
  color: #991B1B;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.ed-btn-del-quiz {
  padding: 8px 14px;
  background: rgba(220,38,38,0.08);
  color: #DC2626;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.ed-btn-del-quiz:hover:not(:disabled) { background: rgba(220,38,38,0.14); }
.ed-btn-del-quiz:disabled { opacity: 0.5; cursor: not-allowed; }

/* Loading */
.ed-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 12px;
}
.ed-load-spinner {
  width: 32px; height: 32px;
  border: 3px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: ed-spin 0.7s linear infinite;
}
.ed-load-text { font-size: 13px; color: #9CA3AF; }

/* Layout */
.ed-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  align-items: start;
}
@media (max-width: 768px) {
  .ed-layout { grid-template-columns: 1fr; }
}

/* Cards */
.ed-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ed-card--flush { padding: 0; gap: 0; overflow: hidden; }

.ed-section-title {
  font-size: 11px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin: 0;
  padding-bottom: 14px;
  border-bottom: 1px solid #F3F4F6;
}

/* Fields */
.ed-field { display: flex; flex-direction: column; gap: 6px; }
.ed-label { font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; }

.ed-input, .ed-textarea {
  padding: 9px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  background: #FAFAFA;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}
.ed-input:focus, .ed-textarea:focus { border-color: #16A34A; background: #fff; }
.ed-textarea { resize: none; }

.ed-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 480px) {
  .ed-two-col { grid-template-columns: 1fr; }
}

/* Toggle */
.ed-toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.ed-toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
.ed-toggle-track {
  position: relative;
  width: 40px; height: 22px;
  background: #E5E7EB;
  border-radius: 11px;
  transition: background 0.2s;
  flex-shrink: 0;
}
.ed-toggle-track::after {
  content: '';
  position: absolute;
  width: 16px; height: 16px;
  background: white;
  border-radius: 50%;
  top: 3px; left: 3px;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.ed-toggle-input:checked + .ed-toggle-track { background: #16A34A; }
.ed-toggle-input:checked + .ed-toggle-track::after { transform: translateX(18px); }
.ed-toggle-text { font-size: 13px; font-weight: 500; color: #374151; }

/* Editor card */
.ed-editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #F3F4F6;
  background: #FAFAFA;
}
.ed-editor-label { font-size: 12px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
.ed-editor-body { padding: 24px; }
.ed-course-extra { margin-top: 20px; }

/* Type badge */
.ed-type-badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid;
}
.ed-type-badge--lesson { background: rgba(22,163,74,0.08); color: #15803D; border-color: rgba(22,163,74,0.2); }
.ed-type-badge--quiz { background: #FEF9C3; color: #92400E; border-color: #FDE68A; }
.ed-type-badge--exercise { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }

/* Delete quiz modal */
.ed-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.ed-modal {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ed-del-header { display: flex; align-items: center; gap: 12px; }
.ed-del-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(220,38,38,0.08);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: #DC2626;
}
.ed-del-icon-svg { width: 18px; height: 18px; }
.ed-del-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0; }
.ed-del-sub { font-size: 12px; color: #9CA3AF; margin: 2px 0 0; }
.ed-del-msg { font-size: 13px; color: #6B7280; margin: 0; line-height: 1.5; }
.ed-del-actions { display: flex; justify-content: flex-end; gap: 10px; }
.ed-btn-cancel {
  padding: 8px 16px;
  border: 1px solid #E5E7EB;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.ed-btn-cancel:hover { background: #F9FAFB; }
.ed-btn-danger {
  padding: 8px 16px;
  border: none;
  background: #DC2626;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background 0.12s;
  font-family: inherit;
}
.ed-btn-danger:hover { background: #B91C1C; }
</style>
