import { TaskPulse } from "cronflex";
import { MongoClient } from "mongodb";

const localDbQueue = new TaskPulse({
  concurrency: 2, // Allow running both collection tasks in parallel!
});

const uri = process.env.MONGODB_URI || "mongodb://mongo:RWNtyhaEphWnYiUmtJqycrKOsFemTaVX@caboose.proxy.rlwy.net:48691/admin?authSource=admin";
let client;
let clientPromise;

if (!uri) {
  console.warn(
    "MONGODB_URI is not set. Database persistence will not work on Vercel.",
  );
} else {
  let finalUri = uri;
  // If connection string doesn't specify authSource, route to admin database
  if (!uri.includes("authSource")) {
    const baseUrl = uri.split("?")[0];
    const query = uri.split("?")[1] || "";
    const hasDb = baseUrl.split("/").length > 3 && baseUrl.split("/")[3] !== "";

    if (hasDb) {
      finalUri = baseUrl + (query ? `?${query}&` : "?") + "authSource=admin";
    } else {
      finalUri =
        baseUrl.replace(/\/$/, "") +
        "/admin" +
        (query ? `?${query}&` : "?") +
        "authSource=admin";
    }
  }

  client = new MongoClient(finalUri);
  clientPromise = client.connect();
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
      photo:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    },
    {
      _id: "u_admin",
      name: "Admin User",
      email: "admin@example.com",
      password: "password",
      dateOfBirth: "1990-01-01",
      gender: "male",
      photo:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200",
    },
  ],
  posts: [],
};

export default async function handler(req, res) {
  if (!uri) {
    return res
      .status(500)
      .json({ error: "MONGODB_URI environment variable is missing on Vercel" });
  }

  try {
    const connection = await clientPromise;
    const db = connection.db("social_app");
    const usersCollection = db.collection("users");
    const postsCollection = db.collection("posts");

    if (req.method === "GET") {
      const getUsersTask = localDbQueue.control(
        async () => {
          return await usersCollection.find({}).toArray();
        },
        { id: "get-users-api" },
      );

      const getPostsTask = localDbQueue.control(
        async () => {
          return await postsCollection.find({}).toArray();
        },
        { id: "get-posts-api" },
      );

      const [users, posts] = await Promise.all([
        getUsersTask(),
        getPostsTask(),
      ]);

      if (users.length === 0 && posts.length === 0) {
        await usersCollection.insertMany(defaultFallbackDB.users);
        return res.status(200).json(defaultFallbackDB);
      }

      return res.status(200).json({ users, posts });
    }

    if (req.method === "POST") {
      const { users, posts } = req.body || {};
      if (!Array.isArray(users) || !Array.isArray(posts)) {
        return res
          .status(400)
          .json({
            error:
              "Invalid JSON database payload: users and posts must be arrays",
          });
      }

      const writeUsers = localDbQueue.control(
        async () => {
          await usersCollection.deleteMany({});
          if (users.length > 0) {
            await usersCollection.insertMany(users);
          }
        },
        { id: "write-users-api" },
      );

      const writePosts = localDbQueue.control(
        async () => {
          await postsCollection.deleteMany({});
          if (posts.length > 0) {
            await postsCollection.insertMany(posts);
          }
        },
        { id: "write-posts-api" },
      );

      // Run in parallel
      await Promise.all([writeUsers(), writePosts()]);

      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
