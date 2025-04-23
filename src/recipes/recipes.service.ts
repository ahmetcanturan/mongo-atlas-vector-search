import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";
import { Recipe, RecipeDocument } from "./recipe.schema";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { getEmbedding, formatTextForEmbedding } from "../utils/embeddings";

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const newRecipe = new this.recipeModel(createRecipeDto);
    return newRecipe.save();
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.find().exec();
  }

  async findOne(id: string): Promise<Recipe> {
    return this.recipeModel.findById(id).exec();
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.recipeModel
      .findByIdAndUpdate(id, updateRecipeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Recipe> {
    return this.recipeModel.findByIdAndDelete(id).exec();
  }

  async searchByVector(query: string, limit: number = 10): Promise<Recipe[]> {
    try {
      // Format the query text consistently before generating embedding
      const formattedQuery = formatTextForEmbedding(query);
      // Generate embedding for the search query
      const queryEmbedding = await getEmbedding(formattedQuery);
      // Build the aggregation pipeline
      let pipeline: PipelineStage[] = [
        {
          $vectorSearch: {
            index: "vector_cosine_index",
            path: "plot_embedding",
            queryVector: queryEmbedding,
            numCandidates: limit * 10,
            limit,
          },
        },
      ];
      pipeline.push({
        $limit: limit,
      });
      pipeline.push({
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          ingredients: 1,
          instructions: 1,
          prepTime: 1,
          cookTime: 1,
          servings: 1,
          cuisine: 1,
          dietaryInfo: 1,
          difficulty: 1,
          tags: 1,
        },
      });
      return this.recipeModel.aggregate(pipeline).exec();
    } catch (error) {
      console.error("Error performing vector search:", error);
      throw error;
    }
  }
}
