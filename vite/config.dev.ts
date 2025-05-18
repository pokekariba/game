import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import env from '../src/config/env';
import path from 'path';


export default defineConfig({
    base: './',
    plugins: [react()],
    resolve: {
        alias: {
        '@': path.resolve(__dirname, '../src')
        }
    },
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
