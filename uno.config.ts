import { defineConfig } from 'unocss'
import presetWebFonts from '@unocss/preset-web-fonts'
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local'
import transformerVariantGroup from '@unocss/transformer-variant-group'


export default defineConfig({
  presets: [
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: 'Inter'
      },
      // This will download the fonts and serve them locally
      processors: createLocalFontProcessor({
        // Directory to cache the fonts
        cacheDir: 'node_modules/.cache/unocss/fonts',

        // Directory to save the fonts assets
        fontAssetsDir: 'public/assets/fonts/',

        // Base URL to serve the fonts from the client
        fontServeBaseUrl: '/assets/fonts/Inter-Regular.woff'
      })
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],

})