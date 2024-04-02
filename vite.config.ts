import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

import { manifestForPlugin }  from "./src/manifestForPlugin"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/WheelOfFortune",
  plugins: [react(), VitePWA(manifestForPlugin)],
})
