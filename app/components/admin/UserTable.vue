<template>
  <div class="user-table-card">

    <!-- ── Top bar ───────────────────────── -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <!-- Search -->
        <div class="search-wrap">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher un utilisateur…"
            class="search-input"
          />
        </div>

        <!-- Role filter -->
        <div class="select-wrap">
          <select v-model="selectedRole" class="filter-select">
            <option value="">Tous les rôles</option>
            <option v-for="(label, key) in rolesMap" :key="key" :value="key">{{ label }}</option>
          </select>
          <svg class="select-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <!-- Status filter -->
        <div class="select-wrap">
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="verified">Vérifié</option>
            <option value="unverified">Non vérifié</option>
            <option value="premium">Premium</option>
          </select>
          <svg class="select-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Create user button -->
      <button class="btn-primary" @click="$emit('create')">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Nouvel utilisateur
      </button>
    </div>

    <!-- ── Table ─────────────────────────── -->
    <div class="table-wrap">

      <!-- Header row -->
      <div class="table-head">
        <span class="th">Utilisateur</span>
        <span class="th">Email</span>
        <span class="th">Statut</span>
        <span class="th">Rôle</span>
        <span class="th th--right">Actions</span>
      </div>

      <!-- Data rows -->
      <div class="table-body">
        <div
          v-for="user in paginatedUsers"
          :key="user.id"
          class="table-row"
          :class="{ 'table-row--inactive': !user.isActive }"
        >
          <!-- User cell -->
          <div class="cell-user">
            <div class="user-avatar" :class="{ 'user-avatar--inactive': !user.isActive }">
              {{ user.profile.firstName[0] }}{{ user.profile.lastName[0] }}
            </div>
            <div class="user-name-wrap">
              <span class="user-fullname">{{ user.profile.firstName }} {{ user.profile.lastName }}</span>
              <span v-if="user.username" class="user-handle">@{{ user.username }}</span>
            </div>
          </div>

          <!-- Email cell -->
          <div class="cell-email" :title="user.email">
            {{ user.email || '—' }}
          </div>

          <!-- Status cell -->
          <div class="cell-status">
            <span class="status-pill" :class="user.isVerified ? 'status-pill--green' : 'status-pill--amber'">
              <span class="status-dot"></span>
              {{ user.isVerified ? 'Vérifié' : 'En attente' }}
            </span>
            <span class="status-pill mt-1" :class="user.isActive ? 'status-pill--emerald' : 'status-pill--gray'">
              <span class="status-dot"></span>
              {{ user.isActive ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <!-- Role cell -->
          <div class="cell-role">
            <span class="role-tag" :class="roleTagClass(user.accountType)">
              {{ accountTypeLabel[user.accountType] || user.accountType }}
            </span>
          </div>

          <!-- Actions cell -->
          <div class="cell-actions">
            <button
              class="action-trigger"
              :class="{ 'action-trigger--open': openMenuId === user.id }"
              @click.stop="toggleMenu(user.id)"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <Transition name="menu">
              <div v-if="openMenuId === user.id" class="action-menu">
                <button
                  v-if="!user.isVerified"
                  class="action-item action-item--green"
                  @click="[$emit('verify', user), openMenuId = null]"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Vérifier
                </button>
                <button
                  class="action-item"
                  @click="[$emit('show-details', user), openMenuId = null]"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir détails
                </button>
                <button
                  class="action-item action-item--blue"
                  @click="[$emit('edit', user), openMenuId = null]"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
                <div class="action-sep"></div>
                <button
                  class="action-item"
                  :class="user.isActive ? 'action-item--red' : 'action-item--green'"
                  @click="[handleToggle(user), openMenuId = null]"
                >
                  <svg v-if="user.isActive" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ user.isActive ? 'Désactiver' : 'Activer' }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="paginatedUsers.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg class="w-6 h-6" style="color:#D1D5DB;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="empty-title">Aucun utilisateur trouvé</p>
        <p class="empty-sub">Ajustez vos filtres de recherche</p>
      </div>
    </div>

    <!-- ── Pagination ─────────────────────── -->
    <div class="table-footer">
      <span class="footer-count">
        <strong>{{ filteredUsers.length }}</strong> utilisateur{{ filteredUsers.length !== 1 ? 's' : '' }}
      </span>

      <div class="pagination">
        <button
          class="page-btn page-btn--nav"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <template v-for="page in visiblePages" :key="page">
          <span v-if="page === '…'" class="page-ellipsis">…</span>
          <button
            v-else
            class="page-btn"
            :class="{ 'page-btn--active': page === currentPage }"
            @click="currentPage = (page as number)"
          >{{ page }}</button>
        </template>

        <button
          class="page-btn page-btn--nav"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { User } from '~/types/auth'
import { accountTypeLabel } from '~/utils/labels'

const props = defineProps<{
  users: User[]
  initialRole?: string
  initialStatus?: string
}>()

const emit = defineEmits(['create', 'edit', 'delete', 'show-details', 'toggle-status', 'verify'])

const search = ref('')
const selectedRole = ref(props.initialRole || '')
const selectedStatus = ref(props.initialStatus || '')
const currentPage = ref(1)
const itemsPerPage = 8
const openMenuId = ref<string | null>(null)

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const handleClickOutside = () => { openMenuId.value = null }
const handleKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') openMenuId.value = null }
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleKeydown)
})

const rolesMap: Record<string, string> = {
  learner: 'Apprenant',
  sub_account_learner: 'Sous-compte',
  teacher: 'Formateur',
  plateform_manager: 'Gestionnaire',
  admin: 'Administrateur',
}

const filteredUsers = computed(() => {
  return props.users.filter(user => {
    const s = search.value.toLowerCase()
    const matchSearch =
      user.profile.firstName.toLowerCase().includes(s) ||
      user.profile.lastName.toLowerCase().includes(s) ||
      (user.email || '').toLowerCase().includes(s)

    const matchRole = selectedRole.value ? user.accountType === selectedRole.value : true
    const matchStatus = !selectedStatus.value ||
      (selectedStatus.value === 'active' && user.isActive) ||
      (selectedStatus.value === 'inactive' && !user.isActive) ||
      (selectedStatus.value === 'verified' && user.isVerified) ||
      (selectedStatus.value === 'unverified' && !user.isVerified) ||
      (selectedStatus.value === 'premium' && (user as any).withSubscription)

    return matchSearch && matchRole && matchStatus
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage)))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed<(number | '…')[]>(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (cur <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (cur >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', cur - 1, cur, cur + 1, '…', total]
})

const roleTagClass = (role: string) => {
  const map: Record<string, string> = {
    admin: 'role-admin',
    plateform_manager: 'role-manager',
    teacher: 'role-teacher',
    learner: 'role-learner',
    sub_account_learner: 'role-sub',
  }
  return map[role] || ''
}

const handleToggle = (user: User) => emit('toggle-status', user)

watch([search, selectedRole, selectedStatus], () => { currentPage.value = 1 })
</script>

<style scoped>
/* ── Card wrapper ────────────────────────── */
.user-table-card {
  background: #FFFFFF;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 1px 2px rgba(0,0,0,0.05),
    0 3px 10px rgba(0,0,0,0.05),
    0 0 0 1px rgba(17,24,39,0.05);
}

/* ── Toolbar ─────────────────────────────── */
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #F3F4F6;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

/* Search */
.search-wrap {
  position: relative;
  width: 260px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: #9CA3AF;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 7px 12px 7px 32px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  color: #111827;
  outline: none;
  transition: all 0.15s;
}

.search-input:focus {
  background: white;
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
}

.search-input::placeholder { color: #9CA3AF; }

/* Selects */
.select-wrap {
  position: relative;
}

.filter-select {
  appearance: none;
  padding: 7px 28px 7px 10px;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: all 0.15s;
}

.filter-select:focus {
  background: white;
  border-color: #16A34A;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
}

.select-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #9CA3AF;
  pointer-events: none;
}

/* Primary button */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  background: #16A34A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(22,163,74,.25);
  transition: all 0.15s;
}

.btn-primary:hover {
  background: #15803D;
  box-shadow: 0 3px 8px rgba(22,163,74,.3);
}

/* ── Table ───────────────────────────────── */
.table-wrap { overflow-x: auto; }

.table-head {
  display: grid;
  grid-template-columns: 2fr 2.5fr 1.5fr 1.5fr 80px;
  padding: 10px 20px;
  background: #FAFAFA;
  border-bottom: 1px solid #F3F4F6;
}

.th {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.th--right { text-align: right; }

.table-body { min-width: 700px; }

.table-row {
  display: grid;
  grid-template-columns: 2fr 2.5fr 1.5fr 1.5fr 80px;
  align-items: center;
  padding: 13px 20px;
  border-bottom: 1px solid #F9FAFB;
  transition: background 0.1s;
}

.table-row:last-child { border-bottom: none; }

.table-row:hover { background: #FAFAFA; }

.table-row--inactive { opacity: 0.6; }
.table-row--inactive:hover { opacity: 1; }

/* User cell */
.cell-user {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #16A34A, #065F46);
  color: white;
  font-size: 11.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0;
}

.user-avatar--inactive {
  background: linear-gradient(135deg, #9CA3AF, #6B7280);
}

.user-name-wrap { min-width: 0; }

.user-fullname {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-handle {
  font-size: 11.5px;
  color: #9CA3AF;
  display: block;
  margin-top: 1px;
}

/* Email cell */
.cell-email {
  font-size: 13px;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
}

/* Status cell */
.cell-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-pill--green  { background: #DCFCE7; color: #15803D; }
.status-pill--green .status-dot  { background: #16A34A; }
.status-pill--amber  { background: #FEF3C7; color: #B45309; }
.status-pill--amber .status-dot  { background: #D97706; }
.status-pill--emerald   { background: #D1FAE5; color: #065F46; }
.status-pill--emerald .status-dot { background: #10B981; }
.status-pill--gray   { background: #F3F4F6; color: #6B7280; }
.status-pill--gray .status-dot   { background: #9CA3AF; }

/* Role cell */
.cell-role { display: flex; align-items: center; }

.role-tag {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 6px;
}

.role-admin    { background: #DCFCE7; color: #15803D; }
.role-manager  { background: #E0F2FE; color: #0369A1; }
.role-teacher  { background: #FEF3C7; color: #92400E; }
.role-learner  { background: #F3F4F6; color: #374151; }
.role-sub      { background: #EDE9FE; color: #6D28D9; }

/* Actions cell */
.cell-actions {
  display: flex;
  justify-content: flex-end;
  position: relative;
}

.action-trigger {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: none;
  background: none;
  color: #9CA3AF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
}

.action-trigger:hover,
.action-trigger--open {
  background: #F3F4F6;
  color: #374151;
}

.action-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 9px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  padding: 4px;
  min-width: 160px;
  z-index: 50;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background 0.1s;
}

.action-item:hover          { background: #F9FAFB; }
.action-item--green         { color: #15803D; }
.action-item--green:hover   { background: #F0FDF4; }
.action-item--blue          { color: #1D4ED8; }
.action-item--blue:hover    { background: #EFF6FF; }
.action-item--red           { color: #DC2626; }
.action-item--red:hover     { background: #FEF2F2; }

.action-sep {
  height: 1px;
  background: #F3F4F6;
  margin: 3px 0;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  gap: 6px;
}

.empty-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.empty-title {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.empty-sub {
  font-size: 12.5px;
  color: #9CA3AF;
}

/* ── Footer / Pagination ─────────────────── */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-top: 1px solid #F3F4F6;
  flex-wrap: wrap;
}

.footer-count {
  font-size: 12.5px;
  color: #6B7280;
}

.footer-count strong {
  color: #111827;
  font-weight: 600;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid #E5E7EB;
  background: white;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  transition: all 0.1s;
}

.page-btn:hover:not(:disabled) {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.page-btn--active {
  background: #16A34A !important;
  border-color: #16A34A !important;
  color: white !important;
}

.page-btn--nav {
  color: #6B7280;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-ellipsis {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  color: #9CA3AF;
  user-select: none;
}

/* Menu transition */
.menu-enter-active, .menu-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.menu-enter-from, .menu-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>

