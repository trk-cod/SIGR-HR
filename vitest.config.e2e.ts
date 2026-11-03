import { defineConfig } from 'vitest/config';
<<<<<<< HEAD

export default defineConfig({
  resolve: { tsconfigPaths: true },
=======
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
>>>>>>> equipo/develop
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
