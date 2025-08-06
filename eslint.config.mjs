import nuxt from '@nuxt/eslint-config'

const baseConfig = await nuxt()

export default [
  ...baseConfig, 
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    },
  },
]