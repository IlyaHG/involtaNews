export default defineNuxtConfig({
  compatibilityDate: '2025-08-06',
  devtools: { enabled: true },

  css: ['~/assets/styles/main.scss'],

  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
})
