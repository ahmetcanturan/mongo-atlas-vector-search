import { IsNotEmpty, IsString } from "class-validator";

export class SearchRecipeDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  limit?: number;
}
