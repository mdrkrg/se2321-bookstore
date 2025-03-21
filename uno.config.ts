import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  // presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetAnimations from 'unocss-preset-animations'
import { presetShadcn } from 'unocss-preset-shadcn'

export default defineConfig({
  shortcuts: [],
  presets: [
    presetAttributify(),
    presetWind3(),
    presetAnimations(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetShadcn({
      color: 'neutral',
      // darkSelector: '[data-kb-theme="dark"]', // If using a dark mode selector
    }),
    // presetWebFonts({
    //   fonts: {
    //     sans: 'DM Sans',
    //     serif: 'DM Serif Display',
    //     mono: 'DM Mono',
    //   },
    // }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    breakpoints: {
      'xxs': '320px',
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
})
