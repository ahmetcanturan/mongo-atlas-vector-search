export class CreateRecipeDto {
  readonly title: string;
  readonly description: string;
  readonly ingredients: string[];
  readonly instructions: string;
  readonly prepTime: number;
  readonly cookTime: number;
  readonly servings: number;
  readonly cuisine: string;
  readonly dietaryInfo: string[];
  readonly difficulty: string;
  readonly tags: string[];
  readonly plot_embedding?: number[];
}
