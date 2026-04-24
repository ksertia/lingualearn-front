import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'
import type { Notification, NotificationsListResponse, CreateNotificationPayload } from '~/types/notification'

export const useNotificationStore = defineStore('notification', () => {
  const apiService = useApiService()

  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const isSending = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({ page: 1, limit: 20, total: 0 })
  const selectedUserId = ref<string | null>(null)

  async function fetchUserNotifications(userId: string, page = 1, limit = 20) {
    isLoading.value = true
    error.value = null
    selectedUserId.value = userId
    try {
      const response = await apiService.getUserNotifications(userId, { page, limit })
      if (response.success && response.data) {
        notifications.value = response.data.notifications ?? []
        unreadCount.value = response.data.unreadCount ?? 0
        if (response.data.pagination) pagination.value = response.data.pagination
      } else {
        error.value = 'Erreur lors de la récupération des notifications'
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Erreur de récupération'
    } finally {
      isLoading.value = false
    }
  }

  async function createNotification(payload: CreateNotificationPayload) {
    isSending.value = true
    error.value = null
    try {
      const response = await apiService.createNotification(payload)
      if (response.success) {
        if (selectedUserId.value === payload.userId) {
          await fetchUserNotifications(payload.userId, pagination.value.page)
        }
        return { success: true }
      }
      return { success: false, message: "Erreur lors de l'envoi" }
    } catch (err: any) {
      const message = err?.data?.message || err?.message || "Erreur lors de l'envoi"
      error.value = message
      return { success: false, message }
    } finally {
      isSending.value = false
    }
  }

  async function markAsRead(id: string) {
    try {
      await apiService.markNotificationRead(id)
      const n = notifications.value.find(n => n.id === id)
      if (n && !n.isRead) {
        n.isRead = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function markAllAsRead(userId: string) {
    try {
      await apiService.markAllNotificationsRead(userId)
      notifications.value.forEach(n => { n.isRead = true })
      unreadCount.value = 0
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteNotification(id: string) {
    try {
      await apiService.deleteNotification(id)
      notifications.value = notifications.value.filter(n => n.id !== id)
      pagination.value.total = Math.max(0, pagination.value.total - 1)
    } catch (err: any) {
      throw new Error(err?.data?.message || err?.message || 'Erreur de suppression')
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    isSending,
    error,
    pagination,
    selectedUserId,
    fetchUserNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
})
