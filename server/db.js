const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("alcoholPlanner"); 
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
