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
  <div class="page-root">

    <!-- Page header -->
    <div class="page-hero">
      <div>
        <h1 class="page-heading">Notifications</h1>
        <p class="page-sub">Envoyez et gérez les notifications de la plateforme</p>
      </div>
    </div>

    <!-- Form -->
    <NotificationForm @sent="onNotificationSent" />

    <!-- Table -->
    <NotificationsTable />

    <!-- Toast -->
    <Transition name="toast-fade">
      <div v-if="toast.show" class="toast">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.page-root { padding: 32px; }

.page-hero {
  margin-bottom: 28px;
}

.page-heading {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.03em;
}

.page-sub {
  font-size: 13px;
  color: #9CA3AF;
  margin-top: 3px;
}

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
  background: #16A34A;
  color: white;
  box-shadow: 0 8px 24px rgba(22,163,74,.25);
  max-width: 400px;
}

.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
