<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="card p-6 border-l-4 border-orange-400 bg-gradient-to-br from-white/10 to-slate-50/5 backdrop-blur"
    >
      <div class="flex items-center gap-3">
        <div
          class="p-2 bg-orange-400 bg-opacity-20 rounded-lg border border-orange-400/30"
        >
          <svg
            class="w-6 h-6 text-orange-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
            />
          </svg>
        </div>
        <div>
          <h1
            class="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-orange-400 bg-clip-text text-transparent"
          >
            Sécurité
          </h1>
          <p class="text-sm text-slate-600 font-medium">
            Gérez votre sécurité et confidentialité
          </p>
        </div>
      </div>
    </div>

    <!-- Password Section -->
    <div
      class="card p-6 bg-gradient-to-br from-slate-50/5 to-transparent border border-slate-100/20 hover:border-orange-400/30 transition-colors"
    >
      <h2
        class="text-lg font-semibold text-dark-blue mb-6 flex items-center gap-2"
      >
        <span class="p-2 bg-cyan bg-opacity-10 rounded-lg">
          <svg
            class="w-5 h-5 text-cyan"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
            />
          </svg>
        </span>
        Modifier le Mot de Passe
      </h2>

      <form @submit.prevent="changePassword" class="space-y-5">
        <!-- Current Password -->
        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Mot de passe actuel</label
          >
          <div class="relative">
            <input
              v-model="passwordForm.current"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <svg
                v-if="!showCurrentPassword"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M11.83 9L15.29 5.54c1.48 1.65 2.41 3.88 2.41 6.46 0 .34-.03.68-.07 1H19c.05-.33.07-.66.07-1 0-5.25-4.03-9.54-9-9.54-.33 0-.66.02-1 .07v5.32c.32-.04.66-.07 1-.07 1.66 0 3.14.69 4.22 1.78M1 6.54l2.23 2.13C3.08 9.02 3 9.5 3 10c0 5.25 4.03 9.54 9 9.54 1.38 0 2.74-.29 3.97-.82l2.15 2.16c1.66-1.22 3.09-2.81 4.2-4.72l2.62 2.66h2.15L4.15 3.35 1 6.54zm9 6.96c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Nouveau mot de passe</label
          >
          <div class="relative">
            <input
              v-model="passwordForm.new"
              :type="showNewPassword ? 'text' : 'password'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <svg
                v-if="!showNewPassword"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M11.83 9L15.29 5.54c1.48 1.65 2.41 3.88 2.41 6.46 0 .34-.03.68-.07 1H19c.05-.33.07-.66.07-1 0-5.25-4.03-9.54-9-9.54-.33 0-.66.02-1 .07v5.32c.32-.04.66-.07 1-.07 1.66 0 3.14.69 4.22 1.78M1 6.54l2.23 2.13C3.08 9.02 3 9.5 3 10c0 5.25 4.03 9.54 9 9.54 1.38 0 2.74-.29 3.97-.82l2.15 2.16c1.66-1.22 3.09-2.81 4.2-4.72l2.62 2.66h2.15L4.15 3.35 1 6.54zm9 6.96c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                />
              </svg>
            </button>
          </div>
          <div class="mt-2 flex gap-2">
            <div
              :class="[
                'h-2 flex-1 rounded-full',
                passwordStrength >= 1 ? 'bg-orange' : 'bg-gray-300',
              ]"
            />
            <div
              :class="[
                'h-2 flex-1 rounded-full',
                passwordStrength >= 2 ? 'bg-turquoise' : 'bg-gray-300',
              ]"
            />
            <div
              :class="[
                'h-2 flex-1 rounded-full',
                passwordStrength >= 3 ? 'bg-cyan' : 'bg-gray-300',
              ]"
            />
          </div>
          <p class="text-xs text-gray-600 mt-2">{{ passwordStrengthText }}</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Confirmer le nouveau mot de passe</label
          >
          <div class="relative">
            <input
              v-model="passwordForm.confirm"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <svg
                v-if="!showConfirmPassword"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M11.83 9L15.29 5.54c1.48 1.65 2.41 3.88 2.41 6.46 0 .34-.03.68-.07 1H19c.05-.33.07-.66.07-1 0-5.25-4.03-9.54-9-9.54-.33 0-.66.02-1 .07v5.32c.32-.04.66-.07 1-.07 1.66 0 3.14.69 4.22 1.78M1 6.54l2.23 2.13C3.08 9.02 3 9.5 3 10c0 5.25 4.03 9.54 9 9.54 1.38 0 2.74-.29 3.97-.82l2.15 2.16c1.66-1.22 3.09-2.81 4.2-4.72l2.62 2.66h2.15L4.15 3.35 1 6.54zm9 6.96c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn-primary">
            Mettre à jour le mot de passe
          </button>
          <button
            type="button"
            @click="resetPasswordForm"
            class="btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Two-Factor Authentication -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-dark-blue mb-4 flex items-center">
        <svg
          class="w-5 h-5 mr-2 text-cyan"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M17.64 15.89c.78-.79.78-2.05 0-2.84l-3.89-3.89c-.79-.79-2.05-.79-2.84 0L9 9.2c-.79.79-.79 2.05 0 2.84l3.89 3.89c.39.39.9.59 1.42.59.52 0 1.04-.2 1.42-.59l3.91-3.86zm-5.31-2.37L13.41 12l-1.06 1.06-2.12-2.12 1.06-1.06zm4.24 4.24l-1.06 1.06-2.12-2.12 1.06-1.06 2.12 2.12zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
          />
        </svg>
        Authentification à Deux Facteurs
      </h2>

      <div class="space-y-4">
        <div class="card p-4 bg-gray-light flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">Google Authenticator</h3>
            <p class="text-sm text-gray-600">
              Authentification basée sur une application
            </p>
          </div>
          <button
            v-if="!twoFactorEnabled"
            @click="enableTwoFactor"
            class="btn-primary text-sm"
          >
            Activer
          </button>
          <button v-else @click="disableTwoFactor" class="btn-danger text-sm">
            Désactiver
          </button>
        </div>
      </div>
    </div>

    <!-- Active Sessions -->
    <div class="card p-6 border-l-4 border-orange">
      <h2
        class="text-lg font-semibold text-dark-blue mb-6 flex items-center gap-2"
      >
        <span class="p-2 bg-orange bg-opacity-10 rounded-lg">
          <svg
            class="w-5 h-5 text-orange"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-5 8H7c-1.1 0-2-.9-2-2s.9-2 2-2h8c1.1 0 2 .9 2 2s-.9 2-2 2z"
            />
          </svg>
        </span>
        Sessions Actives
      </h2>

      <div class="space-y-3">
        <div
          v-for="session in activeSessions"
          :key="session.id"
          class="card p-4 flex items-center justify-between"
        >
          <div>
            <h3 class="font-semibold text-dark-blue">{{ session.device }}</h3>
            <p class="text-sm text-gray-600">
              {{ session.location }} • {{ session.lastActive }}
            </p>
          </div>
          <button @click="logoutSession(session.id)" class="btn-danger text-sm">
            Déconnecter
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <Teleport to="body" v-if="showSuccess">
      <div
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse"
      >
        ✓ Paramètres de sécurité mis à jour
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const passwordForm = reactive({
  current: "",
  new: "",
  confirm: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const twoFactorEnabled = ref(false);
const showSuccess = ref(false);

const activeSessions = ref([
  {
    id: "1",
    device: "Chrome sur Windows",
    location: "Paris, France",
    lastActive: "À l'instant",
  },
  {
    id: "2",
    device: "Safari sur MacOS",
    location: "Lyon, France",
    lastActive: "Il y a 2 jours",
  },
  {
    id: "3",
    device: "Chrome sur Android",
    location: "Marseille, France",
    lastActive: "Il y a 1 semaine",
  },
]);

const passwordStrength = computed(() => {
  const pwd = passwordForm.new;
  if (!pwd) return 0;
  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) strength++;
  return strength;
});

const passwordStrengthText = computed(() => {
  const strength = ["Faible", "Moyen", "Bon", "Très fort"];
  return strength[passwordStrength.value] || "Entrez un mot de passe";
});

const changePassword = () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }
  console.log("Mot de passe changé");
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
    resetPasswordForm();
  }, 3000);
};

const resetPasswordForm = () => {
  passwordForm.current = "";
  passwordForm.new = "";
  passwordForm.confirm = "";
};

const enableTwoFactor = () => {
  twoFactorEnabled.value = true;
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};

const disableTwoFactor = () => {
  twoFactorEnabled.value = false;
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};

const logoutSession = (sessionId: string) => {
  activeSessions.value = activeSessions.value.filter((s) => s.id !== sessionId);
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};
</script>
