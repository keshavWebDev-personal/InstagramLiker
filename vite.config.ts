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
        'content-script': 'src/content-script.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service-worker' || chunkInfo.name === 'content-script') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
})