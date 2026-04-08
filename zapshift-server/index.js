const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI;

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("zapshiftDB");
    const usersCollection = db.collection("users");

    // 🔹 Root route
    app.get('/', (req, res) => {
      res.send('🚀 ZapShift Server is running!');
    });

    // 🔹 CREATE user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // 🔹 READ all users
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // 🔹 READ single user
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // 🔹 UPDATE user
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { upsert: true }
      );

      res.send(result);
    });

    // 🔹 DELETE user
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Start server
    app.listen(port, () => {
      console.log(`🔥 Server running on port ${port}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

run();