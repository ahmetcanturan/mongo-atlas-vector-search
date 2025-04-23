import * as mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { Recipe, RecipeSchema } from "./recipes/recipe.schema";

dotenv.config();
async function seed() {
  console.log("Starting database seeding...");

  // Read mock data
  const mockDataPath = path.join(process.cwd(), "mock-data.json");
  const recipes = JSON.parse(fs.readFileSync(mockDataPath, "utf8"));

  // Get MongoDB connection string from .env
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI not found in environment variables");
    process.exit(1);
  }

  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri);
    console.log("Connected to MongoDB using Mongoose");

    // Create a Mongoose model for the Recipe
    const RecipeModel = mongoose.model<Recipe>("Recipe", RecipeSchema);

    // Clean the collection first (remove all documents)
    console.log("Cleaning recipes collection...");
    await RecipeModel.deleteMany({});

    // Insert the mock data
    console.log(`Inserting ${recipes.length} recipes...`);
    const result = await RecipeModel.insertMany(recipes);

    console.log(`Successfully inserted ${result.length} recipes`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
  }
}

// Execute the seed function
seed()
  .then(() => console.log("Seeding completed successfully"))
  .catch((error) => console.error("Seeding failed:", error));
