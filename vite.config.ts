import type { Plugin } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Vercel serves this app at the site root.
 * Nitro's `vercel` preset writes the Build Output API to `.vercel/output`.
 *
 * /hickory-haven/preview.html is the same phone page as /preview.html.
 */
function previewAlias(): Plugin {
  const rewrite = (req: { url?: string }) => {
    const raw = req.url ?? "";
    const path = raw.split("?")[0];
    if (path === "/hickory-haven/preview.html" || path === "/hickory-haven/preview") {
      const query = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
      req.url = `/preview.html${query}`;
    }
  };
  return {
    name: "hickory-preview-alias",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req);
        next();
      });
    },
  };
}

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  vite: {
    plugins: [previewAlias()],
    base: "/",
    server: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
    preview: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
  },
});
