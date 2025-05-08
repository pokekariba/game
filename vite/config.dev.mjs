import { defineConfig } from 'vite';
import env from '../src/config/env';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: env.VITE_PORT
    }
});
