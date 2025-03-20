import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  ignores: [
    '**/*.gen.ts',
    'src/components/ui/*.tsx',
  ] as string[],
})
