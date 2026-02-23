// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: Number(process.env.PORT) || 3200
  },

  css: [
    '~/assets/css/main.css',
    "quill/dist/quill.snow.css"
  ],

  modules: ['@pinia/nuxt'],

  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      apiBase: '',
    },
    apiSecret: '',
  },
  // Transition entre les pages 

  app: {
    // pageTransition: {
    //   name: 'page', mode: 'out-in'
    // },
    head: {
      title: 'LinguaLearn',
      htmlAttrs: {
        lang: 'fr'
      },
  },
  }
  
});
