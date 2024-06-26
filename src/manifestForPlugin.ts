import { VitePWAOptions } from "vite-plugin-pwa";
export const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "prompt",
  manifest: {
    name: "WheelOfFortune",
    short_name: "WheelOfFortune",
    description: "WheelOfFortune simulator app",
    icons: [
      {
        src: "icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/WheelOfFortune",
    start_url: "/WheelOfFortune",
    orientation: "portrait",
  },
};
