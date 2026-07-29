import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  console.warn('MONGODB_URI is not set. Database persistence will not work on Vercel.');
} else {
  client = new MongoClient(uri);
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

export default async function handler(req, res) {
  if (!uri) {
    return res.status(500).json({ error: "MONGODB_URI environment variable is missing on Vercel" });
  }

  try {
    const connection = await clientPromise;
    const db = connection.db("social_app");
    const usersCollection = db.collection("users");
    const postsCollection = db.collection("posts");

    if (req.method === 'GET') {
      const users = await usersCollection.find({}).toArray();
      const posts = await postsCollection.find({}).toArray();

      if (users.length === 0 && posts.length === 0) {
        await usersCollection.insertMany(defaultFallbackDB.users);
        return res.status(200).json(defaultFallbackDB);
      }

      return res.status(200).json({ users, posts });
    }

    if (req.method === 'POST') {
      const { users, posts } = req.body || {};
      if (!Array.isArray(users) || !Array.isArray(posts)) {
        return res.status(400).json({ error: "Invalid JSON database payload: users and posts must be arrays" });
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

      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
