<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSubscriptionStore } from '~/stores/subscriptionStore'
import type { SubscriptionPlan, CreatePlanPayload } from '~/types/settings'

const subscriptionStore = useSubscriptionStore()

const isLoading      = ref(false)
const editingPlan    = ref<SubscriptionPlan | null>(null)
const showEditModal  = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const planToDelete   = ref<SubscriptionPlan | null>(null)

const newPlan = ref<CreatePlanPayload>({
  planCode: '', planName: '', description: '',
  priceMonthly: 0, priceYearly: 0, currency: 'XOF',
  features: [], maxSubAccounts: 0, isActive: true,
})

onMounted(() => subscriptionStore.fetchPlans())

const plans = computed(() => subscriptionStore.plans)

const togglePlan    = (plan: SubscriptionPlan) => subscriptionStore.togglePlan(plan.id)
const openEditModal = (plan: SubscriptionPlan) => { editingPlan.value = { ...plan }; showEditModal.value = true }
const openDeleteModal = (plan: SubscriptionPlan) => { planToDelete.value = plan; showDeleteModal.value = true }
const openCreateModal = () => {
  newPlan.value = { planCode: '', planName: '', description: '', priceMonthly: 0, priceYearly: 0, currency: 'XOF', features: [], maxSubAccounts: 0, isActive: true }
  showCreateModal.value = true
}

const savePlan = async () => {
  if (!editingPlan.value) return
  isLoading.value = true
  try {
    await subscriptionStore.updatePlan(editingPlan.value.id, {
      planCode: editingPlan.value.planCode, planName: editingPlan.value.planName,
      description: editingPlan.value.description, priceMonthly: editingPlan.value.priceMonthly,
      priceYearly: editingPlan.value.priceYearly, currency: editingPlan.value.currency,
      features: editingPlan.value.features, maxSubAccounts: editingPlan.value.maxSubAccounts,
      isActive: editingPlan.value.isActive,
    })
    showEditModal.value = false; editingPlan.value = null
  } finally { isLoading.value = false }
}

const createPlan = async () => {
  isLoading.value = true
  try { await subscriptionStore.createPlan(newPlan.value); showCreateModal.value = false }
  finally { isLoading.value = false }
}

const deletePlan = async () => {
  if (!planToDelete.value) return
  isLoading.value = true
  try { await subscriptionStore.deletePlan(planToDelete.value.id); showDeleteModal.value = false; planToDelete.value = null }
  finally { isLoading.value = false }
}

const featureLabels: Record<string, string> = {
  trial: "Période d'essai", maxSubAccounts: 'Sous-comptes max',
  maxUsers: 'Utilisateurs max', storage: 'Stockage',
  support: 'Support', analytics: 'Analytiques', api: 'Accès API',
}

const formatFeatures = (features: any): string[] => {
  if (!features) return []
  let parsed = features
  if (typeof features === 'string') {
    try { parsed = JSON.parse(features) } catch { return [features] }
  }
  if (Array.isArray(parsed)) return parsed.map((f: any) => typeof f === 'string' ? f : f?.name || f?.label || String(f))
  if (typeof parsed === 'object') {
    return Object.entries(parsed).filter(([, v]) => v !== false && v !== null && v !== undefined)
      .map(([k, v]) => v === true ? featureLabels[k] || k : `${featureLabels[k] || k} : ${v}`)
  }
  return [String(parsed)]
}
</script>

<template>
  <div class="s-card">

    <!-- Header -->
    <div class="s-card-header">
      <div class="s-card-icon s-card-icon--purple">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <div class="flex-1">
        <h2 class="s-card-title">Abonnements</h2>
        <p class="s-card-desc">Gérez les plans d'abonnement de la plateforme</p>
      </div>
      <button class="s-btn-add" @click="openCreateModal">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouveau plan
      </button>
    </div>

    <!-- Plans grid -->
    <div class="s-card-body">
      <div class="plans-grid">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="plan-card"
          :class="[
            plan.isActive ? 'plan-card--active' : 'plan-card--inactive',
            plan.planName === 'Premium' && plan.isActive ? 'plan-card--premium' : '',
          ]"
        >
          <!-- Top row: name + status -->
          <div class="plan-top">
            <span class="plan-name">{{ plan.planName }}</span>
            <span class="plan-status" :class="plan.isActive ? 'plan-status--on' : 'plan-status--off'">
              <span class="plan-status-dot"></span>
              {{ plan.isActive ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <!-- Price -->
          <div class="plan-price">
            <span class="plan-price-val" :class="plan.planName === 'Premium' ? 'plan-price-val--purple' : ''">
              {{ plan.priceMonthly === 0 ? 'Gratuit' : `${plan.priceMonthly.toLocaleString()} FCFA` }}
            </span>
            <span v-if="plan.priceMonthly > 0" class="plan-price-unit">/mois</span>
          </div>
          <p v-if="plan.priceYearly > 0" class="plan-price-yearly">{{ plan.priceYearly.toLocaleString() }} FCFA / an</p>

          <!-- Features -->
          <ul class="plan-features">
            <li v-for="(feat, i) in formatFeatures(plan.features)" :key="i" class="plan-feat">
              <svg class="w-3.5 h-3.5 flex-shrink-0" :class="plan.planName === 'Premium' ? 'text-purple-500' : 'text-emerald-500'" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {{ feat }}
            </li>
          </ul>

          <!-- Footer: subscribers + actions -->
          <div class="plan-footer">
            <span class="plan-subs">{{ plan._count?.subscriptions ?? plan.subscribers ?? 0 }} abonné(s)</span>
            <div class="plan-actions">
              <button class="plan-btn plan-btn--edit" @click="openEditModal(plan)">Modifier</button>
              <button class="plan-btn" :class="plan.isActive ? 'plan-btn--deact' : 'plan-btn--act'" @click="togglePlan(plan)" :disabled="isLoading">
                {{ plan.isActive ? 'Désactiver' : 'Activer' }}
              </button>
              <button class="plan-btn plan-btn--del" @click="openDeleteModal(plan)" :disabled="isLoading">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Modal édition ────────────────── -->
  <Teleport to="body">
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-panel">
        <div class="modal-header">
          <h3 class="modal-title">Modifier — {{ editingPlan?.planName }}</h3>
          <button class="modal-close" @click="showEditModal = false">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="editingPlan" class="modal-body">
          <div class="m-grid-2">
            <div class="m-field">
              <label class="m-label">Code du plan</label>
              <input v-model="editingPlan.planCode" type="text" class="m-input" />
            </div>
            <div class="m-field">
              <label class="m-label">Nom du plan</label>
              <input v-model="editingPlan.planName" type="text" class="m-input" />
            </div>
          </div>
          <div class="m-field">
            <label class="m-label">Description</label>
            <textarea v-model="editingPlan.description" rows="2" class="m-input m-textarea" />
          </div>
          <div class="m-grid-2">
            <div class="m-field">
              <label class="m-label">Prix mensuel (FCFA)</label>
              <input v-model.number="editingPlan.priceMonthly" type="number" min="0" class="m-input" />
            </div>
            <div class="m-field">
              <label class="m-label">Prix annuel (FCFA)</label>
              <input v-model.number="editingPlan.priceYearly" type="number" min="0" class="m-input" />
            </div>
          </div>
          <div class="m-grid-2">
            <div class="m-field">
              <label class="m-label">Devise</label>
              <input v-model="editingPlan.currency" type="text" class="m-input" />
            </div>
            <div class="m-field">
              <label class="m-label">Max sous-comptes</label>
              <input v-model.number="editingPlan.maxSubAccounts" type="number" min="0" class="m-input" />
            </div>
          </div>
          <div class="m-toggle-row" :class="{ 'm-toggle-row--on': editingPlan.isActive }">
            <span class="m-toggle-label">Plan actif</span>
            <div class="s-toggle" :class="{ 's-toggle--on': editingPlan.isActive }" @click="editingPlan.isActive = !editingPlan.isActive">
              <div class="s-toggle-thumb"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="m-btn-cancel" @click="showEditModal = false">Annuler</button>
          <button class="m-btn-save" :disabled="isLoading" @click="savePlan">
            {{ isLoading ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal création -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-panel">
        <div class="modal-header">
          <h3 class="modal-title">Nouveau plan</h3>
          <button class="modal-close" @click="showCreateModal = false">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="m-grid-2">
            <div class="m-field">
              <label class="m-label">Code <span class="m-required">*</span></label>
              <input v-model="newPlan.planCode" type="text" class="m-input" />
            </div>
            <div class="m-field">
              <label class="m-label">Nom <span class="m-required">*</span></label>
              <input v-model="newPlan.planName" type="text" class="m-input" />
            </div>
          </div>
          <div class="m-field">
            <label class="m-label">Description</label>
            <textarea v-model="newPlan.description" rows="2" class="m-input m-textarea" />
          </div>
          <div class="m-grid-2">
            <div class="m-field">
              <label class="m-label">Prix mensuel (FCFA)</label>
              <input v-model.number="newPlan.priceMonthly" type="number" min="0" class="m-input" />
            </div>
            <div class="m-field">
              <label class="m-label">Prix annuel (FCFA)</label>
              <input v-model.number="newPlan.priceYearly" type="number" min="0" class="m-input" />
            </div>
          </div>
          <div class="m-grid-2">
            <div class="m-field">
              <label class="m-label">Devise</label>
              <input v-model="newPlan.currency" type="text" class="m-input" />
            </div>
            <div class="m-field">
              <label class="m-label">Max sous-comptes</label>
              <input v-model.number="newPlan.maxSubAccounts" type="number" min="0" class="m-input" />
            </div>
          </div>
          <div class="m-toggle-row" :class="{ 'm-toggle-row--on': newPlan.isActive }">
            <span class="m-toggle-label">Plan actif</span>
            <div class="s-toggle" :class="{ 's-toggle--on': newPlan.isActive }" @click="newPlan.isActive = !newPlan.isActive">
              <div class="s-toggle-thumb"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="m-btn-cancel" @click="showCreateModal = false">Annuler</button>
          <button class="m-btn-save" :disabled="isLoading" @click="createPlan">
            {{ isLoading ? 'Création…' : 'Créer le plan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-panel modal-panel--sm">
        <div class="modal-header">
          <h3 class="modal-title">Supprimer le plan</h3>
        </div>
        <div class="modal-body">
          <p class="m-delete-msg">
            Êtes-vous sûr de vouloir supprimer le plan <strong>{{ planToDelete?.planName }}</strong> ?
            Cette action est irréversible.
          </p>
        </div>
        <div class="modal-footer">
          <button class="m-btn-cancel" @click="showDeleteModal = false">Annuler</button>
          <button class="m-btn-danger" :disabled="isLoading" @click="deletePlan">
            {{ isLoading ? 'Suppression…' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── Card ───────────────────────────── */
.s-card {
  background: #FFFFFF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 1px 2px rgba(0,0,0,0.05),
    0 3px 10px rgba(0,0,0,0.05),
    0 0 0 1px rgba(17,24,39,0.05);
}

.s-card-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #F3F4F6;
}

.s-card-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.s-card-icon--purple { background: rgba(139,92,246,0.10); color: #7C3AED; }

.s-card-title { font-size: 13.5px; font-weight: 600; color: #111827; }
.s-card-desc  { font-size: 12px; color: #9CA3AF; margin-top: 1px; }
.s-card-body  { padding: 24px; }

.s-btn-add {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 14px;
  background: #16A34A; color: white;
  border: none; border-radius: 8px;
  font-size: 12.5px; font-weight: 500;
  cursor: pointer; margin-left: auto;
  box-shadow: 0 1px 3px rgba(22,163,74,0.3);
  transition: all 0.15s;
}
.s-btn-add:hover { background: #15803D; }

/* ── Plans grid ─────────────────────── */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.plan-card {
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  padding: 18px;
  display: flex; flex-direction: column; gap: 14px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.plan-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.plan-card--inactive { opacity: 0.55; background: #FAFAFA; }
.plan-card--active   { background: white; }
.plan-card--premium  { border-color: rgba(124,58,237,0.3); background: linear-gradient(145deg, #fff 0%, #faf5ff 100%); }

/* Plan top */
.plan-top { display: flex; align-items: center; justify-content: space-between; }

.plan-name { font-size: 15px; font-weight: 700; color: #111827; }

.plan-status {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 500;
  padding: 3px 9px; border-radius: 100px;
}

.plan-status--on  { background: #DCFCE7; color: #15803D; }
.plan-status--off { background: #F3F4F6; color: #6B7280; }

.plan-status-dot {
  width: 5px; height: 5px;
  border-radius: 50%; background: currentColor;
}

/* Price */
.plan-price { display: flex; align-items: baseline; gap: 4px; }
.plan-price-val { font-size: 26px; font-weight: 800; color: #111827; letter-spacing: -0.04em; }
.plan-price-val--purple { color: #7C3AED; }
.plan-price-unit { font-size: 12px; color: #9CA3AF; }
.plan-price-yearly { font-size: 12px; color: #9CA3AF; margin-top: -10px; }

/* Features */
.plan-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; flex: 1; }

.plan-feat {
  display: flex; align-items: flex-start; gap: 7px;
  font-size: 12px; color: #374151;
}

/* Footer */
.plan-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
}

.plan-subs { font-size: 11.5px; color: #9CA3AF; }

.plan-actions { display: flex; gap: 5px; }

.plan-btn {
  height: 28px; padding: 0 10px;
  border-radius: 6px; border: none;
  font-size: 11.5px; font-weight: 500;
  cursor: pointer; transition: all 0.12s;
}

.plan-btn--edit  { background: #F3F4F6; color: #374151; }
.plan-btn--edit:hover { background: #E5E7EB; }

.plan-btn--act   { background: #DCFCE7; color: #15803D; border: 1px solid rgba(22,163,74,0.2); }
.plan-btn--act:hover { background: #BBF7D0; }

.plan-btn--deact { background: #FEE2E2; color: #DC2626; border: 1px solid rgba(220,38,38,0.2); }
.plan-btn--deact:hover { background: #FECACA; }

.plan-btn--del {
  width: 28px; padding: 0;
  display: flex; align-items: center; justify-content: center;
  background: #F3F4F6; color: #9CA3AF;
}
.plan-btn--del:hover { background: #FEE2E2; color: #DC2626; }
.plan-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Toggle ─────────────────────────── */
.s-toggle {
  width: 34px; height: 20px;
  border-radius: 100px; background: #E5E7EB;
  position: relative; flex-shrink: 0;
  transition: background 0.18s; cursor: pointer;
}
.s-toggle--on { background: #16A34A; }
.s-toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 14px; height: 14px; border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.18);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.s-toggle--on .s-toggle-thumb { transform: translateX(14px); }

/* ── Modal ──────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}

.modal-panel {
  background: white;
  border-radius: 16px;
  width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(17,24,39,0.06);
}

.modal-panel--sm { max-width: 420px; }

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px 16px;
  border-bottom: 1px solid #F3F4F6;
}

.modal-title { font-size: 15px; font-weight: 600; color: #111827; }

.modal-close {
  width: 28px; height: 28px;
  border-radius: 7px; border: none; background: none;
  color: #9CA3AF; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.12s;
}
.modal-close:hover { background: #F3F4F6; color: #374151; }

.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }

.modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 8px;
  padding: 14px 24px 18px;
  border-top: 1px solid #F3F4F6;
}

/* Modal form */
.m-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.m-field   { display: flex; flex-direction: column; gap: 5px; }
.m-label   { font-size: 12.5px; font-weight: 500; color: #374151; }
.m-required { color: #EF4444; }

.m-input {
  height: 38px; padding: 0 12px;
  font-size: 13px; color: #111827;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  border-radius: 8px; outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
}
.m-input:focus { background: white; border-color: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,0.10); }
.m-textarea { height: auto; padding: 10px 12px; resize: vertical; }

.m-toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; border-radius: 9px;
  border: 1px solid #F3F4F6; background: #FAFAFA;
  transition: all 0.12s;
}
.m-toggle-row--on { background: #F0FDF4; border-color: rgba(22,163,74,0.18); }
.m-toggle-label { font-size: 13px; font-weight: 500; color: #374151; }

.m-delete-msg { font-size: 13.5px; color: #374151; line-height: 1.6; }
.m-delete-msg strong { color: #111827; }

.m-btn-cancel {
  height: 34px; padding: 0 14px;
  font-size: 13px; font-weight: 500; color: #6B7280;
  background: none; border: none; border-radius: 7px;
  cursor: pointer; transition: background 0.12s;
}
.m-btn-cancel:hover { background: #F3F4F6; }

.m-btn-save {
  height: 34px; padding: 0 18px;
  font-size: 13px; font-weight: 500; color: white;
  background: #16A34A; border: none; border-radius: 7px;
  cursor: pointer; box-shadow: 0 1px 3px rgba(22,163,74,0.3);
  transition: all 0.15s;
}
.m-btn-save:hover { background: #15803D; }
.m-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.m-btn-danger {
  height: 34px; padding: 0 18px;
  font-size: 13px; font-weight: 500; color: white;
  background: #DC2626; border: none; border-radius: 7px;
  cursor: pointer; transition: all 0.15s;
}
.m-btn-danger:hover { background: #B91C1C; }
.m-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
</style>

