export interface CreateSubscriptionPlanPayload {
  planCode: string;
  planName: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: Record<string, any>;
  maxSubAccounts: number;
  isActive: boolean;
}

/* =====================================================
   TYPES POUR LES ABONNEMENTS (SETTINGS)
===================================================== */

// Feature d'un plan
export interface SubscriptionFeature {
  id?: string;
  name: string;
  description?: string;
  included: boolean;
  limit?: number; // -1 = illimité
}

// Plan d'abonnement
export interface SubscriptionPlan {
  id: string;
  planCode: string;
  planName: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: Record<string, any>; // Changed to match backend
  maxSubAccounts: number;
  isActive: boolean;
  subscribers: number;
  createdAt?: string;
  updatedAt?: string;
}

// Payload pour créer un plan (utilise Record<string, any> pour features)
export interface CreatePlanPayload {
  planCode: string;
  planName: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: Record<string, any>;
  maxSubAccounts: number;
  isActive: boolean;
}




// Payload pour mettre à jour un plan
export interface UpdatePlanPayload extends Partial<CreateSubscriptionPlanPayload> {}

/* ===================== AUTRES TYPES ===================== */

// Méthode de paiement
export interface PaymentMethod {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  isEnabled: boolean;
  fees: number; // pourcentage
  isTestMode: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Payload pour mettre à jour une méthode de paiement
export interface UpdatePaymentMethodPayload {
  description?: string;
  fees?: number;
  isTestMode?: boolean;
  isEnabled?: boolean;
}

// Transaction
export interface Transaction {
  id: string;
  userId: string;
  user: string;
  email: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  method: string;
  status: TransactionStatus;
  paymentId?: string;
  date: string;
  createdAt?: string;
}

// Statut de transaction
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

// Paramètres de pagination pour les transactions
export interface TransactionParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TransactionStatus;
  planId?: string;
  startDate?: string;
  endDate?: string;
}

// Restrictions d'accès par plan
export interface AccessRestriction {
  id: string;
  feature: string;
  description: string;
  plans: {
    free: boolean | number;
    basic: boolean | number;
    premium: boolean | number;
  };
}

// Payload pour les restrictions d'accès
export interface UpdateAccessRestrictionsPayload {
  restrictions: AccessRestriction[];
}

// Réponse paginée pour les transactions
export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Réponse API pour les plans
export interface SubscriptionPlansResponse {
  success: boolean;
  data: SubscriptionPlan[];
  meta?: {
    total: number;
  };
}

// Réponse API pour une transaction
export interface TransactionResponse {
  success: boolean;
  data: Transaction;
}

// Réponse API pour les transactions paginées
export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

