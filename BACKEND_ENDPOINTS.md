# 📋 Backend Endpoints pour Section Paramètres LMS

## Vue d'ensemble des catégories

La section Paramètres LMS est organisée en **6 catégories principales** avec **11 pages** :

1. **PLATEFORME** - Paramètres généraux
2. **BUSINESS** - Plans, accès, blocage, monétisation
3. **COMMUNICATION** - Notifications, support
4. **APPRENTISSAGE** - Qualité pédagogique, contenu gratuit
5. **SÉCURITÉ** - Sécurité & prévention, légal
6. **SUIVI** - Statistics & Analytics

---

## 1️⃣ PARAMÈTRES GÉNÉRAUX (Platform General Settings)

**Route Frontend**: `/admin/settings/general`

### Endpoints à implémenter:

#### GET - Récupérer les paramètres généraux

```
GET /api/admin/settings/general
GET /api/admin/platform/config

Response:
{
  "id": "general-settings-1",
  "applicationName": "LinguaLearn",
  "logoUrl": "https://...",
  "defaultLanguage": "fr",
  "defaultCurrency": "EUR",
  "timezone": "Europe/Paris",
  "maintenanceMode": false,
  "registrationsEnabled": true,
  "paymentsEnabled": true,
  "freeSignupAllowed": true,
  "updatedAt": "2026-01-28T10:00:00Z",
  "updatedBy": "admin-id"
}
```

#### POST/PUT - Mettre à jour les paramètres généraux

```
PUT /api/admin/settings/general
POST /api/admin/platform/config/update

Request Body:
{
  "applicationName": "string",
  "logoUrl": "string (url)",
  "defaultLanguage": "string (en|fr|es|de|it)",
  "defaultCurrency": "string (EUR|USD|GBP|CHF)",
  "timezone": "string (Europe/Paris|...)",
  "maintenanceMode": boolean,
  "registrationsEnabled": boolean,
  "paymentsEnabled": boolean,
  "freeSignupAllowed": boolean
}

Response: { success: true, data: {...} }
```

---

## 2️⃣ PLANS D'ABONNEMENT (Subscription Plans)

**Route Frontend**: `/admin/settings/subscriptions`

### Endpoints à implémenter:

#### GET - Récupérer tous les plans

```
GET /api/admin/subscriptions/plans
GET /api/billing/plans

Response:
[
  {
    "id": "plan-free",
    "name": "Gratuit",
    "type": "free",
    "price": 0,
    "currency": "EUR",
    "billingPeriod": null,
    "trialDays": 0,
    "features": [...],
    "gracePeriodDays": 0,
    "autoRenewal": false,
    "maxConcurrentUsers": 1,
    "status": "active",
    "createdAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "plan-premium",
    "name": "Premium",
    "type": "paid",
    "price": 9.99,
    "currency": "EUR",
    "billingPeriod": "monthly",
    "trialDays": 7,
    "features": [...],
    "gracePeriodDays": 7,
    "autoRenewal": true,
    "maxConcurrentUsers": 5,
    "status": "active"
  }
]
```

#### GET - Récupérer un plan spécifique

```
GET /api/admin/subscriptions/plans/:planId
GET /api/billing/plans/:planId
```

#### POST - Créer un nouveau plan

```
POST /api/admin/subscriptions/plans
POST /api/billing/plans/create

Request Body:
{
  "name": "string (max 50)",
  "type": "free|paid|trial",
  "price": number,
  "currency": "EUR|USD|GBP",
  "billingPeriod": "monthly|annual|lifetime|null",
  "trialDays": number,
  "gracePeriodDays": number,
  "autoRenewal": boolean,
  "maxConcurrentUsers": number,
  "features": [
    {
      "name": "string",
      "enabled": boolean
    }
  ],
  "description": "string"
}
```

#### PUT - Mettre à jour un plan

```
PUT /api/admin/subscriptions/plans/:planId
PUT /api/billing/plans/:planId/update

Request Body: { ...same as POST }
```

#### DELETE - Supprimer un plan

```
DELETE /api/admin/subscriptions/plans/:planId
DELETE /api/billing/plans/:planId
```

---

## 3️⃣ CONTRÔLE D'ACCÈS (Access Control)

**Route Frontend**: `/admin/settings/access-control`

### Endpoints à implémenter:

#### GET - Récupérer les règles d'accès par plan

```
GET /api/admin/access-control/plans
GET /api/admin/settings/access-rules

Response:
{
  "plans": [
    {
      "planId": "plan-free",
      "planName": "Gratuit",
      "accessRules": {
        "maxLanguages": 1,
        "maxLevels": 1,
        "exercisesPerDay": 5,
        "offlineAccessEnabled": false,
        "downloadResourcesEnabled": false,
        "maxStorageGb": 0.5,
        "maxConcurrentDownloads": 1
      }
    },
    {
      "planId": "plan-premium",
      "planName": "Premium",
      "accessRules": {
        "maxLanguages": 15,
        "maxLevels": 10,
        "exercisesPerDay": 999,
        "offlineAccessEnabled": true,
        "downloadResourcesEnabled": true,
        "maxStorageGb": 100,
        "maxConcurrentDownloads": 5
      }
    }
  ]
}
```

#### PUT - Mettre à jour les règles d'accès pour un plan

```
PUT /api/admin/access-control/plans/:planId
PUT /api/admin/settings/access-rules/:planId

Request Body:
{
  "maxLanguages": number,
  "maxLevels": number,
  "exercisesPerDay": number,
  "offlineAccessEnabled": boolean,
  "downloadResourcesEnabled": boolean,
  "maxStorageGb": number,
  "maxConcurrentDownloads": number,
  "allowedFeatures": ["vocabulary", "exercises", "listening", ...],
  "restrictedRegions": ["string"]
}
```

#### POST - Appliquer les mêmes règles à plusieurs plans

```
POST /api/admin/access-control/bulk-update

Request Body:
{
  "planIds": ["plan-id-1", "plan-id-2"],
  "accessRules": { ...same as PUT }
}
```

---

## 4️⃣ BLOCAGE & DÉBLOCAGE (Subscription Blocking)

**Route Frontend**: `/admin/settings/blocking`

### Endpoints à implémenter:

#### GET - Récupérer la configuration de blocage

```
GET /api/admin/settings/blocking
GET /api/admin/subscription-blocking/config

Response:
{
  "id": "blocking-config",
  "gracePeriodDays": 7,
  "blockingDelayDays": 7,
  "deletionDelayDays": 30,
  "blockingMessage": "Votre abonnement a expiré...",
  "warningMessage": "Votre abonnement expire bientôt...",
  "autoRenewalEnabled": true,
  "gracePeriodEnabled": true,
  "readOnlyAccessAfterExpiry": false,
  "autoSaveUserData": true,
  "notifyBeforeBlocking": true,
  "notifyBeforeDeletion": true,
  "emailNotifications": true
}
```

#### PUT - Mettre à jour la configuration de blocage

```
PUT /api/admin/settings/blocking
PUT /api/admin/subscription-blocking/config

Request Body:
{
  "gracePeriodDays": number,
  "blockingDelayDays": number,
  "deletionDelayDays": number,
  "blockingMessage": "string",
  "warningMessage": "string",
  "autoRenewalEnabled": boolean,
  "gracePeriodEnabled": boolean,
  "readOnlyAccessAfterExpiry": boolean,
  "autoSaveUserData": boolean,
  "notifyBeforeBlocking": boolean,
  "notifyBeforeDeletion": boolean,
  "emailNotifications": boolean
}
```

#### POST - Tester la configuration (dry-run)

```
POST /api/admin/subscription-blocking/test

Request Body:
{
  "subscriptionId": "string"
}

Response:
{
  "wouldBeBlocked": boolean,
  "blockingDate": "2026-02-04",
  "blockedDays": 7,
  "wouldBeSaved": boolean
}
```

---

## 5️⃣ MONÉTISATION AVANCÉE (Monetization)

**Route Frontend**: `/admin/settings/monetization`

### Endpoints à implémenter:

#### GET - Récupérer tous les codes promo

```
GET /api/admin/promotions/codes
GET /api/admin/coupons

Response:
[
  {
    "id": "promo-noel-2024",
    "code": "NOEL2024",
    "type": "percentage|fixed|free_trial",
    "value": 20,
    "currency": "EUR",
    "maxUsageCount": 100,
    "currentUsageCount": 45,
    "expiryDate": "2024-12-31",
    "applicablePlans": ["plan-id-1", "plan-id-2"],
    "minPlanPrice": 0,
    "maxCumulativeDiscount": 50,
    "description": "-20% jusqu'au 31/12/2024",
    "status": "active"
  }
]
```

#### POST - Créer un code promo

```
POST /api/admin/promotions/codes
POST /api/admin/coupons/create

Request Body:
{
  "code": "string (unique, uppercase)",
  "type": "percentage|fixed|free_trial",
  "value": number,
  "currency": "EUR|USD",
  "maxUsageCount": number|null,
  "expiryDate": "date",
  "applicablePlans": ["plan-id"],
  "minPlanPrice": number,
  "description": "string",
  "metadata": {}
}
```

#### PUT - Mettre à jour un code promo

```
PUT /api/admin/promotions/codes/:couponId
```

#### DELETE - Supprimer un code promo

```
DELETE /api/admin/promotions/codes/:couponId
```

#### GET - Récupérer les réductions temporaires

```
GET /api/admin/promotions/temporary-discounts
GET /api/admin/promotions/seasonal

Response:
{
  "newUserDiscount": 10,
  "resubscriptionDiscount": 15,
  "seasonalOffers": [
    {
      "name": "Summer Sale",
      "discount": 25,
      "startDate": "2026-06-01",
      "endDate": "2026-08-31"
    }
  ]
}
```

#### PUT - Mettre à jour les réductions temporaires

```
PUT /api/admin/promotions/temporary-discounts

Request Body:
{
  "newUserDiscount": number,
  "resubscriptionDiscount": number,
  "seasonalOffers": [...]
}
```

#### GET - Récupérer les offres régionales

```
GET /api/admin/promotions/regional-offers

Response:
[
  {
    "id": "offer-africa",
    "region": "Africa",
    "countries": ["SN", "CI", "BJ"],
    "discount": 30,
    "currency": "XOF|EUR",
    "applicablePlans": ["plan-id"],
    "startDate": "2026-01-01",
    "endDate": "2026-12-31"
  }
]
```

#### POST/PUT - Gérer les offres régionales

```
POST /api/admin/promotions/regional-offers
PUT /api/admin/promotions/regional-offers/:offerId

Request Body:
{
  "region": "string",
  "countries": ["ISO_CODE"],
  "discount": number,
  "currency": "string",
  "applicablePlans": ["plan-id"],
  "startDate": "date",
  "endDate": "date"
}
```

#### GET - Récupérer les limites de monétisation

```
GET /api/admin/promotions/limits

Response:
{
  "maxCumulativeDiscount": 50,
  "maxActivePromoCodes": 10,
  "maxUsagePerCode": null,
  "maxRegionalOffers": 20
}
```

---

## 6️⃣ NOTIFICATIONS (Notification Settings)

**Route Frontend**: `/admin/settings/notifications`

### Endpoints à implémenter:

#### GET - Récupérer la configuration des notifications

```
GET /api/admin/settings/notifications
GET /api/admin/notifications/config

Response:
{
  "id": "notification-config",
  "notificationTypes": {
    "newCourses": {
      "enabled": true,
      "channels": ["email", "push"],
      "frequency": "immediate"
    },
    "newExercises": {
      "enabled": true,
      "channels": ["email", "push"],
      "frequency": "daily"
    },
    "subscriptionRenewal": {
      "enabled": true,
      "channels": ["email"],
      "daysBefore": 7
    },
    "inactiveAccountDeletion": {
      "enabled": true,
      "channels": ["email"],
      "daysBefore": 30
    },
    "lessonUnlocked": {
      "enabled": true,
      "channels": ["push"],
      "frequency": "immediate"
    },
    "levelCompleted": {
      "enabled": true,
      "channels": ["email", "push"],
      "frequency": "immediate"
    },
    "userInactivity": {
      "enabled": true,
      "channels": ["email"],
      "daysOfInactivity": 30
    }
  },
  "globalSettings": {
    "enabled": true,
    "delaySeconds": 60,
    "maxPerUserPerDay": 10
  },
  "notificationSchedule": {
    "startHour": 8,
    "endHour": 21,
    "timezone": "Europe/Paris"
  }
}
```

#### PUT - Mettre à jour la configuration des notifications

```
PUT /api/admin/settings/notifications
PUT /api/admin/notifications/config

Request Body:
{
  "notificationTypes": {
    "newCourses": {
      "enabled": boolean,
      "channels": ["email", "push", "sms", "whatsapp"],
      "frequency": "immediate|daily|weekly"
    },
    // ... other notification types
  },
  "globalSettings": {
    "enabled": boolean,
    "delaySeconds": number,
    "maxPerUserPerDay": number
  },
  "notificationSchedule": {
    "startHour": number (0-23),
    "endHour": number (0-23),
    "timezone": "string"
  }
}
```

#### POST - Envoyer une notification de test

```
POST /api/admin/notifications/send-test

Request Body:
{
  "channel": "email|push|sms|whatsapp",
  "recipient": "admin@example.com|phone_number",
  "notificationType": "string"
}
```

---

## 7️⃣ SUPPORT & COMMUNICATION

**Route Frontend**: `/admin/settings/support`

### Endpoints à implémenter:

#### GET - Récupérer la configuration du support

```
GET /api/admin/settings/support
GET /api/admin/support/config

Response:
{
  "id": "support-config",
  "contacts": {
    "email": "support@lingualearn.com",
    "phone": "+33 1 23 45 67 89",
    "whatsapp": "+33 6 12 34 56 78",
    "chatWidget": "https://...",
    "faqUrl": "https://..."
  },
  "enabledChannels": {
    "email": true,
    "push": true,
    "sms": false,
    "whatsapp": false,
    "liveChat": true
  },
  "schedule": {
    "startHour": 8,
    "endHour": 20,
    "timezone": "Europe/Paris"
  },
  "resources": {
    "faqEnabled": true,
    "documentationEnabled": true,
    "blogEnabled": false
  }
}
```

#### PUT - Mettre à jour la configuration du support

```
PUT /api/admin/settings/support

Request Body:
{
  "contacts": {
    "email": "string",
    "phone": "string",
    "whatsapp": "string",
    "chatWidget": "string (url)",
    "faqUrl": "string (url)"
  },
  "enabledChannels": {
    "email": boolean,
    "push": boolean,
    "sms": boolean,
    "whatsapp": boolean,
    "liveChat": boolean
  },
  "schedule": {
    "startHour": number,
    "endHour": number,
    "timezone": "string"
  },
  "resources": {
    "faqEnabled": boolean,
    "documentationEnabled": boolean,
    "blogEnabled": boolean
  }
}
```

---

## 8️⃣ QUALITÉ PÉDAGOGIQUE (Learning Quality)

**Route Frontend**: `/admin/settings/quality`

### Endpoints à implémenter:

#### GET - Récupérer la configuration de qualité pédagogique

```
GET /api/admin/settings/learning-quality
GET /api/admin/learning/quality-config

Response:
{
  "id": "quality-config",
  "validationThresholds": {
    "minScorePercentage": 70,
    "minScoreUnlockNextLevel": 80
  },
  "attemptLimits": {
    "maxAttemptsPerExercise": 3,
    "minMinutesPerLesson": 5,
    "cooldownMinutesAfterFailure": 15,
    "exercisesPerDayLimit": 20
  },
  "progressionRules": {
    "allowSkippingLessons": false,
    "enforceOrder": true,
    "lockFutureLevels": true,
    "allowReviewingCompleted": true
  },
  "feedback": {
    "showCorrectAnswersImmediately": true,
    "suggestResourcesAfterFailure": true,
    "displayDetailedProgress": true
  }
}
```

#### PUT - Mettre à jour la configuration de qualité

```
PUT /api/admin/settings/learning-quality

Request Body:
{
  "validationThresholds": {
    "minScorePercentage": number (0-100),
    "minScoreUnlockNextLevel": number (0-100)
  },
  "attemptLimits": {
    "maxAttemptsPerExercise": number,
    "minMinutesPerLesson": number,
    "cooldownMinutesAfterFailure": number,
    "exercisesPerDayLimit": number|null
  },
  "progressionRules": {
    "allowSkippingLessons": boolean,
    "enforceOrder": boolean,
    "lockFutureLevels": boolean,
    "allowReviewingCompleted": boolean
  },
  "feedback": {
    "showCorrectAnswersImmediately": boolean,
    "suggestResourcesAfterFailure": boolean,
    "displayDetailedProgress": boolean
  }
}
```

---

## 9️⃣ CONTENU GRATUIT (Free Content & Marketing)

**Route Frontend**: `/admin/settings/free-content`

### Endpoints à implémenter:

#### GET - Récupérer la configuration du contenu gratuit

```
GET /api/admin/settings/free-content
GET /api/marketing/free-content-config

Response:
{
  "id": "free-content-config",
  "freeLessons": {
    "lessonsPerLanguage": 5,
    "freeLevels": 1
  },
  "freeAccess": {
    "allowWithoutSignup": true,
    "requireSignupForProgress": true,
    "freeLevelTest": true,
    "previewMediaWithoutSignup": true
  },
  "contentTypes": {
    "basicVocabulary": true,
    "commonPhrases": true,
    "simpleDialogues": false,
    "basicExercises": true
  },
  "conversion": {
    "ctaAfterLessons": 3,
    "reminderFrequencyHours": 24
  },
  "trial": {
    "enabled": true,
    "trialDays": 7,
    "trialPlan": "plan-premium",
    "requirePaymentMethod": false
  }
}
```

#### PUT - Mettre à jour la configuration du contenu gratuit

```
PUT /api/admin/settings/free-content

Request Body:
{
  "freeLessons": {
    "lessonsPerLanguage": number,
    "freeLevels": number
  },
  "freeAccess": {
    "allowWithoutSignup": boolean,
    "requireSignupForProgress": boolean,
    "freeLevelTest": boolean,
    "previewMediaWithoutSignup": boolean
  },
  "contentTypes": {
    "basicVocabulary": boolean,
    "commonPhrases": boolean,
    "simpleDialogues": boolean,
    "basicExercises": boolean
  },
  "conversion": {
    "ctaAfterLessons": number,
    "reminderFrequencyHours": number
  },
  "trial": {
    "enabled": boolean,
    "trialDays": number,
    "trialPlan": "string (plan-id)",
    "requirePaymentMethod": boolean
  }
}
```

---

## 🔐 SÉCURITÉ & PRÉVENTION DES ABUS (Security)

**Route Frontend**: `/admin/settings/security`

### Endpoints à implémenter:

#### GET - Récupérer la configuration de sécurité

```
GET /api/admin/settings/security
GET /api/admin/security/config

Response:
{
  "id": "security-config",
  "concurrentLogins": {
    "maxConcurrentSessions": 3,
    "sessionTimeoutMinutes": 30
  },
  "loginAttempts": {
    "maxFailedAttempts": 5,
    "lockoutDurationMinutes": 15
  },
  "downloads": {
    "maxDownloadsPerDay": 20,
    "maxFileSizeMb": 100
  },
  "accountSharing": {
    "detectMultipleIps": true,
    "detectGeolocationAnomalies": true,
    "detectSimultaneousRemoteAccess": true,
    "encryptSensitiveData": true
  },
  "automaticActions": {
    "blockSuspiciousAccounts": true,
    "sendUserAlerts": true,
    "require2fa": false
  }
}
```

#### PUT - Mettre à jour la configuration de sécurité

```
PUT /api/admin/settings/security

Request Body:
{
  "concurrentLogins": {
    "maxConcurrentSessions": number,
    "sessionTimeoutMinutes": number
  },
  "loginAttempts": {
    "maxFailedAttempts": number,
    "lockoutDurationMinutes": number
  },
  "downloads": {
    "maxDownloadsPerDay": number|null,
    "maxFileSizeMb": number
  },
  "accountSharing": {
    "detectMultipleIps": boolean,
    "detectGeolocationAnomalies": boolean,
    "detectSimultaneousRemoteAccess": boolean,
    "encryptSensitiveData": boolean
  },
  "automaticActions": {
    "blockSuspiciousAccounts": boolean,
    "sendUserAlerts": boolean,
    "require2fa": boolean
  }
}
```

---

## ⚖️ PARAMÈTRES LÉGAUX (Legal Settings)

**Route Frontend**: `/admin/settings/legal`

### Endpoints à implémenter:

#### GET - Récupérer les documents légaux

```
GET /api/admin/settings/legal
GET /api/admin/legal/documents

Response:
{
  "id": "legal-config",
  "documents": {
    "termsOfUse": {
      "content": "string (markdown or html)",
      "version": "1.0",
      "lastUpdated": "2026-01-28",
      "mandatory": true
    },
    "privacyPolicy": {
      "content": "string",
      "version": "1.0",
      "lastUpdated": "2026-01-28",
      "mandatory": true
    },
    "paymentTerms": {
      "content": "string",
      "version": "1.0",
      "lastUpdated": "2026-01-28",
      "mandatory": true
    }
  },
  "consents": {
    "touRequired": true,
    "privacyRequired": true,
    "marketingOptional": false,
    "analyticsRequired": true,
    "cookiesRequired": true
  },
  "dataProtection": {
    "deleteAccountEnabled": true,
    "exportDataEnabled": true,
    "autoDeleteAfterInactiveDays": null,
    "dataRetentionDays": 365
  },
  "compliance": {
    "gdprCompliant": true,
    "ccpaCompliant": false,
    "lgpdCompliant": false,
    "ageVerification": null
  }
}
```

#### PUT - Mettre à jour les documents légaux

```
PUT /api/admin/settings/legal

Request Body:
{
  "documents": {
    "termsOfUse": {
      "content": "string",
      "version": "string"
    },
    "privacyPolicy": {
      "content": "string",
      "version": "string"
    },
    "paymentTerms": {
      "content": "string",
      "version": "string"
    }
  },
  "consents": {
    "touRequired": boolean,
    "privacyRequired": boolean,
    "marketingOptional": boolean,
    "analyticsRequired": boolean,
    "cookiesRequired": boolean
  },
  "dataProtection": {
    "deleteAccountEnabled": boolean,
    "exportDataEnabled": boolean,
    "autoDeleteAfterInactiveDays": number|null,
    "dataRetentionDays": number
  },
  "compliance": {
    "gdprCompliant": boolean,
    "ccpaCompliant": boolean,
    "lgpdCompliant": boolean,
    "ageVerification": number|null
  }
}
```

#### POST - Créer une nouvelle version d'un document

```
POST /api/admin/legal/documents/:documentType/version

Request Body:
{
  "content": "string",
  "effectiveDate": "date"
}
```

---

## 📊 STATISTIQUES & ANALYTICS (Analytics Settings)

**Route Frontend**: `/admin/settings/analytics`

### Endpoints à implémenter:

#### GET - Récupérer la configuration des analytics

```
GET /api/admin/settings/analytics
GET /api/admin/analytics/config

Response:
{
  "id": "analytics-config",
  "tracking": {
    "globalTrackingEnabled": true,
    "userBehaviorTracking": true,
    "educationEventTracking": true,
    "transactionTracking": true
  },
  "dataRetention": {
    "logsRetentionDays": 90,
    "analyticsRetentionDays": 365,
    "errorLogsRetentionDays": 30,
    "sessionDataRetentionDays": 60
  },
  "exports": {
    "excelExportEnabled": true,
    "csvExportEnabled": true,
    "pdfExportEnabled": true,
    "automatedReports": true
  },
  "thirdPartyServices": {
    "googleAnalytics": true,
    "hotjar": false,
    "mixpanel": false,
    "sentry": true
  },
  "privacy": {
    "anonymizeData": true,
    "hashUserIds": true,
    "encryptInTransit": true
  }
}
```

#### PUT - Mettre à jour la configuration des analytics

```
PUT /api/admin/settings/analytics

Request Body:
{
  "tracking": {
    "globalTrackingEnabled": boolean,
    "userBehaviorTracking": boolean,
    "educationEventTracking": boolean,
    "transactionTracking": boolean
  },
  "dataRetention": {
    "logsRetentionDays": number,
    "analyticsRetentionDays": number,
    "errorLogsRetentionDays": number,
    "sessionDataRetentionDays": number
  },
  "exports": {
    "excelExportEnabled": boolean,
    "csvExportEnabled": boolean,
    "pdfExportEnabled": boolean,
    "automatedReports": boolean
  },
  "thirdPartyServices": {
    "googleAnalytics": boolean,
    "hotjar": boolean,
    "mixpanel": boolean,
    "sentry": boolean
  },
  "privacy": {
    "anonymizeData": boolean,
    "hashUserIds": boolean,
    "encryptInTransit": boolean
  }
}
```

#### POST - Exporter les données (asynchrone)

```
POST /api/admin/analytics/export

Request Body:
{
  "format": "excel|csv|pdf",
  "startDate": "date",
  "endDate": "date",
  "metrics": ["users", "sessions", "transactions", "lessons_completed"]
}

Response:
{
  "exportId": "export-uuid",
  "status": "processing|completed",
  "downloadUrl": "https://..." (when completed)
}
```

---

## 📌 ENDPOINTS GÉNÉRIQUES (Generic/Utility)

### Authentification & Autorisation

```
GET /api/auth/me - Récupérer l'utilisateur courant
POST /api/auth/logout - Se déconnecter
```

### Gestion des modifications

```
GET /api/admin/audit-logs?resource=settings&action=update
- Récupérer l'historique des modifications

POST /api/admin/settings/rollback/:version
- Annuler une modification
```

### Health Check

```
GET /api/health
GET /api/admin/health

Response:
{
  "status": "ok|error",
  "version": "string",
  "timestamp": "ISO-8601"
}
```

---

## 🔑 Conventions d'API

### Headers requis

```
Authorization: Bearer {token}
Content-Type: application/json
X-Request-Id: {uuid} (optional, pour le tracking)
```

### Response Format Standard

```json
{
  "success": boolean,
  "data": {...} | null,
  "error": {
    "code": "ERROR_CODE",
    "message": "string",
    "details": {...}
  } | null,
  "meta": {
    "timestamp": "ISO-8601",
    "version": "string"
  }
}
```

### Codes HTTP

- `200 OK` - Succès
- `201 Created` - Ressource créée
- `204 No Content` - Succès sans contenu
- `400 Bad Request` - Données invalides
- `401 Unauthorized` - Non authentifié
- `403 Forbidden` - Non autorisé
- `404 Not Found` - Ressource non trouvée
- `409 Conflict` - Conflit (ex: code promo déjà existant)
- `422 Unprocessable Entity` - Erreur de validation
- `500 Internal Server Error` - Erreur serveur

### Pagination (pour les listes)

```
GET /api/admin/...?page=1&limit=20&sort=name:asc

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 📝 Résumé des Endpoints par Catégorie

| Catégorie          | GET | POST | PUT | DELETE |
| ------------------ | --- | ---- | --- | ------ |
| **General**        | ✅  | ❌   | ✅  | ❌     |
| **Subscriptions**  | ✅  | ✅   | ✅  | ✅     |
| **Access Control** | ✅  | ✅   | ✅  | ❌     |
| **Blocking**       | ✅  | ✅   | ✅  | ❌     |
| **Monetization**   | ✅  | ✅   | ✅  | ✅     |
| **Notifications**  | ✅  | ✅   | ✅  | ❌     |
| **Support**        | ✅  | ❌   | ✅  | ❌     |
| **Quality**        | ✅  | ❌   | ✅  | ❌     |
| **Free Content**   | ✅  | ❌   | ✅  | ❌     |
| **Security**       | ✅  | ❌   | ✅  | ❌     |
| **Legal**          | ✅  | ✅   | ✅  | ❌     |
| **Analytics**      | ✅  | ✅   | ✅  | ❌     |

---

## 🚀 Prochaines étapes

1. **Créer un service API** : `app/services/admin-settings.ts`
2. **Implémenter les composables** : `composables/useSettings.ts`
3. **Ajouter la validation** : Zod ou Valibot
4. **Implémenter error handling** : Toast notifications
5. **Ajouter le loading state** : Pour chaque action
6. **Configurer le caching** : Pour les données fréquemment lues
