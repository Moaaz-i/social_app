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
            const usersCollection = db.collection("users");
            const postsCollection = db.collection("posts");

            if (req.method === "GET") {
              const users = await usersCollection.find({}).toArray();
              const posts = await postsCollection.find({}).toArray();

              res.setHeader("Content-Type", "application/json");
              if (users.length === 0 && posts.length === 0) {
                await usersCollection.insertMany(defaultFallbackDB.users);
                res.end(JSON.stringify(defaultFallbackDB));
              } else {
                res.end(JSON.stringify({ users, posts }));
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
                  const { users, posts } = JSON.parse(body);
                  if (!Array.isArray(users) || !Array.isArray(posts)) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "Invalid payload format" }));
                    return;
                  }

                  // Overwrite users
                  await usersCollection.deleteMany({});
                  if (users.length > 0) {
                    await usersCollection.insertMany(users);
                  }

                  // Overwrite posts
                  await postsCollection.deleteMany({});
                  if (posts.length > 0) {
                    await postsCollection.insertMany(posts);
                  }

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
  plugins: [react(), tailwindcss(), localDbPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Split third-party libraries into separate chunks
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    }
  }
});
