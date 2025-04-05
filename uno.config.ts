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
  shortcuts: [
    {
      'nav-transition': `transition-colors bg-background
hover:bg-accent hover:text-accent-foreground focus:bg-accent
focus:text-accent-foreground focus:outline-none disabled:pointer-events-none
disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50`,
    },
    {
      'nav-link': `group inline-flex w-max items-center justify-center rounded-md
font-medium leading-none px-[1em] py-[0.7em] nav-transition
[&.active]:text-pink-700 hover:text-pink-700 focus:text-pink-700`,
    },
  ],
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
