import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localDbPlugin() {
  return {
    name: "local-db-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith("/local-db-api")) {
          const dbPath = path.resolve(__dirname, "data.db");
          
          if (req.method === "GET") {
            try {
              const data = fs.readFileSync(dbPath, "utf-8");
              res.setHeader("Content-Type", "application/json");
              res.end(data);
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }
          
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                // Validate JSON before writing
                JSON.parse(body);
                fs.writeFileSync(dbPath, body, "utf-8");
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localDbPlugin()],
  server: {
    watch: {
      ignored: ["**/data.db"],
    },
  },
});

