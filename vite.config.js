import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://mongo:RWNtyhaEphWnYiUmtJqycrKOsFemTaVX@caboose.proxy.rlwy.net:48691";
let client;
let clientPromise;

try {
  client = new MongoClient(mongoUri);
  clientPromise = client.connect();
} catch (e) {
  console.error("Failed to initialize MongoDB client", e);
}

const defaultFallbackDB = {
  users: [
    {
      _id: "u1",
      name: "Guest User",
      email: "guest@example.com",
      password: "password",
      dateOfBirth: "1995-01-01",
      gender: "male",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
    },
    {
      _id: "u_admin",
      name: "Admin User",
      email: "admin@example.com",
      password: "password",
      dateOfBirth: "1990-01-01",
      gender: "male",
      photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200"
    }
  ],
  posts: []
};

function localDbPlugin() {
  return {
    name: "local-db-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith("/local-db-api")) {
          try {
            const connection = await clientPromise;
            const db = connection.db("social_app");
            const collection = db.collection("mock_db");

            if (req.method === "GET") {
              const doc = await collection.findOne({ _id: "current_db" });
              res.setHeader("Content-Type", "application/json");
              if (!doc) {
                res.end(JSON.stringify(defaultFallbackDB));
              } else {
                const { _id, ...dbData } = doc;
                res.end(JSON.stringify(dbData));
              }
              return;
            }

            if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk.toString();
              });
              req.on("end", async () => {
                try {
                  const dbData = JSON.parse(body);
                  await collection.replaceOne(
                    { _id: "current_db" },
                    { _id: "current_db", ...dbData },
                    { upsert: true }
                  );
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ success: true }));
                } catch (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
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
  plugins: [react(), tailwindcss(), localDbPlugin()]
});
