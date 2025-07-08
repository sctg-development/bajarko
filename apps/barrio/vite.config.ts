import { reactRouter } from '@react-router/dev/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(dotenv.config({ path: "./.env" }));
// import { remixDevTools } from 'remix-development-tools';

export default defineConfig({
  server: {
    port: 5175,
    warmup: {
      clientFiles: ['./app/entry.client.tsx', './app/root.tsx', './app/routes/**/*'],
    },
  },
  ssr: {
    noExternal: ['@medusajs/js-sdk', '@lambdacurry/medusa-plugins-sdk'],
  },
  plugins: [reactRouter(), tsconfigPaths({ root: './' }), vanillaExtractPlugin()],
  build: {},
});
