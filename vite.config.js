import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { MongoClient } from "mongodb";
import { TaskPulse } from "cronflex";

const mongoUri = "mongodb://mongo:RWNtyhaEphWnYiUmtJqycrKOsFemTaVX@caboose.proxy.rlwy.net:48691/admin?authSource=admin";
let client = null;
let clientPromise = null;

const getClientPromise = () => {
  if (!clientPromise) {
    client = new MongoClient(mongoUri);
    clientPromise = client.connect();
  }
  return clientPromise;
};

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
  const localDbQueue = new TaskPulse({
    concurrency: 2, // Allow running both collection tasks in parallel!
  });

  return {
    name: "local-db-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith("/local-db-api")) {
          try {
            const connection = await getClientPromise();
            const db = connection.db("social_app");
            const usersCollection = db.collection("users");
            const postsCollection = db.collection("posts");

            if (req.method === "GET") {
              const getUsersTask = localDbQueue.control(async () => {
                return await usersCollection.find({}).toArray();
              }, { id: "get-users" });

              const getPostsTask = localDbQueue.control(async () => {
                return await postsCollection.find({}).toArray();
              }, { id: "get-posts" });

              const [users, posts] = await Promise.all([getUsersTask(), getPostsTask()]);

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

                  const writeUsers = localDbQueue.control(async () => {
                    await usersCollection.deleteMany({});
                    if (users.length > 0) {
                      await usersCollection.insertMany(users);
                    }
                  }, { id: "write-users" });

                  const writePosts = localDbQueue.control(async () => {
                    await postsCollection.deleteMany({});
                    if (posts.length > 0) {
                      await postsCollection.insertMany(posts);
                    }
                  }, { id: "write-posts" });

                  // Run in parallel
                  await Promise.all([writeUsers(), writePosts()]);

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
  optimizeDeps: {
    exclude: ["ioredis"]
  },
  build: {
    rollupOptions: {
      external: ["ioredis"],
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
