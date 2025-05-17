// vite.config.ts
import { defineConfig } from "file:///Users/chungquantin/Developer/cream/node_modules/.pnpm/vite@5.4.19_@types+node@22.15.3_lightningcss@1.29.2_terser@5.39.0/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/chungquantin/Developer/cream/node_modules/.pnpm/vite-plugin-dts@4.5.3_@types+node@22.15.3_rollup@4.40.1_typescript@5.8.3_vite@5.4.19_@t_a5afa32e4b607a79ea0403fe0e527f3d/node_modules/vite-plugin-dts/dist/index.mjs";
import { externalizeDeps } from "file:///Users/chungquantin/Developer/cream/node_modules/.pnpm/vite-plugin-externalize-deps@0.9.0_vite@5.4.19_@types+node@22.15.3_lightningcss@1.29.2_terser@5.39.0_/node_modules/vite-plugin-externalize-deps/dist/index.js";
import preserveUseClientDirective from "file:///Users/chungquantin/Developer/cream/node_modules/.pnpm/rollup-plugin-preserve-use-client@3.0.1_rollup@4.40.1/node_modules/rollup-plugin-preserve-use-client/dist/index.js";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "file:///Users/chungquantin/Developer/cream/node_modules/.pnpm/glob@11.0.2/node_modules/glob/dist/esm/index.js";
import path from "node:path";
import fs from "fs";
var __vite_injected_original_dirname = "/Users/chungquantin/Developer/cream/packages/core";
var __vite_injected_original_import_meta_url = "file:///Users/chungquantin/Developer/cream/packages/core/vite.config.ts";
var entryPoints = Object.fromEntries(
  glob.sync("src/**/*.{ts,tsx}", {
    ignore: ["src/**/*.d.ts", "src/**/*.test.ts", "src/**/*.test.tsx"]
  }).map((file) => [
    // The name of the entry point
    // src/nested/foo.ts becomes nested/foo
    relative("src", file.slice(0, file.length - extname(file).length)),
    // The absolute path to the entry file
    // src/nested/foo.ts becomes /project/src/nested/foo.ts
    fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
  ])
);
var sdkVersion = JSON.parse(fs.readFileSync("./package.json", "utf-8")).version;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  define: {
    __SDK_VERSION__: JSON.stringify(sdkVersion)
  },
  plugins: [
    externalizeDeps(),
    preserveUseClientDirective(),
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"]
    })
  ],
  build: {
    minify: false,
    sourcemap: true,
    emptyOutDir: process.env.NODE_ENV !== "development",
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      input: entryPoints,
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2h1bmdxdWFudGluL0RldmVsb3Blci9jcmVhbS9wYWNrYWdlcy9jb3JlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvY2h1bmdxdWFudGluL0RldmVsb3Blci9jcmVhbS9wYWNrYWdlcy9jb3JlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jaHVuZ3F1YW50aW4vRGV2ZWxvcGVyL2NyZWFtL3BhY2thZ2VzL2NvcmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCB7IGV4dGVybmFsaXplRGVwcyB9IGZyb20gJ3ZpdGUtcGx1Z2luLWV4dGVybmFsaXplLWRlcHMnO1xuaW1wb3J0IHByZXNlcnZlVXNlQ2xpZW50RGlyZWN0aXZlIGZyb20gJ3JvbGx1cC1wbHVnaW4tcHJlc2VydmUtdXNlLWNsaWVudCc7XG5pbXBvcnQgeyBleHRuYW1lLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCB7IGdsb2IgfSBmcm9tICdnbG9iJztcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5jb25zdCBlbnRyeVBvaW50cyA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgZ2xvYlxuICAgIC5zeW5jKCdzcmMvKiovKi57dHMsdHN4fScsIHtcbiAgICAgIGlnbm9yZTogWydzcmMvKiovKi5kLnRzJywgJ3NyYy8qKi8qLnRlc3QudHMnLCAnc3JjLyoqLyoudGVzdC50c3gnXSxcbiAgICB9KVxuICAgIC5tYXAoZmlsZSA9PiBbXG4gICAgICAvLyBUaGUgbmFtZSBvZiB0aGUgZW50cnkgcG9pbnRcbiAgICAgIC8vIHNyYy9uZXN0ZWQvZm9vLnRzIGJlY29tZXMgbmVzdGVkL2Zvb1xuICAgICAgcmVsYXRpdmUoJ3NyYycsIGZpbGUuc2xpY2UoMCwgZmlsZS5sZW5ndGggLSBleHRuYW1lKGZpbGUpLmxlbmd0aCkpLFxuICAgICAgLy8gVGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGVudHJ5IGZpbGVcbiAgICAgIC8vIHNyYy9uZXN0ZWQvZm9vLnRzIGJlY29tZXMgL3Byb2plY3Qvc3JjL25lc3RlZC9mb28udHNcbiAgICAgIGZpbGVVUkxUb1BhdGgobmV3IFVSTChmaWxlLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICBdKVxuKTtcblxuY29uc3Qgc2RrVmVyc2lvbiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCcuL3BhY2thZ2UuanNvbicsICd1dGYtOCcpKS52ZXJzaW9uO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICBfX1NES19WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHNka1ZlcnNpb24pLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgZXh0ZXJuYWxpemVEZXBzKCksXG4gICAgcHJlc2VydmVVc2VDbGllbnREaXJlY3RpdmUoKSxcbiAgICBkdHMoe1xuICAgICAgdHNjb25maWdQYXRoOiAnLi90c2NvbmZpZy5qc29uJyxcbiAgICAgIGluY2x1ZGU6IFsnc3JjJ10sXG4gICAgICBleGNsdWRlOiBbJ3NyYy8qKi8qLnRlc3QudHMnLCAnc3JjLyoqLyoudGVzdC50c3gnXSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBtaW5pZnk6IGZhbHNlLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBlbXB0eU91dERpcjogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdkZXZlbG9wbWVudCcsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiBlbnRyeVBvaW50cyxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV1bZXh0bmFtZV0nLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5qcycsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVUsU0FBUyxvQkFBb0I7QUFDbFcsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsdUJBQXVCO0FBQ2hDLE9BQU8sZ0NBQWdDO0FBQ3ZDLFNBQVMsU0FBUyxVQUFVLGVBQWU7QUFDM0MsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxZQUFZO0FBQ3JCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFFBQVE7QUFSZixJQUFNLG1DQUFtQztBQUFpSyxJQUFNLDJDQUEyQztBQVUzUCxJQUFNLGNBQWMsT0FBTztBQUFBLEVBQ3pCLEtBQ0csS0FBSyxxQkFBcUI7QUFBQSxJQUN6QixRQUFRLENBQUMsaUJBQWlCLG9CQUFvQixtQkFBbUI7QUFBQSxFQUNuRSxDQUFDLEVBQ0EsSUFBSSxVQUFRO0FBQUE7QUFBQTtBQUFBLElBR1gsU0FBUyxPQUFPLEtBQUssTUFBTSxHQUFHLEtBQUssU0FBUyxRQUFRLElBQUksRUFBRSxNQUFNLENBQUM7QUFBQTtBQUFBO0FBQUEsSUFHakUsY0FBYyxJQUFJLElBQUksTUFBTSx3Q0FBZSxDQUFDO0FBQUEsRUFDOUMsQ0FBQztBQUNMO0FBRUEsSUFBTSxhQUFhLEtBQUssTUFBTSxHQUFHLGFBQWEsa0JBQWtCLE9BQU8sQ0FBQyxFQUFFO0FBRzFFLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGlCQUFpQixLQUFLLFVBQVUsVUFBVTtBQUFBLEVBQzVDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxnQkFBZ0I7QUFBQSxJQUNoQiwyQkFBMkI7QUFBQSxJQUMzQixJQUFJO0FBQUEsTUFDRixjQUFjO0FBQUEsTUFDZCxTQUFTLENBQUMsS0FBSztBQUFBLE1BQ2YsU0FBUyxDQUFDLG9CQUFvQixtQkFBbUI7QUFBQSxJQUNuRCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsYUFBYSxRQUFRLElBQUksYUFBYTtBQUFBLElBQ3RDLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLE1BQ1AsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
