<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="card p-6 border-l-4 border-cyan-400 bg-gradient-to-br from-white/10 to-slate-50/5 backdrop-blur"
    >
      <div class="flex items-center gap-3 mb-3">
        <div
          class="p-2 bg-cyan-400 bg-opacity-20 rounded-lg border border-cyan-400/30"
        >
          <svg
            class="w-6 h-6 text-cyan-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <div>
          <h1
            class="text-2xl font-bold bg-gradient-to-r from-blue-900 via-cyan-600 to-cyan-400 bg-clip-text text-transparent"
          >
            Mon Profil
          </h1>
          <p class="text-sm text-slate-600 font-medium">
            Gérez vos informations personnelles
          </p>
        </div>
      </div>
    </div>

    <!-- Profile Picture Section -->
    <div
      class="card p-6 bg-gradient-to-br from-slate-50/5 to-transparent border border-slate-100/20 hover:border-cyan-400/30 transition-colors"
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
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
            />
          </svg>
        </span>
        Photo de Profil
      </h2>

      <div class="flex flex-col md:flex-row items-center gap-8">
        <!-- Avatar Preview -->
        <div class="flex-shrink-0">
          <div
            class="w-32 h-32 bg-gradient-to-br from-blue-900 via-cyan-500 to-cyan-300 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-cyan-400/30 border-2 border-cyan-400/50"
          >
            {{ getInitials() }}
          </div>
          <p class="text-center text-xs text-gray-500 mt-3">
            {{ profile.firstName }} {{ profile.lastName }}
          </p>
        </div>

        <!-- Upload Section -->
        <div class="flex-1">
          <label class="block mb-4">
            <input
              type="file"
              accept="image/*"
              @change="handlePhotoUpload"
              class="hidden"
              ref="photoInput"
            />
            <button
              @click="photoInput?.click()"
              type="button"
              class="btn-primary w-full md:w-auto"
            >
              📤 Télécharger une photo
            </button>
          </label>
          <div class="space-y-2">
            <p class="text-sm font-medium text-dark-blue">Formats acceptés</p>
            <p class="text-xs text-gray-600">
              JPG, PNG ou GIF • Taille max: 5MB
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Information -->
    <div class="card p-6">
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
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </span>
        Informations Personnelles
      </h2>

      <form @submit.prevent="saveProfile" class="space-y-5">
        <!-- Name Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-semibold text-dark-blue mb-2"
              >Prénom</label
            >
            <input
              v-model="profile.firstName"
              type="text"
              placeholder="Votre prénom"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-dark-blue mb-2"
              >Nom</label
            >
            <input
              v-model="profile.lastName"
              type="text"
              placeholder="Votre nom"
            />
          </div>
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-semibold text-dark-blue mb-2"
            >Nom d'utilisateur</label
          >
          <input
            v-model="profile.displayName"
            type="text"
            placeholder="Votre pseudo"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-semibold text-dark-blue mb-2"
            >Email</label
          >
          <input
            v-model="profile.email"
            type="email"
            placeholder="votre.email@exemple.com"
          />
        </div>

        <!-- Language and Timezone -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-semibold text-dark-blue mb-2"
              >Langue de l'interface</label
            >
            <select v-model="profile.preferredLanguage">
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="it">🇮🇹 Italiano</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-dark-blue mb-2"
              >Fuseau horaire</label
            >
            <select v-model="profile.timezone">
  <optgroup label="Afrique">
    <option value="Africa/Ouagadougou">Ouagadougou (GMT)</option>
    <option value="Africa/Abidjan">Abidjan (GMT)</option>
    <option value="Africa/Dakar">Dakar (GMT)</option>
    <option value="Africa/Accra">Accra (GMT)</option>
    <option value="Africa/Lagos">Lagos (GMT+1)</option>
  </optgroup>

  <optgroup label="Europe">
    <option value="Europe/Paris">Paris</option>
    <option value="Europe/London">London</option>
  </optgroup>

  <optgroup label="Amériques">
    <option value="America/New_York">New York</option>
    <option value="America/Los_Angeles">Los Angeles</option>
  </optgroup>

  <optgroup label="Asie">
    <option value="Asia/Tokyo">Tokyo</option>
  </optgroup>
</select>

          </div>
        </div>

        <!-- Save Button -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button type="submit" class="btn-primary">
            ✓ Enregistrer les modifications
          </button>
          <button type="button" @click="resetProfile" class="btn-secondary">
            ↻ Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Danger Zone -->
    <div class="card p-6 border-l-4 border-orange">
      <h2
        class="text-lg font-semibold text-orange mb-4 flex items-center gap-2"
      >
        <span class="p-2 bg-orange bg-opacity-10 rounded-lg">
          <svg
            class="w-5 h-5 text-orange"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
            />
          </svg>
        </span>
        Zone Dangereuse
      </h2>

      <div class="space-y-3">
        <p class="text-sm text-gray-600">
          ⚠️ La suppression de votre compte est permanente et ne peut pas être
          annulée. Toutes vos données seront perdues.
        </p>
        <button @click="showDeleteConfirm = true" class="btn-danger">
          🗑️ Supprimer mon compte
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="card p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-dark-blue mb-3">
          ⚠️ Êtes-vous sûr ?
        </h3>
        <p class="text-gray-600 text-sm mb-6">
          Cette action est irréversible. Toutes vos données, y compris vos
          progrès d'apprentissage, seront définitivement supprimés.
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="btn-secondary flex-1"
          >
            Annuler
          </button>
          <button @click="deleteAccount" class="btn-danger flex-1">
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <Teleport to="body" v-if="showSuccess">
      <div
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-elevated animate-pulse"
      >
        ✓ Profil mis à jour avec succès
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const profile = reactive({
  firstName: "Jean",
  lastName: "Dupont",
  displayName: "jeandupont",
  email: "jean.dupont@exemple.com",
  preferredLanguage: "fr",
  timezone: "Europe/Paris",
});

const showDeleteConfirm = ref(false);
const showSuccess = ref(false);
const photoInput = ref<HTMLInputElement | null>(null);

const getInitials = () => {
  return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
};

const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.[0]) {
    const file = target.files[0];
    console.log("Photo uploadée:", file.name);
    // Vous pouvez ajouter la logique d'upload ici
  }
};

const saveProfile = () => {
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
  console.log("Profil sauvegardé:", profile);
};

const resetProfile = () => {
  // Réinitialiser aux valeurs d'origine
  Object.assign(profile, {
    firstName: "Jean",
    lastName: "Dupont",
    displayName: "jeandupont",
    email: "jean.dupont@exemple.com",
    preferredLanguage: "fr",
    timezone: "Europe/Paris",
  });
};

const deleteAccount = () => {
  console.log("Compte supprimé");
  showDeleteConfirm.value = false;
  // Ajouter la logique de suppression du compte
  navigateTo("/");
};
</script>
