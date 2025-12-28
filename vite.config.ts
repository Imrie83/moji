import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/moji/',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-bootstrap', 'bootstrap'],
                    'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
                    'animation-vendor': ['framer-motion', 'tsparticles', '@tsparticles/react', '@tsparticles/slim'],
                    'utils-vendor': ['wanakana', 'zustand'],
                },
            },
        },
    },
});
