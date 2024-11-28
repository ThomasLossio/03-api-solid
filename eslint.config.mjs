import config from '@rocketseat/eslint-config/node.mjs'

export default [
  ...config,
  {
    rules: {
      camelcase: 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
