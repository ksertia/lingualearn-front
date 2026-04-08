<template>
  <div class="space-y-6">
    <div
      v-for="(question, qIndex) in local.questions"
      :key="qIndex"
      class="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative group animate-fade-in"
    >
      <button
        @click="removeQuestion(qIndex)"
        class="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="mb-4">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Question {{ qIndex + 1 }}
        </label>
        <input
          v-model="question.text"
          placeholder="Entrez votre question ici..."
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
        />
      </div>

      <div class="space-y-3">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Options</label>
        <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center gap-3 animate-slide-in">
          <button
            @click="setCorrectAnswer(qIndex, oIndex)"
            class="flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center"
            :class="question.correctAnswer === oIndex ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-300'"
          >
            <svg v-if="question.correctAnswer === oIndex" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <input
            v-model="question.options[oIndex]"
            placeholder="Option de rÃ©ponse..."
            class="flex-1 bg-white px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
          />

          <button
            @click="removeOption(qIndex, oIndex)"
            v-if="question.options.length > 2"
            class="text-slate-300 hover:text-rose-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <button
          @click="addOption(qIndex)"
          class="text-indigo-600 text-xs font-bold hover:text-indigo-700 flex items-center gap-1 mt-2 px-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter une option
        </button>
      </div>
    </div>

    <button
      @click="addQuestion"
      class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Ajouter une question
    </button>

    <div v-if="mode === 'full'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Score de rÃ©ussite (%)</label>
        <input
          v-model.number="local.passingScore"
          type="number"
          min="0"
          max="100"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max attempts</label>
        <input
          v-model.number="local.maxAttempts"
          type="number"
          min="1"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time limit (minutes)</label>
        <input
          v-model.number="local.timeLimitMinutes"
          type="number"
          min="1"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">XP</label>
        <input
          v-model.number="local.xpReward"
          type="number"
          min="0"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Coins</label>
        <input
          v-model.number="local.coinReward"
          type="number"
          min="0"
          class="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-sm"
        />
      </div>

      <div class="flex items-center gap-3">
        <input
          id="quiz-active"
          v-model="local.isActive"
          type="checkbox"
          class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label for="quiz-active" class="text-sm font-semibold text-slate-600">Quiz actif</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

type QuizQuestionForm = {
  text: string;
  options: string[];
  correctAnswer: number;
};

type QuizForm = {
  questions: QuizQuestionForm[];
  passingScore?: number;
  maxAttempts?: number;
  timeLimitMinutes?: number;
  xpReward?: number;
  coinReward?: number;
  isActive: boolean;
};

type EditorMode = "questions" | "full";

const parseInput = (value: any) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

const detectMode = (value: any): EditorMode => {
  const parsed = parseInput(value);
  if (Array.isArray(parsed)) {
    return "questions";
  }
  if (parsed && typeof parsed === "object") {
    return "full";
  }
  return "questions";
};

const normalizeQuestions = (value: any): QuizQuestionForm[] => {
  const source = Array.isArray(value)
    ? value
    : Array.isArray(value?.questions)
      ? value.questions
      : [];
  return source.map((q: any) => ({
    text: typeof q?.text === "string" ? q.text : typeof q?.questionText === "string" ? q.questionText : "",
    options: Array.isArray(q?.options) ? q.options : ["", ""],
    correctAnswer: typeof q?.correctAnswer === "number" ? q.correctAnswer : 0,
  }));
};

const normalize = (value: any): QuizForm => {
  const parsed = parseInput(value);
  const questions = normalizeQuestions(parsed);

  return {
    questions,
    passingScore: typeof parsed?.passingScore === "number" ? parsed.passingScore : undefined,
    maxAttempts: typeof parsed?.maxAttempts === "number" ? parsed.maxAttempts : undefined,
    timeLimitMinutes: typeof parsed?.timeLimitMinutes === "number" ? parsed.timeLimitMinutes : undefined,
    xpReward: typeof parsed?.xpReward === "number" ? parsed.xpReward : undefined,
    coinReward: typeof parsed?.coinReward === "number" ? parsed.coinReward : undefined,
    isActive: typeof parsed?.isActive === "boolean" ? parsed.isActive : true,
  };
};

const mode = ref<EditorMode>(detectMode(props.modelValue));
const local = ref<QuizForm>(normalize(props.modelValue));

const ensureDefaults = () => {
  if (local.value.questions.length === 0) {
    local.value.questions.push({
      text: "",
      options: ["", ""],
      correctAnswer: 0,
    });
  }
  local.value.questions = local.value.questions.map((question) => {
    const options = Array.isArray(question.options) ? question.options : [];
    while (options.length < 2) {
      options.push("");
    }
    const maxIndex = Math.max(options.length - 1, 0);
    const correctAnswer = typeof question.correctAnswer === "number" && question.correctAnswer <= maxIndex
      ? question.correctAnswer
      : 0;
    return {
      ...question,
      options,
      correctAnswer,
    };
  });
};

ensureDefaults();

watch(
  () => props.modelValue,
  (value) => {
    mode.value = detectMode(value);
    local.value = normalize(value);
    ensureDefaults();
  },
  { deep: true }
);

watch(local, (newVal) => {
  if (mode.value === "questions") {
    emit("update:modelValue", newVal.questions);
  } else {
    emit("update:modelValue", newVal);
  }
}, { deep: true });

const addQuestion = () => {
  local.value.questions.push({
    text: "",
    options: ["", ""],
    correctAnswer: 0,
  });
};

const removeQuestion = (index: number) => {
  local.value.questions.splice(index, 1);
  ensureDefaults();
};

const addOption = (qIndex: number) => {
  local.value.questions[qIndex].options.push("");
};

const removeOption = (qIndex: number, oIndex: number) => {
  local.value.questions[qIndex].options.splice(oIndex, 1);
  if (local.value.questions[qIndex].correctAnswer >= local.value.questions[qIndex].options.length) {
    local.value.questions[qIndex].correctAnswer = 0;
  }
};

const setCorrectAnswer = (qIndex: number, oIndex: number) => {
  local.value.questions[qIndex].correctAnswer = oIndex;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.animate-slide-in {
  animation: slideIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
