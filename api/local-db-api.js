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
    const collection = db.collection("mock_db");

    if (req.method === 'GET') {
      const doc = await collection.findOne({ _id: "current_db" });
      if (!doc) {
        return res.status(200).json(defaultFallbackDB);
      }
      const { _id, ...dbData } = doc;
      return res.status(200).json(dbData);
    }

    if (req.method === 'POST') {
      const dbData = req.body;
      if (!dbData || typeof dbData !== 'object') {
        return res.status(400).json({ error: "Invalid JSON database payload" });
      }

      await collection.replaceOne(
        { _id: "current_db" },
        { _id: "current_db", ...dbData },
        { upsert: true }
      );
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
