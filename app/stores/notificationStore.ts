import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiService } from '~/services/api'
import type { Notification, CreateNotificationPayload } from '~/types/notification'

// Defensive extractors — handle every envelope the API might return
function extractNotifications(res: any): Notification[] {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.notifications)) return res.notifications
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.notifications)) return res.data.notifications
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  return []
}

function extractUnreadCount(res: any): number {
  return (
    res?.unreadCount ??
    res?.data?.unreadCount ??
    res?.data?.unread_count ??
    res?.unread_count ??
    0
  )
}

function extractPagination(res: any) {
  return res?.pagination ?? res?.data?.pagination ?? null
}

export const useNotificationStore = defineStore('notification', () => {
  const apiService = useApiService()

  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const isSending = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({ page: 1, limit: 20, total: 0 })
  const selectedUserId = ref<string | null>(null)

  // Full fetch — called when opening the panel or after sending a notification
  async function fetchUserNotifications(userId: string, page = 1, limit = 20) {
    isLoading.value = true
    error.value = null
    selectedUserId.value = userId
    try {
      const response = await apiService.getUserNotifications(userId, { page, limit }) as any
      const notifs = extractNotifications(response)
      const count  = extractUnreadCount(response)
      const pag    = extractPagination(response)
      notifications.value = notifs
      unreadCount.value   = count
      if (pag) pagination.value = pag
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Erreur de récupération'
    } finally {
      isLoading.value = false
    }
  }

  // Background poll — only raises unreadCount, never lowers it
  // so the badge does not disappear while the panel is closed
  async function pollForNew(userId: string) {
    try {
      const response = await apiService.getUserNotifications(userId, { page: 1, limit: 20 }) as any
      const count  = extractUnreadCount(response)
      const notifs = extractNotifications(response)
      if (count > unreadCount.value) {
        unreadCount.value = count
        notifications.value = notifs
      }
    } catch {}
  }

  async function createNotification(payload: CreateNotificationPayload) {
    isSending.value = true
    error.value = null
    try {
      const response = await apiService.createNotification(payload) as any
      const ok = response?.success === true || response?.id || response?.data?.id
      if (ok) {
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
      const n = notifications.value.find(n => n.id === id)
      if (n && !n.isRead) unreadCount.value = Math.max(0, unreadCount.value - 1)
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
    pollForNew,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
})
