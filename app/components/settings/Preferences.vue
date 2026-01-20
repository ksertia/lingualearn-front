<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-6 border-l-4 border-cyan">
      <div class="flex items-center gap-3 mb-3">
        <div class="p-2 bg-cyan bg-opacity-10 rounded-lg">
          <svg
            class="w-6 h-6 text-cyan"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.64l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22l-1.92 3.32c-.13.23-.07.5.12.64l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.64l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.5-.12-.64l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-dark-blue">Préférences</h1>
          <p class="text-sm text-gray-600">
            Personnalisez votre expérience d'apprentissage
          </p>
        </div>
      </div>
    </div>

    <!-- Learning Preferences -->
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
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-5-3v-4.9z"
            />
          </svg>
        </span>
        Préférences d'Apprentissage
      </h2>

      <form @submit.prevent="savePreferences" class="space-y-4">
        <!-- Daily Goal -->
        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Objectif quotidien (en minutes)</label
          >
          <input
            v-model.number="preferences.dailyGoal"
            type="number"
            min="5"
            max="480"
            step="5"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
          />
          <p class="text-xs text-gray-600 mt-1">
            {{ preferences.dailyGoal }} minutes par jour
          </p>
        </div>

        <!-- Notification Frequency -->
        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Fréquence des notifications</label
          >
          <select
            v-model="preferences.notificationFrequency"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
          >
            <option value="none">Pas de notifications</option>
            <option value="daily">Une fois par jour</option>
            <option value="twice-daily">Deux fois par jour</option>
            <option value="on-demand">À la demande uniquement</option>
          </select>
        </div>

        <!-- Learning Mode -->
        <div>
          <label class="block text-sm font-medium text-dark-blue mb-3"
            >Mode d'apprentissage préféré</label
          >
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="preferences.learningMode"
                type="radio"
                value="interactive"
                class="w-4 h-4 text-cyan"
              />
              <span class="ml-3 text-dark-blue"
                >Interactif (exercices et jeux)</span
              >
            </label>
            <label class="flex items-center">
              <input
                v-model="preferences.learningMode"
                type="radio"
                value="video"
                class="w-4 h-4 text-cyan"
              />
              <span class="ml-3 text-dark-blue">Vidéos et lectures</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="preferences.learningMode"
                type="radio"
                value="mixed"
                class="w-4 h-4 text-cyan"
              />
              <span class="ml-3 text-dark-blue">Mélangé (les deux)</span>
            </label>
          </div>
        </div>

        <!-- Difficulty Level -->
        <div>
          <label class="block text-sm font-medium text-dark-blue mb-2"
            >Niveau de difficulté</label
          >
          <select
            v-model="preferences.difficultyLevel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan focus:border-transparent outline-none"
          >
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
            <!-- <option value="expert">Expert</option> -->
          </select>
        </div>

        <!-- Save Button -->
        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn-primary">Enregistrer</button>
        </div>
      </form>
    </div>

    <!-- Notification Settings -->
    <div class="card p-6 border-l-4 border-turquoise">
      <h2
        class="text-lg font-semibold text-dark-blue mb-6 flex items-center gap-2"
      >
        <span class="p-2 bg-turquoise bg-opacity-10 rounded-lg">
          <svg
            class="w-5 h-5 text-turquoise"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v2.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            />
          </svg>
        </span>
        Paramètres de Notification
      </h2>

      <div class="space-y-4">
        <!-- Email Notifications -->
        <div class="card p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">
              Notifications par email
            </h3>
            <p class="text-sm text-gray-600">
              Recevez des mises à jour par email
            </p>
          </div>
          <button
            @click="notifications.email = !notifications.email"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              notifications.email ? 'bg-cyan' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                notifications.email ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Push Notifications -->
        <div class="card p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">Notifications push</h3>
            <p class="text-sm text-gray-600">
              Recevez des notifications sur vos appareils
            </p>
          </div>
          <button
            @click="notifications.push = !notifications.push"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              notifications.push ? 'bg-cyan' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                notifications.push ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- SMS Notifications -->
        <div class="card p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">Notifications SMS</h3>
            <p class="text-sm text-gray-600">Recevez des rappels par SMS</p>
          </div>
          <button
            @click="notifications.sms = !notifications.sms"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              notifications.sms ? 'bg-cyan' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                notifications.sms ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Marketing Emails -->
        <div class="card p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">Emails marketing</h3>
            <p class="text-sm text-gray-600">
              Recevez des offres et actualités
            </p>
          </div>
          <button
            @click="notifications.marketing = !notifications.marketing"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              notifications.marketing ? 'bg-cyan' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                notifications.marketing ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Accessibility Settings -->
    <div class="bg-white rounded-lg shadow-sm p-6">
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
              d="M20.5 6c-2.61 0-4.67-1.97-4.96-4.5H8.46c-.29 2.53-2.35 4.5-4.96 4.5.5 2.23 2.46 3.9 4.96 3.9s4.46-1.67 4.96-3.9h7.08c.5 2.23 2.46 3.9 4.96 3.9V6zM8.5 17.5c-2.61 0-4.67 1.97-4.96 4.5h7.08c-.29-2.53-2.35-4.5-4.96-4.5zm12 4.5c.29-2.53 2.35-4.5 4.96-4.5v9c-2.5 0-4.46-1.67-4.96-3.9h-7.08c.5 2.23 2.46 3.9 4.96 3.9v-4h2.12z"
            />
          </svg>
        </span>
        Paramètres d'Accessibilité
      </h2>

      <div class="space-y-4">
        <!-- Large Text -->
        <div class="card p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">Texte plus grand</h3>
            <p class="text-sm text-gray-600">Augmente la taille du texte</p>
          </div>
          <button
            @click="accessibility.largeText = !accessibility.largeText"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              accessibility.largeText ? 'bg-cyan' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                accessibility.largeText ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Dark Mode -->
        <div class="card p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">Mode sombre</h3>
            <p class="text-sm text-gray-600">Protège vos yeux</p>
          </div>
          <button
            @click="accessibility.darkMode = !accessibility.darkMode"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              accessibility.darkMode ? 'bg-cyan' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                accessibility.darkMode ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Reduced Motion -->
        <div class="card p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">Réduire les animations</h3>
            <p class="text-sm text-gray-600">Minimise les mouvements visuels</p>
          </div>
          <button
            @click="accessibility.reducedMotion = !accessibility.reducedMotion"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              accessibility.reducedMotion ? 'bg-cyan' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                accessibility.reducedMotion ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Captions -->
        <div class="card p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-blue">
              Sous-titres pour les vidéos
            </h3>
            <p class="text-sm text-gray-600">
              Affiche les sous-titres automatiquement
            </p>
          </div>
          <button
            @click="accessibility.captions = !accessibility.captions"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              accessibility.captions ? 'bg-cyan' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                accessibility.captions ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <Teleport to="body" v-if="showSuccess">
      <div
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse"
      >
        ✓ Préférences mises à jour
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const preferences = reactive({
  dailyGoal: 30,
  notificationFrequency: "daily",
  learningMode: "mixed",
  difficultyLevel: "intermediate",
});

const notifications = reactive({
  email: true,
  push: true,
  sms: false,
  marketing: false,
});

const accessibility = reactive({
  largeText: false,
  darkMode: false,
  reducedMotion: false,
  captions: true,
});

const showSuccess = ref(false);

const savePreferences = () => {
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
  console.log("Préférences sauvegardées");
};
</script>

