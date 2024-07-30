import {defineConfig} from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import unocss from 'unocss/vite'
import {presetUno} from 'unocss'
import {presetDaisy} from 'unocss-preset-daisy'
import extractorSvelte from '@unocss/extractor-svelte'

export default defineConfig({
	plugins: [
		unocss({
      extractors: [
        extractorSvelte(),
      ],
			presets: [presetUno(), presetDaisy({
        themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
          darkTheme: "dark", // name of one of the included themes for dark mode
          base: false, // applies background color and foreground color for root element by default
          styled: true, // include daisyUI colors and design decisions for all components
          utils: true, // adds responsive and modifier utility classes
      })],
		}),
    svelte(),
	],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'service-worker': 'src/service-worker.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'service-worker' ? '[name].js' : 'assets/[name]-[hash].js';
        },
      },
    },
  },
})