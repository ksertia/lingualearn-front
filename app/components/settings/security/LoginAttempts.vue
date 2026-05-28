<script setup lang="ts">
import { ref } from 'vue'

const config = ref({
  maxAttempts: 5,
  lockoutDuration: 15,
  enableLockout: true,
})

const isLoading = ref(false)
const isSaving = ref(false)

const loadConfig = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 400))
  isLoading.value = false
}

const saveConfig = async () => {
  isSaving.value = true
  await new Promise(resolve => setTimeout(resolve, 900))
  isSaving.value = false
}

loadConfig()
</script>

<template>
  <div class="s-card">

    <div class="s-card-header">
      <div class="s-card-icon s-card-icon--red">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </div>
      <div>
        <h2 class="s-card-title">Limitation des tentatives de connexion</h2>
        <p class="s-card-desc">Protégez les comptes contre les attaques par force brute</p>
      </div>
    </div>

    <div class="s-card-body">

      <div v-if="isLoading" class="s-loader">
        <div class="s-spinner"></div>
      </div>

      <form v-else @submit.prevent="saveConfig" class="s-form">

        <!-- Verrouillage toggle -->
        <div class="s-toggle-row" :class="{ 's-toggle-row--on': config.enableLockout }">
          <div class="s-toggle-row-text">
            <span class="s-toggle-row-label">Verrouillage automatique</span>
            <span class="s-toggle-row-desc">Verrouiller le compte après plusieurs tentatives ratées</span>
          </div>
          <div
            class="s-toggle"
            :class="{ 's-toggle--on': config.enableLockout }"
            @click="config.enableLockout = !config.enableLockout"
          >
            <div class="s-toggle-thumb"></div>
          </div>
        </div>

        <div class="s-grid-2" :class="{ 's-grid--disabled': !config.enableLockout }">
          <div class="s-field">
            <label class="s-label">Tentatives maximales</label>
            <input
              v-model.number="config.maxAttempts"
              type="number" min="1" max="20"
              :disabled="!config.enableLockout"
              class="s-input"
            />
            <p class="s-field-hint">Nombre avant verrouillage</p>
          </div>
          <div class="s-field">
            <label class="s-label">Durée du verrouillage <span class="s-label-hint">(min)</span></label>
            <input
              v-model.number="config.lockoutDuration"
              type="number" min="1" max="1440"
              :disabled="!config.enableLockout"
              class="s-input"
            />
            <p class="s-field-hint">Avant déverrouillage automatique</p>
          </div>
        </div>

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
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #F3F4F6;
}

.s-card-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.s-card-icon--red { background: rgba(239,68,68,0.10); color: #DC2626; }

.s-card-title { font-size: 13.5px; font-weight: 600; color: #111827; line-height: 1.3; }
.s-card-desc  { font-size: 12px; color: #9CA3AF; margin-top: 1px; }

.s-card-body  { padding: 24px; }

.s-loader { display: flex; justify-content: center; padding: 40px 0; }

.s-spinner {
  width: 24px; height: 24px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.s-form { display: flex; flex-direction: column; gap: 20px; }

/* Toggle row */
.s-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #F3F4F6;
  background: #FAFAFA;
  transition: background 0.12s, border-color 0.12s;
}

.s-toggle-row--on {
  background: #F0FDF4;
  border-color: rgba(22,163,74,0.18);
}

.s-toggle-row-text { flex: 1; }

.s-toggle-row-label { display: block; font-size: 13px; font-weight: 500; color: #111827; }
.s-toggle-row-desc  { display: block; font-size: 11.5px; color: #9CA3AF; margin-top: 2px; }

/* Grid */
.s-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.s-grid--disabled { opacity: 0.45; pointer-events: none; }

.s-field { display: flex; flex-direction: column; gap: 5px; }

.s-label { font-size: 12.5px; font-weight: 500; color: #374151; }
.s-label-hint { font-size: 11px; color: #9CA3AF; font-weight: 400; }

.s-field-hint { font-size: 11px; color: #9CA3AF; margin-top: 1px; }

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

/* Toggle */
.s-toggle {
  width: 34px; height: 20px;
  border-radius: 100px;
  background: #E5E7EB;
  position: relative; flex-shrink: 0;
  transition: background 0.18s;
  cursor: pointer;
}

.s-toggle--on { background: #16A34A; }

.s-toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.18);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.s-toggle--on .s-toggle-thumb { transform: translateX(14px); }

.s-actions { display: flex; justify-content: flex-end; }

.s-btn-save {
  display: inline-flex; align-items: center; gap: 7px;
  height: 36px; padding: 0 18px;
  background: #16A34A; color: white;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(22,163,74,0.3);
  transition: all 0.15s;
}

.s-btn-save:hover { background: #15803D; box-shadow: 0 3px 8px rgba(22,163,74,0.35); }
.s-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
</style>

