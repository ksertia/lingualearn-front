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

// Helper : convertit un tableau ou objet features en objet { "0": ..., "1": ... }
// car l'API attend features de type object {}
const toFeaturesObject = (features: any): Record<string, any> => {
  if (!features) return {};
  if (Array.isArray(features)) {
    return Object.fromEntries(features.map((f, i) => [String(i), f]));
  }
  if (typeof features === "object") return features;
  return {};
};

// Helper : normalise un plan reçu de l'API vers le format interne
// - priceMonthly/priceYearly sont des strings dans la réponse → on les convertit en number
// - subscribers n'existe pas → on lit _count.subscriptions
const normalizePlan = (plan: any): SubscriptionPlan => ({
  ...plan,
  priceMonthly: Number(plan.priceMonthly ?? 0),
  priceYearly: Number(plan.priceYearly ?? 0),
  subscribers: plan._count?.subscriptions ?? 0,
});

export const useSubscriptionStore = defineStore("subscription", () => {
  const api = useApiService();
  const authStore = useAuthStore();

  // -----------------------------
  // STATE
  // -----------------------------

  const plans = ref<SubscriptionPlan[]>([]);
  const selectedPlanId = ref<string | null>(null);
  const plansLoading = ref(false);
  const plansError = ref<string | null>(null);

  const paymentMethods = ref<PaymentMethod[]>([]);
  const paymentMethodsLoading = ref(false);
  const paymentMethodsError = ref<string | null>(null);

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

  const activePlans = computed(() => plans.value.filter((p) => p.isActive));
  const inactivePlans = computed(() => plans.value.filter((p) => !p.isActive));

  const totalSubscribers = computed(() =>
    plans.value.reduce((sum, plan) => sum + (plan.subscribers ?? 0), 0)
  );

  const enabledPaymentMethods = computed(() =>
    paymentMethods.value.filter((m) => m.isEnabled)
  );

  // -----------------------------
  // ACTIONS - PLANS
  // -----------------------------

  // 1️⃣ Charger tous les plans
  // L'API retourne directement un tableau : SubscriptionPlan[]
  const fetchPlans = async () => {
    plansLoading.value = true;
    plansError.value = null;

    try {
      const res = await api.getSubscriptionPlans();

      // Cas 1 : l'API retourne directement un tableau
      if (Array.isArray(res)) {
        plans.value = res.map(normalizePlan);
        return;
      }

      // Cas 2 : l'API retourne { success, data }
      if (res?.success && Array.isArray(res.data)) {
        plans.value = res.data.map(normalizePlan);
        return;
      }

      // Cas 3 : l'API retourne { data } sans success
      if (Array.isArray(res?.data)) {
        plans.value = res.data.map(normalizePlan);
        return;
      }

      throw new Error("Format de réponse inattendu");
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
      const apiPayload = {
        planCode: payload.planCode,
        planName: payload.planName,
        description: payload.description,
        priceMonthly: payload.priceMonthly,
        priceYearly: payload.priceYearly,
        currency: payload.currency,
        features: toFeaturesObject(payload.features),
        maxSubAccounts: payload.maxSubAccounts,
        isActive: payload.isActive,
      };

      console.log("[createPlan] Payload envoyé:", JSON.stringify(apiPayload));

      const res = await api.createSubscriptionPlan(apiPayload);

      console.log("[createPlan] Réponse reçue:", res);

      // Normalise selon le format retourné
      const created = Array.isArray(res)
        ? normalizePlan(res[0])
        : res?.data
        ? normalizePlan(res.data)
        : normalizePlan(res);

      if (!created?.id) {
        throw new Error(res?.message || "Erreur création du plan");
      }

      plans.value.push(created);
      return created;
    } catch (e: any) {
      console.error("[createPlan] Erreur complète:", e);
      console.error("[createPlan] Réponse serveur:", e?.response?._data);
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
        features: toFeaturesObject(payload.features),
        maxSubAccounts: payload.maxSubAccounts,
        isActive: payload.isActive,
      };

      const res = await api.updateSubscriptionPlan(planId, apiPayload);

      const updated = Array.isArray(res)
        ? normalizePlan(res[0])
        : res?.data
        ? normalizePlan(res.data)
        : normalizePlan(res);

      if (!updated?.id) {
        throw new Error(res?.message || "Erreur mise à jour du plan");
      }

      const index = plans.value.findIndex((p) => p.id === planId);
      if (index !== -1) {
        plans.value[index] = updated;
      }

      return updated;
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
      const updatedPlan = await updatePlan(planId, {
        planCode: plan.planCode,
        planName: plan.planName,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        currency: plan.currency,
        features: plan.features,
        maxSubAccounts: plan.maxSubAccounts,
        isActive: !plan.isActive,
      });

      if (updatedPlan) {
        const index = plans.value.findIndex((p) => p.id === planId);
        if (index !== -1) {
          plans.value[index] = updatedPlan;
        }
      }
    } catch (e) {
      plansError.value =
        e instanceof Error
          ? e.message
          : "Erreur changement de statut du plan";
      // fallback local optimiste
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

    // API instance
    api,
  };
});