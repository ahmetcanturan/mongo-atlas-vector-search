import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import { getEmbedding, formatTextForEmbedding } from "./utils/embeddings";

// Load environment variables
dotenv.config();

// Define the Recipe interface for type safety
interface Recipe {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  cuisine?: string;
  dietaryInfo?: string[];
  difficulty?: string;
  tags?: string[];
  plot_embedding?: number[];
}

// Main function to generate embeddings for all recipes
async function generateEmbeddings() {
  console.log("Starting OpenAI embedding generation...");

  // Get MongoDB connection string from .env
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found in environment variables");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Create a reference to the Recipe collection
    const RecipeCollection = mongoose.connection.collection("recipes");

    // Get all recipes
    const recipes = (await RecipeCollection.find({}).toArray()) as Recipe[];
    console.log(
      `Found ${recipes.length} recipes. Generating OpenAI embeddings...`
    );

    let updatedCount = 0;
    let errorCount = 0;

    // Process recipes in batches to avoid rate limiting
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      // Format text for embedding using the shared utility function
      const textToEmbed = formatTextForEmbedding(recipe);
      try {
        // Generate embedding
        const embedding = await getEmbedding(textToEmbed);
        // Update recipe with embedding
        await RecipeCollection.updateOne(
          { _id: recipe._id },
          { $set: { plot_embedding: embedding } }
        );
        updatedCount++;
        // Log progress
        if (updatedCount % 10 === 0 || updatedCount === recipes.length) {
          console.log(`Processed ${updatedCount}/${recipes.length} recipes`);
        }
        // Add a small delay to avoid hitting rate limits
        if (i < recipes.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`Error processing recipe ${recipe._id}:`, error);
        errorCount++;
      }
    }
    console.log(
      `Successfully updated ${updatedCount} recipes with OpenAI embeddings`
    );
    if (errorCount > 0) {
      console.log(`Failed to update ${errorCount} recipes`);
    }
  } catch (error) {
    console.error("Error generating embeddings:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
  }
}

// Execute the function
generateEmbeddings()
  .then(() => console.log("OpenAI embedding generation completed successfully"))
  .catch((error) =>
    console.error("OpenAI embedding generation failed:", error)
  );
