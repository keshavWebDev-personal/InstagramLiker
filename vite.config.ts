import {defineConfig} from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import unocss from 'unocss/vite'
import {presetUno} from 'unocss'
import {presetDaisy} from 'unocss-preset-daisy'

export default defineConfig({
	plugins: [
    svelte(),
		unocss({
			presets: [presetUno(), presetDaisy({
        themes: ["business"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
          darkTheme: "dark", // name of one of the included themes for dark mode
          base: false, // applies background color and foreground color for root element by default
          styled: true, // include daisyUI colors and design decisions for all components
          utils: true, // adds responsive and modifier utility classes
          prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
          logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
          themeRoot: ":root", // The element that receives theme color CSS variables
      })],
		}),
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