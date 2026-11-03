import { defineConfig } from 'vitest/config';
<<<<<<< HEAD

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`. Requires Vite 8, which ships this option.
  resolve: { tsconfigPaths: true },
  test: {
    
    globals: true,
    testTimeout: 120000,
hookTimeout: 120000,
=======
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
>>>>>>> equipo/develop
    root: './',
    include: ['**/*.spec.ts'],
  },
});
