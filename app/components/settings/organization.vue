<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="card p-6 border-l-4 border-blue-900 bg-gradient-to-br from-white/10 to-slate-50/5 backdrop-blur"
    >
      <div class="flex items-center gap-3 mb-3">
        <div
          class="p-2 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-900/30"
        >
          <svg
            class="w-6 h-6 text-blue-900"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
            />
          </svg>
        </div>
        <div>
          <h1
            class="text-2xl font-bold bg-gradient-to-r from-blue-900 via-slate-700 to-blue-800 bg-clip-text text-transparent"
          >
            Organisation
          </h1>
          <p class="text-sm text-slate-600 font-medium">
            Gérez les paramètres de votre équipe et organisation
          </p>
        </div>
      </div>
    </div>

    <!-- Organization Info -->
    <div
      class="card p-6 border-l-4 border-orange-400 bg-gradient-to-br from-slate-50/5 to-transparent hover:border-orange-400/50 transition-colors"
    >
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
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 7l-9 9z"
            />
          </svg>
        </span>
        Informations de l'Organisation
      </h2>

      <form @submit.prevent="saveOrganization" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Nom de l'organisation</label
          >
          <input
            v-model="organization.name"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
            placeholder="Nom de votre organisation"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Email de contact</label
          >
          <input
            v-model="organization.email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
            placeholder="contact@organisation.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Site web</label
          >
          <input
            v-model="organization.website"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
            placeholder="https://www.exemple.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Description</label
          >
          <textarea
            v-model="organization.description"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
            placeholder="Décrivez votre organisation..."
          />
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn-primary">Enregistrer</button>
        </div>
      </form>
    </div>

    <!-- Team Members -->
    <div class="card p-6 border-l-4 border-turquoise">
      <div class="flex items-center justify-between mb-6">
        <h2
          class="text-lg font-semibold text-dark-blue flex items-center gap-2"
        >
          <span class="p-2 bg-turquoise bg-opacity-10 rounded-lg">
            <svg
              class="w-5 h-5 text-turquoise"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              />
            </svg>
          </span>
          Membres de l'Équipe
        </h2>
        <button @click="showInviteModal = true" class="btn-primary text-sm">
          + Inviter un membre
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="member in teamMembers"
          :key="member.id"
          class="card p-4 flex items-center justify-between"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 bg-gradient-to-br from-cyan to-turquoise rounded-full flex items-center justify-center text-white font-bold mr-3"
            >
              {{
                member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              }}
            </div>
            <div>
              <h3 class="font-semibold text-dark-blue">{{ member.name }}</h3>
              <p class="text-sm text-gray-600">{{ member.email }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                member.role === 'Admin'
                  ? 'bg-orange/20 text-orange'
                  : 'bg-cyan/20 text-cyan',
              ]"
            >
              {{ member.role }}
            </span>
            <button
              @click="removeMember(member.id)"
              class="text-orange hover:text-red-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Modal -->
    <div
      v-if="showInviteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="card p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-dark-blue mb-4">
          Inviter un nouveau membre
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-dark-blue mb-2"
              >Email</label
            >
            <input
              v-model="newMember.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
              placeholder="email@exemple.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-blue mb-2"
              >Rôle</label
            >
            <select
              v-model="newMember.role"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
            >
              <option value="Member">Membre</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div class="flex gap-3">
            <button
              @click="showInviteModal = false"
              class="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button @click="inviteMember" class="btn-primary flex-1">
              Envoyer l'invitation
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <Teleport to="body" v-if="showSuccess">
      <div
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse"
      >
        ✓ {{ successMessage }}
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const organization = reactive({
  name: "Mon Organisation",
  email: "contact@organisation.com",
  website: "https://www.organisation.com",
  description: "Une organisation d'apprentissage des langues innovante",
});

const teamMembers = ref([
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean@organisation.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie@organisation.com",
    role: "Member",
  },
  {
    id: "3",
    name: "Pierre Bernard",
    email: "pierre@organisation.com",
    role: "Member",
  },
]);

const showInviteModal = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");

const newMember = reactive({
  email: "",
  role: "Member",
});

const saveOrganization = () => {
  successMessage.value = "Informations de l'organisation mises à jour";
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};

const inviteMember = () => {
  if (!newMember.email) return;
  successMessage.value = `Invitation envoyée à ${newMember.email}`;
  showSuccess.value = true;
  showInviteModal.value = false;
  newMember.email = "";
  newMember.role = "Member";
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};

const removeMember = (memberId: string) => {
  teamMembers.value = teamMembers.value.filter((m) => m.id !== memberId);
  successMessage.value = "Membre supprimé de l'organisation";
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};
</script>
