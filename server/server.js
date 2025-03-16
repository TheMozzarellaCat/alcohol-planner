const express = require("express");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = 3000;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}
connectDB();

const db = client.db("alcoholPlanner");
const plansCollection = db.collection("plans");
const alcoholsCollection = db.collection("alcohols");

// ✅ **Generate Plan**
app.post("/plans", async (req, res) => {
  try {
    const { days, people, intensity } = req.body;

    // 🔍 Fetch Alcohols from Database
    const alcohols = await alcoholsCollection.find().toArray();

    if (alcohols.length === 0) {
      return res.status(500).json({ error: "No alcohols available." });
    }

    // 🎲 **Select Random Alcohol for Each Day**
    const selectedAlcohols = Array.from({ length: days }, () => {
      return alcohols[Math.floor(Math.random() * alcohols.length)];
    });

    const plan = {
      id: uuidv4(),
      days,
      people,
      intensity,
      alcohols: selectedAlcohols,
      createdAt: new Date(),
    };

    await plansCollection.insertOne(plan);
    res.status(201).json({ message: "Plan saved", id: plan.id });
  } catch (error) {
    console.error("Error saving plan:", error);
    res.status(500).json({ error: "Error saving plan" });
  }
});

// 📥 **Get Plan by UUID**
app.get("/plans/:id", async (req, res) => {
  try {
    const plan = await plansCollection.findOne({ id: req.params.id });
    if (plan) {
      res.json(plan);
    } else {
      res.status(404).json({ error: "Plan not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching plan" });
  }
});

// 🗑️ **Delete Plan**
app.delete("/plans/:id", async (req, res) => {
  try {
    const result = await plansCollection.deleteOne({ id: req.params.id });
    if (result.deletedCount > 0) {
      res.json({ message: "Plan deleted" });
    } else {
      res.status(404).json({ error: "Plan not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting plan" });
  }
});

// 🚀 **Start Server**
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
