<template>
  <div class="sf-card">
    <div class="sf-header">
      <div class="sf-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="sf-icon-svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div>
        <h3 class="sf-title">Nouvelle étape</h3>
        <p class="sf-sub">Définissez les bases de votre nouvelle leçon ou quiz</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="sf-form">
      <div class="sf-field sf-field--full">
        <label class="sf-label">Titre de l'étape *</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="ex: Introduction à la grammaire"
          class="sf-input"
          required
        />
      </div>

      <div class="sf-field sf-field--full">
        <label class="sf-label">Description</label>
        <textarea
          v-model="form.description"
          placeholder="Bref résumé de ce que l'étudiant va apprendre..."
          rows="2"
          class="sf-textarea"
        ></textarea>
      </div>

      <div class="sf-field">
        <label class="sf-label">Type d'étape *</label>
        <div class="sf-type-grid">
          <button
            v-for="type in types"
            :key="type.id"
            type="button"
            @click="form.stepType = type.id"
            class="sf-type-btn"
            :class="{ 'sf-type-btn--active': form.stepType === type.id }"
          >
            <span class="sf-type-icon">{{ type.icon }}</span>
            {{ type.label }}
          </button>
        </div>
      </div>

      <div class="sf-field">
        <label class="sf-label">Durée estimée (minutes)</label>
        <div class="sf-duration-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="sf-duration-ico">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <input
            v-model.number="form.estimatedMinutes"
            type="number"
            class="sf-input sf-input--duration"
          />
        </div>
      </div>

      <div class="sf-actions sf-field--full">
        <button type="button" @click="reset" class="sf-btn-reset">
          Réinitialiser
        </button>
        <button type="submit" :disabled="isLoading" class="sf-btn-submit">
          <span v-if="isLoading" class="sf-submit-inner">
            <svg class="sf-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="sf-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Création...
          </span>
          <span v-else>Créer l'étape</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useStepStore } from "~/stores/stepStore";
import { storeToRefs } from "pinia";

const props = defineProps<{
  pathId: string;
}>();

const emit = defineEmits(["created"]);

const stepStore = useStepStore();
const { isLoading } = storeToRefs(stepStore);

const types: {
  id: "lesson" | "quiz" | "exercise";
  label: string;
  icon: string;
}[] = [
  { id: "lesson", label: "Cours", icon: "📖" },
  { id: "quiz", label: "Quiz", icon: "📝" },
  { id: "exercise", label: "Exercice", icon: "🏋️" },
];

const form = reactive({
  title: "",
  description: "",
  stepType: "lesson" as "lesson" | "quiz" | "exercise",
  estimatedMinutes: 15,
  isActive: true,
});

const reset = () => {
  form.title = "";
  form.description = "";
  form.stepType = "lesson";
  form.estimatedMinutes = 15;
};

const handleSubmit = async () => {
  if (!form.title) return;

  // Calcul automatique de l'index : suite de la liste actuelle
  const nextIndex = stepStore.steps.length || 0;

  const success = await stepStore.createStep({
    pathId: props.pathId,
    ...form,
    index: nextIndex,
  });

  if (success) {
    emit("created");
    reset();
  }
};
</script>

<style scoped>
.sf-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
}

.sf-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.sf-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(22,163,74,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #16A34A;
}
.sf-icon-svg { width: 20px; height: 20px; }

.sf-title { font-size: 15px; font-weight: 700; color: #111827; margin: 0; }
.sf-sub { font-size: 13px; color: #9CA3AF; margin: 2px 0 0; }

.sf-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.sf-field { display: flex; flex-direction: column; gap: 6px; }
.sf-field--full { grid-column: 1 / -1; }

.sf-label { font-size: 12px; font-weight: 500; color: #374151; }

.sf-input,
.sf-textarea {
  padding: 9px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  color: #111827;
  background: #FAFAFA;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}
.sf-input:focus, .sf-textarea:focus { border-color: #16A34A; background: #fff; }
.sf-textarea { resize: none; }

/* Type selector */
.sf-type-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

.sf-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #fff;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  font-family: inherit;
}
.sf-type-btn:hover { background: #F9FAFB; border-color: #D1D5DB; }
.sf-type-btn--active {
  background: #16A34A;
  border-color: #16A34A;
  color: #fff;
  box-shadow: 0 1px 3px rgba(22,163,74,.3);
}
.sf-type-icon { font-size: 18px; line-height: 1; }

/* Duration input */
.sf-duration-wrap { position: relative; }
.sf-duration-ico {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px; height: 15px;
  color: #9CA3AF;
  pointer-events: none;
}
.sf-input--duration { padding-left: 32px; }

/* Actions */
.sf-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding-top: 4px;
}

.sf-btn-reset {
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
.sf-btn-reset:hover { background: #F9FAFB; }

.sf-btn-submit {
  padding: 8px 20px;
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
.sf-btn-submit:hover:not(:disabled) { background: #15803D; }
.sf-btn-submit:disabled { background: #D1D5DB; box-shadow: none; cursor: not-allowed; }

.sf-submit-inner { display: flex; align-items: center; gap: 6px; }
.sf-spinner { width: 16px; height: 16px; animation: sf-spin 0.8s linear infinite; }
.sf-spinner-track { opacity: 0.25; }
@keyframes sf-spin { to { transform: rotate(360deg); } }
</style>
