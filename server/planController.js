const connectDB = require("./db");

async function savePlan(plan) {
  const db = await connectDB();
  const collection = db.collection("plans");
  const result = await collection.insertOne(plan);
  return result.insertedId;
}

async function getPlans() {
  const db = await connectDB();
  const collection = db.collection("plans");
  return await collection.find().toArray();
}

module.exports = { savePlan, getPlans };
