// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css", "~/assets/css/dashboard.css"],

  modules: ["@pinia/nuxt"],

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: "http://213.32.120.11:3200",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },



  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3200",
    },
  },

  // Redirects for deprecated routes
  routeRules: {
    "/pageSetting/**": { redirect: "/settings" },
  },
});
