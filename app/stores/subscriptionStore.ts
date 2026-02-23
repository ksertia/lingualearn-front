import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiService } from "~/services/api";
import { useAuthStore } from "~/stores/authStore";
import type {
  SubscriptionPlan,
  CreatePlanPayload,
  UpdatePlanPayload,
  PaymentMethod,
  UpdatePaymentMethodPayload,
  Transaction,
  TransactionParams,
  AccessRestriction,
  UpdateAccessRestrictionsPayload,
} from "~/types/settings";

export const useSubscriptionStore = defineStore("subscription", () => {
  const api = useApiService();
  const authStore = useAuthStore();

  // -----------------------------
  // STATE
  // -----------------------------

  // Plans d'abonnement
  const plans = ref<SubscriptionPlan[]>([]);
  const selectedPlanId = ref<string | null>(null);
  const plansLoading = ref(false);
  const plansError = ref<string | null>(null);

  // Méthodes de paiement
  const paymentMethods = ref<PaymentMethod[]>([]);
  const paymentMethodsLoading = ref(false);
  const paymentMethodsError = ref<string | null>(null);

  // Transactions
  const transactions = ref<Transaction[]>([]);
  const transactionsMeta = ref<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const transactionsLoading = ref(false);
  const transactionsError = ref<string | null>(null);

  // Restrictions d'accès
  const accessRestrictions = ref<AccessRestriction[]>([]);
  const restrictionsLoading = ref(false);
  const restrictionsError = ref<string | null>(null);

  // -----------------------------
  // GETTERS
  // -----------------------------

  const userRole = computed(() => authStore.user?.accountType);

  const selectedPlan = computed(() => {
    if (!selectedPlanId.value) return null;
    return plans.value.find((p) => p.id === selectedPlanId.value) || null;
  });

  const activePlans = computed(() => {
    return plans.value.filter((p) => p.isActive);
  });

  const inactivePlans = computed(() => {
    return plans.value.filter((p) => !p.isActive);
  });

  const totalSubscribers = computed(() => {
    return plans.value.reduce((sum, plan) => sum + plan.subscribers, 0);
  });

  const enabledPaymentMethods = computed(() => {
    return paymentMethods.value.filter((m) => m.isEnabled);
  });

  // -----------------------------
  // ACTIONS - PLANS
  // -----------------------------

  // 1️⃣ Charger tous les plans
  const fetchPlans = async () => {
    plansLoading.value = true;
    plansError.value = null;

    try {
      const res = await api.getSubscriptionPlans();
      if (res.success && res.data) {
        plans.value = res.data;
      } else {
        throw new Error(res.message || "Erreur chargement des plans");
      }
    } catch (e) {
      plansError.value =
        e instanceof Error ? e.message : "Erreur chargement des plans";
    } finally {
      plansLoading.value = false;
    }
  };

  // 2️⃣ Créer un plan
const createPlan = async (
  payload: CreatePlanPayload
): Promise<SubscriptionPlan> => {
  plansLoading.value = true;
  plansError.value = null;

  try {
    // Convertir features en objet si c'est un tableau vide
    let featuresPayload = payload.features;
    if (Array.isArray(payload.features) && payload.features.length === 0) {
      featuresPayload = {};
    }

    const apiPayload = {
      planCode: payload.planCode,
      planName: payload.planName,
      description: payload.description,
      priceMonthly: payload.priceMonthly,
      priceYearly: payload.priceYearly,
      currency: payload.currency,
      features: featuresPayload,
      maxSubAccounts: payload.maxSubAccounts,
      isActive: payload.isActive,
    };

    const res = await api.createSubscriptionPlan(apiPayload);

    if (!res.success || !res.data) {
      throw new Error(res.message || "Erreur création du plan");
    }

    plans.value.push(res.data);
    return res.data;
  } catch (e) {
    plansError.value =
      e instanceof Error ? e.message : "Erreur création du plan";
    throw e;
  } finally {
    plansLoading.value = false;
  }
};


  // 3️⃣ Mettre à jour un plan
const updatePlan = async (
  planId: string,
  payload: UpdatePlanPayload
): Promise<SubscriptionPlan | undefined> => {
  plansLoading.value = true;
  plansError.value = null;

  try {
    const apiPayload = {
      planCode: payload.planCode,
      planName: payload.planName,
      description: payload.description,
      priceMonthly: payload.priceMonthly,
      priceYearly: payload.priceYearly,
      currency: payload.currency,
      features: payload.features,
      maxSubAccounts: payload.maxSubAccounts,
      isActive: payload.isActive,
    };

    const res = await api.updateSubscriptionPlan(planId, apiPayload);

    if (!res.success || !res.data) {
      throw new Error(res.message || "Erreur mise à jour du plan");
    }

    const index = plans.value.findIndex((p) => p.id === planId);
    if (index !== -1) {
      plans.value[index] = res.data;
    }

    return res.data;
  } catch (e) {
    plansError.value =
      e instanceof Error ? e.message : "Erreur mise à jour du plan";
    throw e;
  } finally {
    plansLoading.value = false;
  }
};


  // 4️⃣ Supprimer un plan
  const deletePlan = async (planId: string) => {
    plansLoading.value = true;
    plansError.value = null;

    try {
      await api.deleteSubscriptionPlan(planId);
      plans.value = plans.value.filter((p) => p.id !== planId);

      if (selectedPlanId.value === planId) {
        selectedPlanId.value = null;
      }
    } catch (e) {
      plansError.value =
        e instanceof Error ? e.message : "Erreur suppression du plan";
      throw e;
    } finally {
      plansLoading.value = false;
    }
  };

  // 5️⃣ Activer/désactiver un plan
const togglePlan = async (planId: string) => {
  const plan = plans.value.find((p) => p.id === planId);
  if (!plan) return;

  plansLoading.value = true;
  plansError.value = null;

  try {
    // On utilise updatePlan pour changer isActive
    const updatedPlan = await updatePlan(planId, {
      planCode: plan.planCode,
      planName: plan.planName,
      description: plan.description,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      currency: plan.currency,
      features: plan.features,
      maxSubAccounts: plan.maxSubAccounts,
      isActive: !plan.isActive, // ici on inverse le statut
    });

    if (updatedPlan) {
      const index = plans.value.findIndex((p) => p.id === planId);
      if (index !== -1) {
        plans.value[index] = updatedPlan;
      }
    }
  } catch (e) {
    plansError.value =
      e instanceof Error ? e.message : "Erreur changement de statut du plan";
    // fallback local
    plan.isActive = !plan.isActive;
  } finally {
    plansLoading.value = false;
  }
};


  // 6️⃣ Sélectionner un plan
  const selectPlan = (planId: string) => {
    selectedPlanId.value = planId;
  };

  const clearPlanSelection = () => {
    selectedPlanId.value = null;
  };

  // -----------------------------
  // ACTIONS - PAYMENT METHODS
  // -----------------------------

  // 7️⃣ Charger les méthodes de paiement
  // const fetchPaymentMethods = async () => {
  //   paymentMethodsLoading.value = true;
  //   paymentMethodsError.value = null;

  //   try {
  //     const res = await api.getPaymentMethods();
  //     if (res.success && res.data) {
  //       paymentMethods.value = res.data;
  //     } else {
  //       throw new Error(res.message || "Erreur chargement des méthodes de paiement");
  //     }
  //   } catch (e) {
  //     paymentMethodsError.value =
  //       e instanceof Error ? e.message : "Erreur chargement des méthodes de paiement";
  //   } finally {
  //     paymentMethodsLoading.value = false;
  //   }
  // };

  // // 8️⃣ Mettre à jour une méthode de paiement
  // const updatePaymentMethod = async (
  //   methodId: string,
  //   payload: UpdatePaymentMethodPayload
  // ): Promise<PaymentMethod | undefined> => {
  //   paymentMethodsLoading.value = true;
  //   paymentMethodsError.value = null;

  //   try {
  //     const res = await api.updatePaymentMethod(methodId, payload);
  //     if (!res.success || !res.data) {
  //       throw new Error(res.message || "Erreur mise à jour de la méthode de paiement");
  //     }

  //     const index = paymentMethods.value.findIndex((m) => m.id === methodId);
  //     if (index !== -1) {
  //       paymentMethods.value[index] = res.data;
  //     }

  //     return res.data;
  //   } catch (e) {
  //     paymentMethodsError.value =
  //       e instanceof Error ? e.message : "Erreur mise à jour de la méthode de paiement";
  //     throw e;
  //   } finally {
  //     paymentMethodsLoading.value = false;
  //   }
  // };

  // // 9️⃣ Activer/désactiver une méthode de paiement
  // const togglePaymentMethod = async (methodId: string) => {
  //   const method = paymentMethods.value.find((m) => m.id === methodId);
  //   if (!method) return;

  //   paymentMethodsLoading.value = true;
  //   paymentMethodsError.value = null;

  //   try {
  //     const res = await api.togglePaymentMethod(methodId);
  //     if (res.success && res.data) {
  //       const index = paymentMethods.value.findIndex((m) => m.id === methodId);
  //       if (index !== -1) {
  //         paymentMethods.value[index] = res.data;
  //       }
  //     } else {
  //       method.isEnabled = !method.isEnabled;
  //     }
  //   } catch (e) {
  //     paymentMethodsError.value =
  //       e instanceof Error ? e.message : "Erreur changement de statut de la méthode";
  //     throw e;
  //   } finally {
  //     paymentMethodsLoading.value = false;
  //   }
  // };

  // // 🔟 Basculer le mode test
  // const togglePaymentMethodTestMode = async (methodId: string) => {
  //   const method = paymentMethods.value.find((m) => m.id === methodId);
  //   if (!method) return;

  //   paymentMethodsLoading.value = true;
  //   paymentMethodsError.value = null;

  //   try {
  //     const res = await api.togglePaymentMethodTestMode(methodId);
  //     if (res.success && res.data) {
  //       const index = paymentMethods.value.findIndex((m) => m.id === methodId);
  //       if (index !== -1) {
  //         paymentMethods.value[index] = res.data;
  //       }
  //     } else {
  //       method.isTestMode = !method.isTestMode;
  //     }
  //   } catch (e) {
  //     paymentMethodsError.value =
  //       e instanceof Error ? e.message : "Erreur changement du mode test";
  //     throw e;
  //   } finally {
  //     paymentMethodsLoading.value = false;
  //   }
  // };

  // // -----------------------------
  // // ACTIONS - TRANSACTIONS
  // // -----------------------------

  // // 1️⃣1️⃣ Charger les transactions
  // const fetchTransactions = async (params?: TransactionParams) => {
  //   transactionsLoading.value = true;
  //   transactionsError.value = null;

  //   try {
  //     const res = await api.getTransactions(params);
  //     if (res.success && res.data) {
  //       transactions.value = res.data;
  //       if (res.meta) {
  //         transactionsMeta.value = {
  //           currentPage: res.meta.currentPage,
  //           totalPages: res.meta.totalPages,
  //           totalItems: res.meta.totalItems,
  //         };
  //       }
  //     } else {
  //       throw new Error(res.message || "Erreur chargement des transactions");
  //     }
  //   } catch (e) {
  //     transactionsError.value =
  //       e instanceof Error ? e.message : "Erreur chargement des transactions";
  //   } finally {
  //     transactionsLoading.value = false;
  //   }
  // };

  // // -----------------------------
  // // ACTIONS - ACCESS RESTRICTIONS
  // // -----------------------------

  // // 1️⃣2️⃣ Charger les restrictions d'accès
  // const fetchAccessRestrictions = async () => {
  //   restrictionsLoading.value = true;
  //   restrictionsError.value = null;

  //   try {
  //     const res = await api.getAccessRestrictions();
  //     if (res.success && res.data) {
  //       accessRestrictions.value = res.data;
  //     } else {
  //       throw new Error(res.message || "Erreur chargement des restrictions");
  //     }
  //   } catch (e) {
  //     restrictionsError.value =
  //       e instanceof Error ? e.message : "Erreur chargement des restrictions";
  //   } finally {
  //     restrictionsLoading.value = false;
  //   }
  // };

  // // 1️⃣3️⃣ Mettre à jour les restrictions d'accès
  // const updateAccessRestrictions = async (
  //   payload: UpdateAccessRestrictionsPayload
  // ) => {
  //   restrictionsLoading.value = true;
  //   restrictionsError.value = null;

  //   try {
  //     const res = await api.updateAccessRestrictions(payload);
  //     if (res.success && res.data) {
  //       accessRestrictions.value = res.data;
  //     } else {
  //       throw new Error(res.message || "Erreur mise à jour des restrictions");
  //     }
  //   } catch (e) {
  //     restrictionsError.value =
  //       e instanceof Error ? e.message : "Erreur mise à jour des restrictions";
  //     throw e;
  //   } finally {
  //     restrictionsLoading.value = false;
  //   }
  // };

  // -----------------------------
  // RETURN
  // -----------------------------

  return {
    // State - Plans
    plans,
    selectedPlanId,
    plansLoading,
    plansError,

    // State - Payment Methods
    paymentMethods,
    paymentMethodsLoading,
    paymentMethodsError,

    // State - Transactions
    transactions,
    transactionsMeta,
    transactionsLoading,
    transactionsError,

    // State - Access Restrictions
    accessRestrictions,
    restrictionsLoading,
    restrictionsError,

    // Getters
    userRole,
    selectedPlan,
    activePlans,
    inactivePlans,
    totalSubscribers,
    enabledPaymentMethods,

    // Actions - Plans
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlan,
    selectPlan,
    clearPlanSelection,

    // // Actions - Payment Methods
    // fetchPaymentMethods,
    // updatePaymentMethod,
    // togglePaymentMethod,
    // togglePaymentMethodTestMode,

    // // Actions - Transactions
    // fetchTransactions,

    // // Actions - Access Restrictions
    // fetchAccessRestrictions,
    // updateAccessRestrictions,

    // API instance
    api,
  };
});

