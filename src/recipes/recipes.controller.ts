import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { SearchRecipeDto } from "./dto/search-recipe.dto";

@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recipesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.recipesService.remove(id);
  }

  @Post("search")
  async search(@Body() searchRecipeDto: SearchRecipeDto) {
    return this.recipesService.searchByVector(
      searchRecipeDto.query,
      searchRecipeDto.limit
    );
  }
}
