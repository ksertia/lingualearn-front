<template>
  <div class="sl-card">

    <!-- Header -->
    <div class="sl-head">
      <div>
        <h3 class="sl-title">{{ headerTitle }}</h3>
        <p class="sl-sub">{{ headerSubtitle }}</p>
      </div>
      <span v-if="displaySteps.length > 0" class="sl-badge">
        {{ displaySteps.length }} Étape{{ displaySteps.length > 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="sl-state">
      <div class="sl-spinner"></div>
      <p class="sl-state-text">Chargement des étapes…</p>
    </div>

    <!-- Empty -->
    <div v-else-if="displaySteps.length === 0" class="sl-empty">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="sl-empty-ico">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      <p class="sl-empty-title">{{ emptyTitle }}</p>
      <p class="sl-empty-desc">{{ emptyDescription }}</p>
    </div>

    <!-- Table -->
    <div v-else class="sl-table-wrap">
      <table class="sl-tbl">
        <thead>
          <tr>
            <th>Ordre</th>
            <th>Titre &amp; Description</th>
            <th>Type</th>
            <th v-if="!isReadonly">Statut</th>
            <th>Durée</th>
            <th v-if="!isReadonly" class="sl-th-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="step in displaySteps"
            :key="step.id"
            class="sl-row"
            :class="[
              !step.isActive && 'sl-row--inactive',
              isExternal && 'sl-row--clickable'
            ]"
            @click="handleRowClick(step)"
          >
            <td>
              <span class="sl-order" :class="step.isActive ? 'sl-order--active' : 'sl-order--off'">
                {{ step.index }}
              </span>
            </td>
            <td>
              <span class="sl-item-title">{{ step.title }}</span>
              <span class="sl-item-desc">{{ step.description || 'Pas de description' }}</span>
            </td>
            <td>
              <span class="sl-pill" :class="`sl-pill--${step.stepType}`">
                {{ getStepTypeLabel(step.stepType) }}
              </span>
            </td>
            <td v-if="!isReadonly">
              <label class="sl-toggle" @click.stop>
                <input type="checkbox" class="sl-toggle-input" :checked="step.isActive" @change="toggleStatus(step)" />
                <span class="sl-toggle-track"></span>
                <span class="sl-toggle-text">{{ step.isActive ? 'Actif' : 'Inactif' }}</span>
              </label>
            </td>
            <td>
              <div class="sl-duration">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="sl-clock-ico">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ step.estimatedMinutes }}m
              </div>
            </td>
            <td v-if="!isReadonly">
              <div class="sl-row-actions">
                <button class="sl-act sl-act--edit" @click.stop="editStep(step)" title="Modifier le contenu">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="sl-act-ico">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button class="sl-act sl-act--del" @click.stop="confirmDelete(step)" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="sl-act-ico">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete modal -->
    <div v-if="stepToDelete" class="sl-overlay">
      <div class="sl-modal">
        <div class="sl-del-header">
          <div class="sl-del-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="sl-del-icon-svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <p class="sl-del-title">Confirmer la suppression</p>
            <p class="sl-del-sub">Cette action est irréversible.</p>
          </div>
        </div>
        <p class="sl-del-msg">
          Êtes-vous sûr de vouloir supprimer l'étape <span class="sl-del-name">{{ stepToDelete.title }}</span> ?
        </p>
        <div class="sl-del-actions">
          <button class="sl-btn-cancel" @click="stepToDelete = null">Annuler</button>
          <button class="sl-btn-danger" @click="deleteStepConfirmed">Supprimer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStepStore } from '~/stores/stepStore';
import { storeToRefs } from 'pinia';
import type { Step } from '~/types/learning';
import { stepTypeLabel } from '~/utils/labels';

const props = defineProps<{
  pathId?: string;
  items?: Step[];
  readonly?: boolean;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}>();

const emit = defineEmits<{
  (e: 'select', step: Step): void;
}>();

const stepStore = useStepStore();
const { steps, isLoading } = storeToRefs(stepStore);
const router = useRouter();
const stepToDelete = ref<Step | null>(null);

const isExternal = computed(() => Array.isArray(props.items));
const isReadonly = computed(() => Boolean(props.readonly || isExternal.value));
const displaySteps = computed(() => (props.items?.length ? props.items : steps.value));
const headerTitle = computed(() => props.title || "Étapes du parcours");
const headerSubtitle = computed(
  () => props.subtitle || "Gérez le contenu et l'ordre des étapes",
);
const emptyTitle = computed(() => props.emptyTitle || "Aucune étape trouvée");
const emptyDescription = computed(
  () => props.emptyDescription || "Commencez par ajouter une première étape à votre parcours pédagogique.",
);

// Fetch steps on mount or when pathId changes
const loadSteps = () => {
  if (isExternal.value) return;
  if (props.pathId) {
    stepStore.fetchSteps(props.pathId);
  }
};

onMounted(loadSteps);
watch(() => props.pathId, loadSteps);

const getStepTypeLabel = (type: string) => stepTypeLabel[type] || type;

const handleRowClick = (step: Step) => {
  if (!isExternal.value) return;
  emit('select', step);
};

const editStep = (step: Step) => {
  if (isReadonly.value) return;
  router.push(`/module-formateur/etapes/edit/${step.id}`);
};

const toggleStatus = async (step: Step) => {
  if (isReadonly.value) return;
  const newStatus = !step.isActive;
  // On met à jour localement pour une réactivité immédiate (optimistique)
  step.isActive = newStatus;

  const success = await stepStore.updateStep(step.id, { isActive: newStatus });
  if (!success) {
    // Revenir en arrière si l'API échoue
    step.isActive = !newStatus;
  }
};

const confirmDelete = async (step: Step) => {
  if (isReadonly.value) return;
  stepToDelete.value = step;
};

const deleteStepConfirmed = async () => {
  if (!stepToDelete.value) return;
  const success = await stepStore.deleteStep(stepToDelete.value.id);
  if (success && props.pathId) {
    stepStore.fetchSteps(props.pathId);
  }
  stepToDelete.value = null;
};
</script>

<style scoped>
.sl-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
  overflow: hidden;
}

/* Header */
.sl-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #F3F4F6;
}
.sl-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0; }
.sl-sub { font-size: 12px; color: #9CA3AF; margin: 2px 0 0; }
.sl-badge {
  padding: 3px 10px;
  background: rgba(22,163,74,0.1);
  color: #16A34A;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid rgba(22,163,74,0.2);
  white-space: nowrap;
}

/* Loading */
.sl-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;
}
.sl-spinner {
  width: 28px; height: 28px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: sl-spin 0.7s linear infinite;
}
@keyframes sl-spin { to { transform: rotate(360deg); } }
.sl-state-text { font-size: 13px; color: #9CA3AF; }

/* Empty */
.sl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 32px;
  gap: 8px;
  text-align: center;
}
.sl-empty-ico { width: 40px; height: 40px; color: #D1D5DB; }
.sl-empty-title { font-size: 14px; font-weight: 600; color: #374151; margin: 0; }
.sl-empty-desc { font-size: 13px; color: #9CA3AF; margin: 0; max-width: 300px; }

/* Table */
.sl-table-wrap { overflow-x: auto; }
.sl-tbl { width: 100%; border-collapse: collapse; }
.sl-tbl th {
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #F9FAFB;
  border-bottom: 1px solid #F3F4F6;
  white-space: nowrap;
}
.sl-th-right { text-align: right; }
.sl-tbl td {
  padding: 13px 16px;
  border-bottom: 1px solid #F9FAFB;
  vertical-align: middle;
}
.sl-tbl tbody tr:last-child td { border-bottom: none; }

.sl-row { transition: background 0.12s; }
.sl-row:hover td { background: #FAFAFA; }
.sl-row--inactive { opacity: 0.65; }
.sl-row--clickable { cursor: pointer; }

/* Order badge */
.sl-order {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px; height: 28px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}
.sl-order--active { background: #F3F4F6; color: #374151; }
.sl-order--off { background: #F9FAFB; color: #9CA3AF; }
.sl-row:hover .sl-order--active { background: rgba(22,163,74,0.12); color: #15803D; }

/* Item */
.sl-item-title { display: block; font-size: 13px; font-weight: 600; color: #111827; }
.sl-item-desc { display: block; font-size: 12px; color: #9CA3AF; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }

/* Type pill */
.sl-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid;
  white-space: nowrap;
}
.sl-pill--lesson { background: rgba(22,163,74,0.08); color: #15803D; border-color: rgba(22,163,74,0.2); }
.sl-pill--quiz { background: #FEF9C3; color: #92400E; border-color: #FDE68A; }
.sl-pill--exercise { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }

/* Toggle */
.sl-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.sl-toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
.sl-toggle-track {
  position: relative;
  width: 36px; height: 20px;
  background: #E5E7EB;
  border-radius: 10px;
  transition: background 0.2s;
  flex-shrink: 0;
}
.sl-toggle-track::after {
  content: '';
  position: absolute;
  width: 14px; height: 14px;
  background: white;
  border-radius: 50%;
  top: 3px; left: 3px;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.sl-toggle-input:checked + .sl-toggle-track { background: #16A34A; }
.sl-toggle-input:checked + .sl-toggle-track::after { transform: translateX(16px); }
.sl-toggle-text { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: #9CA3AF; }
.sl-toggle-input:checked ~ .sl-toggle-text { color: #16A34A; }

/* Duration */
.sl-duration { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 500; color: #6B7280; }
.sl-clock-ico { width: 14px; height: 14px; color: #9CA3AF; flex-shrink: 0; }

/* Row actions */
.sl-row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}
.sl-row:hover .sl-row-actions { opacity: 1; }

.sl-act {
  width: 30px; height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  color: #9CA3AF;
}
.sl-act-ico { width: 15px; height: 15px; }
.sl-act--edit:hover { background: rgba(22,163,74,0.08); color: #16A34A; }
.sl-act--del:hover { background: rgba(220,38,38,0.08); color: #DC2626; }

/* Delete modal */
.sl-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.sl-modal {
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
.sl-del-header { display: flex; align-items: center; gap: 12px; }
.sl-del-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(220,38,38,0.08);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: #DC2626;
}
.sl-del-icon-svg { width: 18px; height: 18px; }
.sl-del-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0; }
.sl-del-sub { font-size: 12px; color: #9CA3AF; margin: 2px 0 0; }
.sl-del-msg { font-size: 13px; color: #6B7280; margin: 0; line-height: 1.5; }
.sl-del-name { font-weight: 600; color: #111827; }
.sl-del-actions { display: flex; justify-content: flex-end; gap: 10px; }
.sl-btn-cancel {
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
.sl-btn-cancel:hover { background: #F9FAFB; }
.sl-btn-danger {
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
.sl-btn-danger:hover { background: #B91C1C; }
</style>
