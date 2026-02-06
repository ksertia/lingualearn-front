// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: Number(process.env.PORT) || 3200
  },

  css: ['~/assets/css/main.css'],

  modules: ['@pinia/nuxt'],

  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
  public: {
    apiBase: 'http://213.32.120.11:4000/api'
  },
  apiSecret: ''
}
});
