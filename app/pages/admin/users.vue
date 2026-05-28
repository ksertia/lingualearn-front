<template>
  <div class="page-root">
    <!-- Modal création -->
    <CreateNewUser v-if="openModal" @close="openModal = false" @create="addUser" />

    <!-- Loading -->
    <div v-if="userStore.isLoading" class="state-loading">
      <div class="spinner"></div>
      <p class="state-text">Chargement des utilisateurs…</p>
    </div>

    <!-- Error -->
    <div v-else-if="userStore.error" class="state-error">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <p class="font-semibold text-sm">Une erreur est survenue</p>
        <p class="text-xs mt-0.5 opacity-80">{{ userStore.error }}</p>
        <button class="retry-btn" @click="userStore.fetchUsers()">Réessayer</button>
      </div>
    </div>

    <!-- Table -->
    <UserTable
      v-else
      :users="userStore.users"
      :initial-role="route.query.role as string"
      :initial-status="route.query.status as string"
      @create="openModal = true"
      @delete="deleteUser"
      @show-details="showUserDetails"
      @toggle-status="toggleUserStatus"
      @verify="verifyUser"
      @edit="editUser"
    />

    <!-- Details modal -->
    <CreateUserDetails
      v-if="selectedUser"
      :user="selectedUser"
      @close="selectedUser = null"
    />

    <!-- Edit modal -->
    <Teleport to="body">
      <div v-if="editingUser" class="modal-overlay" @click.self="editingUser = null">
        <div class="modal-box">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-icon">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Modifier l'utilisateur</h2>
              <p class="modal-sub">{{ editingUser.profile.firstName }} {{ editingUser.profile.lastName }}</p>
            </div>
            <button class="modal-close" @click="editingUser = null">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <div class="field-grid">
              <div class="field">
                <label class="field-label">Prénom</label>
                <input v-model="editingUser.profile.firstName" type="text" class="field-input" placeholder="Prénom" />
              </div>
              <div class="field">
                <label class="field-label">Nom</label>
                <input v-model="editingUser.profile.lastName" type="text" class="field-input" placeholder="Nom" />
              </div>
              <div class="field field-full">
                <label class="field-label">Adresse email</label>
                <input v-model="editingUser.email" type="email" class="field-input" placeholder="email@exemple.com" />
              </div>
              <div class="field">
                <label class="field-label">Nom d'utilisateur</label>
                <input v-model="editingUser.username" type="text" class="field-input" placeholder="@username" />
              </div>
              <div class="field">
                <label class="field-label">Nouveau mot de passe</label>
                <input v-model="editingUser.password" type="password" class="field-input" placeholder="Laisser vide pour ne pas modifier" />
              </div>
              <div class="field">
                <label class="field-label">Rôle</label>
                <div class="select-wrap">
                  <select v-model="editingUser.accountType" class="field-select">
                    <option value="learner">Apprenant</option>
                    <option value="sub_account_learner">Sous-compte apprenant</option>
                    <option value="teacher">Formateur</option>
                    <option value="plateform_manager">Gestionnaire</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  <svg class="select-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div class="field">
                <label class="field-label">Statut du compte</label>
                <button
                  class="status-toggle"
                  :class="editingUser.isActive ? 'status-toggle--active' : 'status-toggle--inactive'"
                  @click="toggleStatusInPopup"
                >
                  <span class="status-dot"></span>
                  {{ editingUser.isActive ? 'Actif' : 'Inactif' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn-cancel" @click="editingUser = null">Annuler</button>
            <button class="btn-save" @click="saveEdit">Enregistrer</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete modal -->
    <Teleport to="body">
      <div v-if="userToDelete" class="modal-overlay" @click.self="userToDelete = null">
        <div class="modal-box modal-box--sm">
          <div class="del-header">
            <div class="del-icon">
              <svg class="del-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="del-title">Supprimer l'utilisateur</h3>
              <p class="del-sub">Cette action est irréversible</p>
            </div>
          </div>
          <p class="del-msg">
            Vous êtes sur le point de supprimer
            <strong class="del-name">{{ userToDelete.profile.firstName }} {{ userToDelete.profile.lastName }}</strong>.
            Toutes ses données seront définitivement supprimées.
          </p>
          <div class="del-actions">
            <button class="btn-cancel" @click="userToDelete = null">Annuler</button>
            <button class="btn-delete" @click="confirmDeleteUser">Supprimer</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Transition name="toast-fade">
      <div
        v-if="toast.show"
        class="toast"
        :class="toast.type === 'success' ? 'toast--success' : 'toast--error'"
      >
        <svg v-if="toast.type === 'success'" class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/userStore'
import type { User } from '~/types/user'

import UserTable from '~/components/admin/UserTable.vue'
import CreateNewUser from '~/components/admin/CreateNewUser.vue'
import CreateUserDetails from '~/components/admin/CreateUserDetails.vue'

definePageMeta({ layout: 'admin' })

const userStore = useUserStore()
const route = useRoute()
const openModal = ref(false)
const selectedUser = ref<User | null>(null)
const editingUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

onMounted(async () => { await userStore.fetchUsers() })

const addUser = async (newUser: any) => {
  try {
    const userData = {
      firstName: newUser.prenom ?? '',
      lastName: newUser.nom ?? '',
      email: newUser.email ?? '',
      phone: newUser.phone ?? '',
      password: newUser.password ?? '',
      username: newUser.username ?? null,
      accountType: newUser.role ?? 'learner',
      parentId: null,
    }
    await userStore.createUser(userData)
    showToast(`L'utilisateur ${userData.firstName} ${userData.lastName} a été créé avec succès.`)
    openModal.value = false
    await userStore.fetchUsers()
  } catch {
    showToast("Erreur lors de la création de l'utilisateur.", 'error')
  }
}

const deleteUser = async (user: User) => {
  if (!user?.id) return
  userToDelete.value = user
}

const confirmDeleteUser = async () => {
  if (!userToDelete.value) return
  try {
    const user = userToDelete.value
    await userStore.deleteUser(user.id)
    userStore.users = userStore.users.filter(u => u.id !== user.id)
    showToast(`L'utilisateur ${user.profile.firstName} ${user.profile.lastName} a été supprimé.`)
  } catch {
    showToast("Erreur lors de la suppression.", 'error')
  } finally {
    userToDelete.value = null
  }
}

const showUserDetails = (user: User) => { selectedUser.value = user }

const verifyUser = async (user: User) => {
  try {
    const { email, accountType, profile, username, phone, isActive } = user
    const payload = { firstName: profile.firstName, lastName: profile.lastName, email, username, phone, accountType, isActive, isVerified: true, profile: { ...profile } }
    await userStore.putUser(user.id, payload)
    user.isVerified = true
    showToast(`${profile.firstName} ${profile.lastName} a été vérifié.`)
  } catch {
    showToast('Erreur lors de la vérification.', 'error')
  }
}

const toggleUserStatus = async (user: User) => {
  try {
    const newStatus = !user.isActive
    const { email, accountType, profile, username, phone } = user
    const payload = { firstName: profile.firstName, lastName: profile.lastName, email, username, phone, accountType, isActive: newStatus, profile: { ...profile } }
    await userStore.putUser(user.id, payload)
    user.isActive = newStatus
    showToast(`Statut de ${profile.firstName} ${profile.lastName} mis à jour.`)
  } catch {
    showToast('Erreur lors de la mise à jour.', 'error')
  }
}

const editUser = (user: User) => { editingUser.value = JSON.parse(JSON.stringify(user)) }

const toggleStatusInPopup = () => {
  if (editingUser.value) editingUser.value.isActive = !editingUser.value.isActive
}

const saveEdit = async () => {
  if (!editingUser.value) return
  const { id, accountType, isActive, email, profile, username, phone } = editingUser.value
  const payload: any = { firstName: profile.firstName, lastName: profile.lastName, email, username, phone, accountType, isActive, profile: { ...profile } }
  if (editingUser.value.password) payload.password = editingUser.value.password
  try {
    await userStore.putUser(id, payload)
    showToast(`${profile.firstName} ${profile.lastName} a été modifié.`)
    editingUser.value = null
  } catch {
    showToast('Erreur lors de la modification.', 'error')
  }
}
</script>

<style scoped>
.page-root { padding: 32px; }

/* Loading / Error states */
.state-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 12px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #E5E7EB;
  border-top-color: #16A34A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.state-text { font-size: 13px; color: #9CA3AF; }

.state-error {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 10px;
  color: #DC2626;
  margin-bottom: 20px;
}

.retry-btn {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: white;
  border: 1px solid #FECACA;
  color: #DC2626;
  cursor: pointer;
  transition: background 0.15s;
}

.retry-btn:hover { background: #FEE2E2; }

/* ── Modal ───────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

.modal-box {
  background: white;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08);
  overflow: hidden;
}

.modal-box--sm { max-width: 400px; padding: 24px; }

/* Delete modal content */
.del-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.del-icon { width: 40px; height: 40px; border-radius: 10px; background: #FEF2F2; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.del-icon-svg { width: 20px; height: 20px; color: #EF4444; }
.del-title { font-size: 14px; font-weight: 600; color: #111827; }
.del-sub { font-size: 12px; color: #9CA3AF; margin-top: 2px; }
.del-msg { font-size: 13px; color: #6B7280; line-height: 1.6; margin-bottom: 24px; }
.del-name { font-weight: 600; color: #111827; }
.del-actions { display: flex; justify-content: flex-end; gap: 8px; }

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid #F3F4F6;
}

.modal-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(22,163,74,0.08);
  color: #16A34A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title {
  font-size: 14.5px;
  font-weight: 600;
  color: #111827;
}

.modal-sub {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 2px;
}

.modal-close {
  margin-left: auto;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  border: none;
  background: none;
  color: #9CA3AF;
  cursor: pointer;
  transition: all 0.13s;
}

.modal-close:hover { background: #F3F4F6; color: #374151; }

.modal-body { padding: 20px; }

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field-full { grid-column: 1 / -1; }

.field-label {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 5px;
  letter-spacing: 0.01em;
}

.field-input {
  width: 100%;
  padding: 8px 10px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #111827;
  outline: none;
  transition: all 0.15s;
  box-sizing: border-box;
}

.field-input:focus {
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  background: white;
}

.select-wrap { position: relative; }

.field-select {
  width: 100%;
  padding: 8px 28px 8px 10px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #111827;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.15s;
}

.field-select:focus {
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  background: white;
}

.select-chevron {
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #9CA3AF;
  pointer-events: none;
}

.status-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-toggle--active {
  background: rgba(22,163,74,0.08);
  color: #15803D;
  border-color: rgba(22,163,74,0.2);
}

.status-toggle--active .status-dot { background: #16A34A; }

.status-toggle--inactive {
  background: #F3F4F6;
  color: #6B7280;
  border-color: #E5E7EB;
}

.status-toggle--inactive .status-dot { background: #9CA3AF; }

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid #F3F4F6;
}

/* Buttons */
.btn-cancel {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  background: white;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.13s;
}

.btn-cancel:hover { background: #F9FAFB; border-color: #D1D5DB; }

.btn-save {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: #16A34A;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(22,163,74,.3);
  transition: background 0.13s;
}

.btn-save:hover { background: #15803D; }

.btn-delete {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: #DC2626;
  border: none;
  cursor: pointer;
  transition: background 0.13s;
}

.btn-delete:hover { background: #B91C1C; }

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14);
  max-width: 360px;
}

.toast--success { background: #16A34A; color: white; }
.toast--error   { background: #DC2626; color: white; }

.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
