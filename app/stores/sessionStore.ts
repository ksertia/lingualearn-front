import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore("session", () => {
  const isSessionExpired = ref(false);

  const showSessionExpired = () => {
    if (isSessionExpired.value) return;
    isSessionExpired.value = true;
  };

  const hideSessionExpired = () => {
    isSessionExpired.value = false;
  };

  return {
    isSessionExpired,
    showSessionExpired,
    hideSessionExpired,
  };
});
