<template>
  <div class="space-y-6">
    <!-- Modal création -->
    <CreateNewUser v-if="openModal" @close="openModal = false" @create="addUser"/>

    <!-- Chargement -->
    <div v-if="userStore.isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="mt-4 text-slate-500 font-medium text-sm">Chargement des utilisateurs...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="userStore.error" class="error-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 flex-shrink-0" viewBox="0 0 256 256">
        <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/>
      </svg>
      <div>
        <p class="font-bold">Une erreur est survenue</p>
        <p class="text-sm opacity-80">{{ userStore.error }}</p>
        <button @click="userStore.fetchUsers()" class="retry-btn mt-2">Réessayer</button>
      </div>
    </div>

    <!-- Tableau -->
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

    <!-- Modal détails -->
    <CreateUserDetails
      v-if="selectedUser"
      :user="selectedUser"
      @close="selectedUser = null"
    />

    <!-- Modal Édition -->
    <Teleport to="body">
      <div v-if="editingUser" class="modal-overlay" @click.self="editingUser = null">
        <div class="modal-box">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Modifier l'utilisateur</h2>
              <p class="modal-subtitle">{{ editingUser.profile.firstName }} {{ editingUser.profile.lastName }}</p>
            </div>
            <button class="modal-close" @click="editingUser = null">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <div class="field-grid">
              <div class="field">
                <label class="field-label">Prénom</label>
                <input v-model="editingUser.profile.firstName" type="text" class="field-input" placeholder="Prénom"/>
              </div>
              <div class="field">
                <label class="field-label">Nom</label>
                <input v-model="editingUser.profile.lastName" type="text" class="field-input" placeholder="Nom"/>
              </div>
              <div class="field field-full">
                <label class="field-label">Adresse email</label>
                <input v-model="editingUser.email" type="email" class="field-input" placeholder="email@exemple.com"/>
              </div>
              <div class="field">
                <label class="field-label">Nom d'utilisateur</label>
                <input v-model="editingUser.username" type="text" class="field-input" placeholder="@username"/>
              </div>
              <div class="field">
                <label class="field-label">Nouveau mot de passe</label>
                <input v-model="editingUser.password" type="password" class="field-input" placeholder="Laisser vide pour ne pas modifier"/>
              </div>
              <div class="field">
                <label class="field-label">Rôle</label>
                <div class="field-select-wrap">
                  <select v-model="editingUser.accountType" class="field-select">
                    <option value="learner">Apprenant</option>
                    <option value="sub_account_learner">Sous-compte apprenant</option>
                    <option value="teacher">Formateur</option>
                    <option value="plateform_manager">Gestionnaire</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  <div class="select-chevron">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="field">
                <label class="field-label">Statut</label>
                <button
                  @click="toggleStatusInPopup"
                  :class="['status-toggle', editingUser.isActive ? 'status-toggle-active' : 'status-toggle-inactive']"
                >
                  <span class="status-dot"></span>
                  {{ editingUser.isActive ? 'Actif' : 'Inactif' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button @click="editingUser = null" class="btn-cancel">Annuler</button>
            <button @click="saveEdit" class="btn-save">Enregistrer</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Suppression -->
    <Teleport to="body">
      <div v-if="userToDelete" class="modal-overlay" @click.self="userToDelete = null">
        <div class="modal-box modal-box-sm">
          <div class="flex items-center gap-4 mb-5">
            <div class="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Supprimer l'utilisateur</h3>
              <p class="text-sm text-slate-500 mt-0.5">Cette action est irréversible</p>
            </div>
          </div>
          <p class="text-sm text-slate-600 mb-6">
            Vous êtes sur le point de supprimer
            <span class="font-semibold text-slate-900">{{ userToDelete.profile.firstName }} {{ userToDelete.profile.lastName }}</span>.
            Toutes ses données seront définitivement supprimées.
          </p>
          <div class="flex justify-end gap-3">
            <button class="btn-cancel" @click="userToDelete = null">Annuler</button>
            <button class="btn-delete" @click="confirmDeleteUser">Supprimer</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <transition name="toast-fade">
      <div
        v-if="toast.show"
        class="toast"
        :class="toast.type === 'success' ? 'toast-success' : 'toast-error'"
      >
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toast.message }}
      </div>
    </transition>
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
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

onMounted(async () => {
  await userStore.fetchUsers()
})

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
      parentId: null
    }
    await userStore.createUser(userData)
    showToast(`L'utilisateur ${userData.firstName} ${userData.lastName} a été créé avec succès.`)
    openModal.value = false
    await userStore.fetchUsers()
  } catch (err) {
    console.error('Error creating user:', err)
    showToast('Erreur lors de la création de l\'utilisateur.', 'error')
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
    showToast(`L'utilisateur ${user.profile.firstName} ${user.profile.lastName} a été supprimé avec succès.`)
  } catch (err) {
    console.error('Delete user error:', err)
    showToast('Erreur lors de la suppression de l\'utilisateur.', 'error')
  } finally {
    userToDelete.value = null
  }
}

const showUserDetails = (user: User) => {
  selectedUser.value = user
}

const verifyUser = async (user: User) => {
  try {
    const { email, accountType, profile, username, phone, isActive } = user
    const payload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email,
      username,
      phone,
      accountType,
      isActive,
      isVerified: true,
      profile: { ...profile }
    }
    await userStore.putUser(user.id, payload)
    user.isVerified = true
    showToast(`L'utilisateur ${profile.firstName} ${profile.lastName} a été vérifié.`)
  } catch (err) {
    console.error(err)
    showToast('Erreur lors de la vérification de l\'utilisateur.', 'error')
  }
}

const toggleUserStatus = async (user: User) => {
  try {
    const newStatus = !user.isActive
    const { email, accountType, profile, username, phone } = user
    const payload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email,
      username,
      phone,
      accountType,
      isActive: newStatus,
      profile: { ...profile, firstName: profile.firstName, lastName: profile.lastName }
    }
    await userStore.putUser(user.id, payload)
    user.isActive = newStatus
    showToast(`Le statut de ${profile.firstName} ${profile.lastName} a été ${newStatus ? 'activé' : 'désactivé'}.`)
  } catch (err) {
    console.error(err)
    showToast('Erreur lors de la mise à jour du statut.', 'error')
  }
}

const editUser = (user: User) => {
  editingUser.value = JSON.parse(JSON.stringify(user))
}

const toggleStatusInPopup = () => {
  if (!editingUser.value) return
  editingUser.value.isActive = !editingUser.value.isActive
}

const saveEdit = async () => {
  if (!editingUser.value) return
  const { id, accountType, isActive, email, profile, username, phone } = editingUser.value
  const payload: any = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email,
    username,
    phone,
    accountType,
    isActive,
    profile: { ...profile, firstName: profile.firstName, lastName: profile.lastName }
  }
  if (editingUser.value.password) {
    payload.password = editingUser.value.password
  }
  try {
    await userStore.putUser(id, payload)
    showToast(`L'utilisateur ${profile.firstName} ${profile.lastName} a été modifié avec succès.`)
    editingUser.value = null
  } catch (err) {
    console.error('Put user error:', err)
    showToast('Erreur lors de la modification de l\'utilisateur.', 'error')
  }
}
</script>

<style scoped>
/* ─── Spinner ──────────────────────────────── */
.spinner-ring {
  position: absolute;
  inset: 0;
  border: 4px solid transparent;
  border-top-color: #000099;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Error ────────────────────────────────── */
.error-state {
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  color: #dc2626;
}
.retry-btn {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  background: white;
  border: 1.5px solid #fca5a5;
  color: #dc2626;
  cursor: pointer;
  transition: background 0.15s;
}
.retry-btn:hover { background: #fee2e2; }

/* ─── Modal Overlay ────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

/* ─── Modal Box ────────────────────────────── */
.modal-box {
  background: white;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}
.modal-box-sm {
  max-width: 420px;
  padding: 1.5rem;
}

/* ─── Modal Header ─────────────────────────── */
.modal-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbff;
}
.modal-icon-wrap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(0, 0, 153, 0.08);
  color: #000099;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.modal-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
}
.modal-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 0.125rem;
}
.modal-close {
  margin-left: auto;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: #94a3b8;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.modal-close:hover { background: #f1f5f9; color: #475569; }

/* ─── Modal Body ───────────────────────────── */
.modal-body { padding: 1.5rem; }
.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.field-full { grid-column: 1 / -1; }
.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;
}
.field-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.field-input:focus {
  border-color: #00ced1;
  box-shadow: 0 0 0 3px rgba(0, 206, 209, 0.12);
  background: white;
}
.field-select-wrap { position: relative; }
.field-select {
  width: 100%;
  padding: 0.625rem 2.25rem 0.625rem 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.field-select:focus {
  border-color: #00ced1;
  box-shadow: 0 0 0 3px rgba(0, 206, 209, 0.12);
  background: white;
}
.select-chevron {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #94a3b8;
}

/* ─── Status Toggle ────────────────────────── */
.status-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}
.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-toggle-active {
  background: rgba(0, 206, 209, 0.1);
  color: #000099;
  border-color: rgba(0, 206, 209, 0.3);
}
.status-toggle-active .status-dot { background: #00ced1; }
.status-toggle-inactive {
  background: #f1f5f9;
  color: #64748b;
  border-color: #e2e8f0;
}
.status-toggle-inactive .status-dot { background: #94a3b8; }

/* ─── Modal Footer ─────────────────────────── */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  background: #fafbff;
}

/* ─── Buttons ──────────────────────────────── */
.btn-cancel {
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  background: white;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; color: #475569; }
.btn-save {
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  background: #000099;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-save:hover { background: #0000bb; }
.btn-delete {
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  background: #dc2626;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-delete:hover { background: #b91c1c; }

/* ─── Toast ────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.875rem;
  padding: 0.75rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 360px;
}
.toast-success { background: #000099; color: white; }
.toast-error { background: #dc2626; color: white; }

/* ─── Transitions ──────────────────────────── */
.toast-fade-enter-active,
.toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from,
.toast-fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>
