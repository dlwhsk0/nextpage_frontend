module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: ['airbnb', 'airbnb-typescript'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
    },
    plugins: [
      '@typescript-eslint',
      'react',
      'react-hooks',
      'jsx-a11y',
      'import',
    ],
    rules: {
      // ...airbnb.rules,
      // ...airbnbTypescript.rules,
      // ...typescriptEslintRecommended.rules,
      // ...reactRecommended.rules,
      // ...reactHooksRecommended.rules,
      // ...jsxA11yRecommended.rules,
      // ...importErrors.rules,
      // ...importWarnings.rules,
      // ...importTypescript.rules,
      // ...next.rules,
      // ...nextCoreWebVitals.rules,
      // 사용자 정의 규칙을 여기에 추가할 수 있습니다.
    },
  },
]
