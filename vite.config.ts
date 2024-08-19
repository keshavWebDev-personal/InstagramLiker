import {defineConfig} from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import unocss from 'unocss/vite'

export default defineConfig({
	plugins: [
		unocss(),
    svelte(),
	],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'service-worker': 'src/shared-service-worker/service-worker.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'service-worker' ? '[name].js' : 'assets/[name]-[hash].js';
        },
      },
    },
  },
})