import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop({ required: true })
  instructions: string;

  @Prop({ required: true })
  prepTime: number;

  @Prop({ required: true })
  cookTime: number;

  @Prop({ required: true })
  servings: number;

  @Prop()
  cuisine: string;

  @Prop({ type: [String] })
  dietaryInfo: string[];

  @Prop()
  difficulty: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [Number] })
  plot_embedding: number[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
