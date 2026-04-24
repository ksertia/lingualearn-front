export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  notificationType: NotificationType
  actionUrl?: string
  isRead: boolean
  createdAt: string
  updatedAt?: string
  user?: {
    id: string
    email: string
    profile: {
      firstName: string
      lastName: string
    }
  }
}

export interface NotificationsListResponse {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
  }
  unreadCount: number
}

export interface CreateNotificationPayload {
  userId: string
  title: string
  message: string
  notificationType?: NotificationType
  actionUrl?: string
}
