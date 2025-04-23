import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Format recipe text for consistent embedding generation
 * @param recipe The recipe object or query string to format
 * @returns Formatted text for embedding
 */
export function formatTextForEmbedding(recipe: any): string {
  // If input is a string (query), return it directly
  if (typeof recipe === "string") {
    return recipe;
  }

  // For recipe objects, create a consistent format
  return `
title: ${recipe.title || ""}
description: ${recipe.description || ""}
instructions: ${recipe.instructions || ""}
cook time: ${recipe.cookTime || 0}
prep time: ${recipe.prepTime || 0}
${recipe.ingredients ? `ingredients: ${recipe.ingredients.join(", ")}` : ""}
${recipe.cuisine ? `cuisine: ${recipe.cuisine}` : ""}
${recipe.dietaryInfo ? `dietary info: ${recipe.dietaryInfo.join(", ")}` : ""}
${recipe.tags ? `tags: ${recipe.tags.join(", ")}` : ""}
`.trim();
}

/**
 * Generate embeddings for text using OpenAI's API
 * @param text The text to generate an embedding for
 * @returns A vector of numbers representing the text embedding
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating OpenAI embedding:", error);
    throw error;
  }
}
