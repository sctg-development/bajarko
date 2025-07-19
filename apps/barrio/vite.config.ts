import { reactRouter } from '@react-router/dev/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(dotenv.config({ path: "./.env" }));
// import { remixDevTools } from 'remix-development-tools';

export default defineConfig({
  define: {
    MEDUSA_BACKEND_URL: JSON.stringify(process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"),
    MEDUSA_PUBLISHABLE_KEY: JSON.stringify(process.env.MEDUSA_PUBLISHABLE_KEY || ""),
    BARRIO_SELLER_ID: JSON.stringify(process.env.BARRIO_SELLER_ID || ""),
  },

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
