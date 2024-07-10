import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "/static/",
// });

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      plugins: [react()],
      build: {
        minify: false,
      },
      base: "/",
      resolve: {
        alias: {
          src: "/src",
        },
      },
    };
  } else {
    return {
      plugins: [react()],
      build: {
        minify: false,
      },
      base: "/static/",
      resolve: {
        alias: {
          src: "/src",
        },
      },
    };
  }
});
