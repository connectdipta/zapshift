const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config(); // ✅ ADD THIS LINE

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is missing in .env");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("zapshiftDB");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };