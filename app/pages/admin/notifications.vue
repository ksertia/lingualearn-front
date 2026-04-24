<script setup lang="ts">
import NotificationForm from '~/components/admin/notifications/NotificationForm.vue'
import NotificationsTable from '~/components/admin/notifications/NotificationsTable.vue'

definePageMeta({ layout: 'admin' })

const toast = ref({ show: false, message: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const onNotificationSent = (title: string) => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message: `Notification « ${title} » envoyée avec succès` }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-4">
        <div class="w-1 h-10 rounded-full" style="background: linear-gradient(to bottom, #000099, #00CED1); flex-shrink:0"></div>
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p class="text-slate-500 mt-1">Envoyez et gérez les notifications utilisateurs</p>
        </div>
      </div>
    </header>

    <!-- Form -->
    <NotificationForm @sent="onNotificationSent" />

    <!-- Table -->
    <NotificationsTable />

    <!-- Toast -->
    <transition name="toast-fade">
      <div v-if="toast.show" class="page-toast">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.page-toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.125rem;
  border-radius: 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: #000099;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 153, 0.25);
  max-width: 400px;
}

.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>
