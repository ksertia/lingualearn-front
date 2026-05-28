<script setup lang="ts">
import { ref } from 'vue'

const policy = ref({
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  expiryDays: 90,
})

const isLoading = ref(false)
const isSaving = ref(false)

const loadPolicy = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  isLoading.value = false
}

const savePolicy = async () => {
  isSaving.value = true
  await new Promise(resolve => setTimeout(resolve, 900))
  isSaving.value = false
}

loadPolicy()

const rules = [
  { key: 'requireUppercase',    label: 'Majuscules obligatoires',         hint: 'Au moins une lettre majuscule (A–Z)' },
  { key: 'requireLowercase',    label: 'Minuscules obligatoires',         hint: 'Au moins une lettre minuscule (a–z)' },
  { key: 'requireNumbers',      label: 'Chiffres obligatoires',           hint: 'Au moins un chiffre (0–9)' },
  { key: 'requireSpecialChars', label: 'Caractères spéciaux obligatoires', hint: 'Au moins un symbole (!@#$…)' },
] as const
</script>

<template>
  <div class="s-card">
    <!-- Card header -->
    <div class="s-card-header">
      <div class="s-card-icon s-card-icon--amber">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div>
        <h2 class="s-card-title">Politique de mot de passe</h2>
        <p class="s-card-desc">Définissez les règles de sécurité pour les mots de passe</p>
      </div>
    </div>

    <!-- Body -->
    <div class="s-card-body">

      <div v-if="isLoading" class="s-loader">
        <div class="s-spinner"></div>
      </div>

      <form v-else @submit.prevent="savePolicy" class="s-form">

        <!-- Longueur + expiration -->
        <div class="s-grid-2">
          <div class="s-field">
            <label class="s-label">Longueur minimale</label>
            <input v-model.number="policy.minLength" type="number" min="6" max="32" class="s-input" />
          </div>
          <div class="s-field">
            <label class="s-label">Expiration <span class="s-label-hint">(jours, 0 = jamais)</span></label>
            <input v-model.number="policy.expiryDays" type="number" min="0" max="365" class="s-input" />
          </div>
        </div>

        <!-- Divider -->
        <div class="s-divider"></div>

        <!-- Règles -->
        <p class="s-section-label">Règles de composition</p>
        <div class="s-rules-grid">
          <label
            v-for="rule in rules"
            :key="rule.key"
            class="s-rule"
            :class="{ 's-rule--on': policy[rule.key] }"
          >
            <div class="s-rule-text">
              <span class="s-rule-label">{{ rule.label }}</span>
              <span class="s-rule-hint">{{ rule.hint }}</span>
            </div>
            <!-- Toggle -->
            <div class="s-toggle" :class="{ 's-toggle--on': policy[rule.key] }">
              <input v-model="(policy as any)[rule.key]" type="checkbox" class="sr-only" />
              <div class="s-toggle-thumb"></div>
            </div>
          </label>
        </div>

        <!-- Actions -->
        <div class="s-actions">
          <button type="submit" class="s-btn-save" :disabled="isSaving">
            <svg v-if="isSaving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ isSaving ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>
/* ── Card shell ─────────────────────── */
.s-card {
  background: linear-gradient(145deg, #ffffff 0%, #f9fafb 100%);
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 1px 2px rgba(0,0,0,0.05),
    0 3px 10px rgba(0,0,0,0.05),
    0 0 0 1px rgba(17,24,39,0.05);
}

.s-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #F3F4F6;
}

.s-card-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.s-card-icon--amber { background: rgba(245,158,11,0.10); color: #D97706; }
.s-card-icon--red   { background: rgba(239,68,68,0.10);  color: #DC2626; }
.s-card-icon--blue  { background: rgba(59,130,246,0.10); color: #2563EB; }
.s-card-icon--green { background: rgba(22,163,74,0.10);  color: #16A34A; }

.s-card-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.s-card-desc {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 1px;
}

.s-card-body {
  padding: 24px;
}

/* ── Loader ─────────────────────────── */
.s-loader {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.s-spinner {
  width: 24px;
  height: 24px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Form ───────────────────────────── */
.s-form { display: flex; flex-direction: column; gap: 20px; }

.s-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.s-field { display: flex; flex-direction: column; gap: 6px; }

.s-label {
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
}

.s-label-hint {
  font-size: 11px;
  color: #9CA3AF;
  font-weight: 400;
}

.s-input {
  height: 38px;
  padding: 0 12px;
  font-size: 13px;
  color: #111827;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
}

.s-input:focus {
  background: white;
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
}

.s-divider { height: 1px; background: #F3F4F6; }

.s-section-label {
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9CA3AF;
}

/* ── Rules grid ─────────────────────── */
.s-rules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.s-rule {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 9px;
  border: 1px solid #F3F4F6;
  background: #FAFAFA;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}

.s-rule:hover { background: #F5F5F5; }

.s-rule--on {
  background: #F0FDF4;
  border-color: rgba(22,163,74,0.18);
}

.s-rule-text { flex: 1; min-width: 0; }

.s-rule-label {
  display: block;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  line-height: 1.3;
}

.s-rule-hint {
  display: block;
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 1px;
}

/* ── Toggle ─────────────────────────── */
.s-toggle {
  width: 34px;
  height: 20px;
  border-radius: 100px;
  background: #E5E7EB;
  position: relative;
  flex-shrink: 0;
  transition: background 0.18s;
  cursor: pointer;
}

.s-toggle--on { background: #16A34A; }

.s-toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.18);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.s-toggle--on .s-toggle-thumb { transform: translateX(14px); }

/* ── Actions ────────────────────────── */
.s-actions { display: flex; justify-content: flex-end; }

.s-btn-save {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 18px;
  background: #16A34A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(22,163,74,0.3);
  transition: all 0.15s;
}

.s-btn-save:hover { background: #15803D; box-shadow: 0 3px 8px rgba(22,163,74,0.35); }
.s-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
