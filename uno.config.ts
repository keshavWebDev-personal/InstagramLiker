// uno.config.ts
import { defineConfig } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import presetWebFonts from '@unocss/preset-web-fonts'

export default defineConfig({
  presets: [
    // presetUno(),
    presetWebFonts({
      provider: 'google', // default provider
      fonts: {
        // these will extend the default theme
        sans: ['Inter'],
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
})