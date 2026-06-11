<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAppSettingsStore } from '~/stores/appSettingsStore'
import { useApiService } from '~/services/api'
import type { User } from '~/types/auth'

const emit = defineEmits<{
  (e: 'message', type: 'success' | 'error', text: string): void
}>()

const settingsStore = useAppSettingsStore()
const apiService = useApiService()

const localValues = ref<Record<string, string>>({})
const isSaving = ref<Record<string, boolean>>({})

// Trial — recherche serveur par nom
const trialQuery = ref('')
const trialUserId = ref('')
const trialSelectedName = ref('')
const trialExpiresAt = ref('')
const isSavingTrial = ref(false)
const showDropdown = ref(false)
const searchResults = ref<User[]>([])
const isSearching = ref(false)
let searchDebounce: ReturnType<typeof setTimeout> | undefined = undefined
let isSelectingUser = false

async function performSearch(q: string) {
  isSearching.value = true
  try {
    const res = await apiService.getFilterUsers({ search: q, limit: 8 })
    searchResults.value = (res.success && res.data) ? (res.data.users ?? []) : []
  } catch {
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

watch(trialQuery, (newVal) => {
  if (isSelectingUser) { isSelectingUser = false; return }
  trialUserId.value = ''
  trialSelectedName.value = ''
  searchResults.value = []
  clearTimeout(searchDebounce)
  const q = newVal.trim()
  if (q.length < 2) {
    showDropdown.value = false
    return
  }
  showDropdown.value = true
  searchDebounce = setTimeout(() => performSearch(q), 300)
})

function selectUser(user: User) {
  isSelectingUser = true
  trialUserId.value = user.id
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username
  trialSelectedName.value = name
  trialQuery.value = name
  showDropdown.value = false
}

function closeDropdown() {
  showDropdown.value = false
  if (!trialUserId.value) {
    trialQuery.value = ''
  }
}

function getSettingValue(key: string): string {
  return localValues.value[key] ?? ''
}

function setSettingValue(key: string, val: string): void {
  localValues.value[key] = val
}

function formatLabel(key: string): string {
  return key
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

async function saveSetting(key: string) {
  isSaving.value[key] = true
  try {
    await settingsStore.updateSetting(key, getSettingValue(key))
    emit('message', 'success', 'Paramètre mis à jour')
  } catch {
    emit('message', 'error', 'Erreur lors de la mise à jour')
  } finally {
    isSaving.value[key] = false
  }
}

async function applyTrial() {
  if (!trialUserId.value) return
  isSavingTrial.value = true
  try {
    await settingsStore.updateUserTrial(
      trialUserId.value,
      new Date(trialExpiresAt.value).toISOString(),
    )
    emit('message', 'success', 'Trial mis à jour')
    trialQuery.value = ''
    trialUserId.value = ''
    trialSelectedName.value = ''
    trialExpiresAt.value = ''
  } catch {
    emit('message', 'error', 'Erreur lors de la mise à jour du trial')
  } finally {
    isSavingTrial.value = false
  }
}

function handleOutsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.s-user-search')) closeDropdown()
}

onMounted(async () => {
  await settingsStore.fetchSettings()
  localValues.value = { ...settingsStore.settings }
  document.addEventListener('mousedown', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})
</script>

<template>
  <div class="space-y-6">

    <!-- ── Bloc A : Paramètres globaux ── -->
    <div class="s-card">
      <div class="s-card-header">
        <div class="s-card-icon s-card-icon--green">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 class="s-card-title">Paramètres globaux</h2>
          <p class="s-card-desc">Configuration générale de la plateforme</p>
        </div>
      </div>

      <div class="s-card-body">
        <div v-if="settingsStore.isLoading" class="s-loader">
          <div class="s-spinner"></div>
        </div>

        <div v-else-if="settingsStore.error" class="s-error">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ settingsStore.error }}
        </div>

        <div v-else class="s-form">
          <div
            v-for="[key] in Object.entries(settingsStore.settings)"
            :key="key"
            class="s-setting-row"
          >
            <div class="s-field">
              <label class="s-label">
                {{ key === 'trial_duration_days' ? 'Durée du trial (jours)' : formatLabel(key) }}
              </label>
              <input
                v-if="key === 'trial_duration_days'"
                :value="getSettingValue(key)"
                type="number"
                min="1"
                max="365"
                class="s-input"
                @input="setSettingValue(key, ($event.target as HTMLInputElement).value)"
              />
              <input
                v-else
                :value="getSettingValue(key)"
                type="text"
                class="s-input"
                @input="setSettingValue(key, ($event.target as HTMLInputElement).value)"
              />
            </div>
            <button
              class="s-btn-save s-btn-save--row"
              :disabled="isSaving[key]"
              @click="saveSetting(key)"
            >
              <svg v-if="isSaving[key]" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ isSaving[key] ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>

          <p v-if="Object.keys(settingsStore.settings).length === 0" class="s-empty">
            Aucun paramètre disponible.
          </p>
        </div>
      </div>
    </div>

    <!-- ── Bloc B : Ajustement manuel du trial ── -->
    <div class="s-card">
      <div class="s-card-header">
        <div class="s-card-icon s-card-icon--amber">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 class="s-card-title">Ajustement manuel du trial</h2>
          <p class="s-card-desc">Modifier la date d'expiration du trial d'un apprenant</p>
        </div>
      </div>

      <div class="s-card-body">
        <form class="s-form" @submit.prevent="applyTrial">
          <div class="s-grid-2">

            <!-- Recherche apprenant par nom -->
            <div class="s-field">
              <label class="s-label">Apprenant</label>
              <div class="s-user-search">
                <div class="s-input-wrap" :class="{ 's-input-wrap--selected': !!trialUserId }">
                  <svg class="s-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                  <input
                    v-model="trialQuery"
                    type="text"
                    placeholder="Rechercher par nom ou email…"
                    class="s-search-input"
                    autocomplete="off"
                    @focus="showDropdown = trialQuery.length >= 2"
                  />
                  <svg v-if="trialUserId" class="s-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div v-if="showDropdown && trialQuery.trim().length >= 2" class="s-dropdown">
                  <div v-if="isSearching" class="s-dropdown-loader">
                    <div class="s-spinner-sm"></div>
                  </div>
                  <template v-else-if="searchResults.length > 0">
                    <button
                      v-for="user in searchResults"
                      :key="user.id"
                      type="button"
                      class="s-dropdown-item"
                      @mousedown.prevent="selectUser(user)"
                    >
                      <div class="s-avatar">{{ (user.firstName ?? user.username ?? '?').charAt(0).toUpperCase() }}</div>
                      <div class="s-user-info">
                        <span class="s-user-name">{{ user.firstName ?? '' }} {{ user.lastName ?? '' }}</span>
                        <span class="s-user-email">{{ user.email ?? user.username }}</span>
                      </div>
                    </button>
                  </template>
                  <div v-else class="s-dropdown-empty-msg">
                    Aucun utilisateur trouvé
                  </div>
                </div>
              </div>
            </div>

            <!-- Date d'expiration -->
            <div class="s-field">
              <label class="s-label">Nouvelle date d'expiration</label>
              <input
                v-model="trialExpiresAt"
                type="datetime-local"
                class="s-input"
                required
              />
            </div>
          </div>

          <div class="s-actions">
            <button type="submit" class="s-btn-save" :disabled="isSavingTrial || !trialUserId">
              <svg v-if="isSavingTrial" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ isSavingTrial ? 'Application…' : 'Appliquer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Card shell ─────────────────────── */
.s-card {
  background: #FFFFFF;
  border-radius: 14px;
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

.s-card-icon--green { background: rgba(22,163,74,0.10);  color: #16A34A; }
.s-card-icon--amber { background: rgba(245,158,11,0.10); color: #D97706; }

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

.s-card-body { padding: 24px; }

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

/* ── Error ──────────────────────────── */
.s-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #FEF2F2;
  border: 1px solid rgba(239,68,68,0.18);
  border-radius: 9px;
  font-size: 13px;
  color: #DC2626;
}

/* ── Form ───────────────────────────── */
.s-form { display: flex; flex-direction: column; gap: 16px; }

.s-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.s-field { display: flex; flex-direction: column; gap: 6px; }

.s-label {
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
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

/* ── Setting row ────────────────────── */
.s-setting-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.s-setting-row .s-field { flex: 1; }

/* ── Empty state ────────────────────── */
.s-empty {
  font-size: 13px;
  color: #9CA3AF;
  text-align: center;
  padding: 24px 0;
}

/* ── User search ────────────────────── */
.s-user-search { position: relative; }

.s-input-wrap {
  display: flex;
  align-items: center;
  height: 38px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0 10px;
  gap: 8px;
  transition: border-color 0.12s, box-shadow 0.12s;
}

.s-input-wrap:focus-within {
  background: white;
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
}

.s-input-wrap--selected {
  border-color: rgba(22,163,74,0.4);
  background: #F0FDF4;
}

.s-input-wrap--selected:focus-within {
  border-color: #16A34A;
  background: white;
}

.s-search-icon {
  width: 14px;
  height: 14px;
  color: #9CA3AF;
  flex-shrink: 0;
}

.s-check-icon {
  width: 14px;
  height: 14px;
  color: #16A34A;
  flex-shrink: 0;
}

.s-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #111827;
  outline: none;
  min-width: 0;
}

.s-search-input::placeholder { color: #9CA3AF; }

/* ── Dropdown ───────────────────────── */
.s-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
  z-index: 50;
  overflow: hidden;
}

.s-dropdown-loader {
  display: flex;
  justify-content: center;
  padding: 14px 0;
}

.s-spinner-sm {
  width: 18px;
  height: 18px;
  border: 2px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.s-dropdown-empty-msg {
  padding: 12px 16px;
  font-size: 13px;
  color: #9CA3AF;
  text-align: center;
}

.s-dropdown--empty {
  padding: 12px 16px;
  font-size: 13px;
  color: #9CA3AF;
  text-align: center;
}

.s-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}

.s-dropdown-item:hover { background: #F9FAFB; }

.s-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(22,163,74,0.12);
  color: #16A34A;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-transform: uppercase;
}

.s-user-info { display: flex; flex-direction: column; min-width: 0; }

.s-user-name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.3;
}

.s-user-email {
  font-size: 11.5px;
  color: #9CA3AF;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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
  white-space: nowrap;
  flex-shrink: 0;
}

.s-btn-save:hover { background: #15803D; box-shadow: 0 3px 8px rgba(22,163,74,0.35); }
.s-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
