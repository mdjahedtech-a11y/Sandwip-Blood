import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`[Server] Starting on port ${PORT}...`);

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Always use Vite middleware in this dev/preview environment
  // This ensures we don't accidentally fall into a broken "production" mode without a build
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom", // Disable Vite's default HTML handling so we can handle it
  });
  
  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // Explicit fallback for SPA - Catch ALL GET requests that weren't handled by Vite
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;
    console.log(`[Server] SPA Fallback for: ${url}`);

    try {
      // 1. Read index.html
      const indexPath = path.resolve(__dirname, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.error(`[Server] index.html not found at ${indexPath}`);
        return next(new Error("index.html not found"));
      }

      let template = fs.readFileSync(indexPath, 'utf-8');

      // 2. Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);

      // 3. Send the rendered HTML back
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      console.error(`[Server] Error transforming HTML for ${url}:`, e);
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
