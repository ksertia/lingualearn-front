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
<<<<<<< Updated upstream
    plugins: [tailwindcss()],
=======
    plugins: [tailwindcss()]
>>>>>>> Stashed changes
  },
  runtimeConfig: {
<<<<<<< Updated upstream
    public: {
      apiBase: '',
    },
    apiSecret: '',
  },
})
=======
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_URL || 'https://213.32.120.11:4000',
  },
  apiSecret: process.env.NUXT_API_SECRET || ''
}
});
>>>>>>> Stashed changes
