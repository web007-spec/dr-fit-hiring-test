import type { Ingredient, Recipe } from '../api/recipes';

export function formatQuantity(weight: number, unit: string): string {
  const value = Number.isInteger(weight) ? String(weight) : String(weight);
  return unit ? `${value} ${unit}` : value;
}

/** Split free-text ingredients (comma-separated) into display lines. */
export function parseIngredientsText(text: string): string[] {
  return text
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export function formatIngredientLine(ingredient: Ingredient): string {
  return `${ingredient.name} — ${formatQuantity(ingredient.weight, ingredient.unit)}`;
}

/** Unified ingredient lines for any recipe shape returned by the API. */
export function getIngredientLines(recipe: Recipe): string[] {
  if (recipe.ingredientsText) {
    return parseIngredientsText(recipe.ingredientsText);
  }
  return recipe.ingredients.map(formatIngredientLine);
}

export function hasIngredients(recipe: Recipe): boolean {
  return getIngredientLines(recipe).length > 0;
}
