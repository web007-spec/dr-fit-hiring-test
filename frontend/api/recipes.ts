const API_BASE = 'http://localhost:8080';

export type Ingredient = {
  name: string;
  weight: number;
  unit: string;
};

export type Recipe = {
  id: number;
  title: string;
  image: string | null;
  prep_time: number;
  ingredients: Ingredient[];
  /** Present when the API returned ingredients as a plain string. */
  ingredientsText?: string;
};

type RawRecipe = {
  id: number;
  title: string;
  image?: unknown;
  prep_time: number;
  ingredients?: unknown;
};

function isIngredient(value: unknown): value is Ingredient {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Ingredient).name === 'string' &&
    typeof (value as Ingredient).weight === 'number' &&
    typeof (value as Ingredient).unit === 'string'
  );
}

function normalizeImage(image: unknown): string | null {
  if (image == null || typeof image !== 'string') return null;
  const trimmed = image.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeIngredients(raw: unknown): Pick<Recipe, 'ingredients' | 'ingredientsText'> {
  if (typeof raw === 'string') {
    return { ingredients: [], ingredientsText: raw };
  }
  if (Array.isArray(raw)) {
    return { ingredients: raw.filter(isIngredient) };
  }
  return { ingredients: [] };
}

export function normalizeRecipe(raw: RawRecipe): Recipe {
  const { ingredients, ingredientsText } = normalizeIngredients(raw.ingredients);
  return {
    id: raw.id,
    title: raw.title,
    prep_time: raw.prep_time,
    image: normalizeImage(raw.image),
    ingredients,
    ...(ingredientsText !== undefined ? { ingredientsText } : {}),
  };
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE}/recipes`);
  if (!res.ok) throw new Error(`Failed to fetch recipes: ${res.status}`);
  const data: RawRecipe[] = await res.json();
  return data.map(normalizeRecipe);
}

export async function fetchRecipe(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch recipe: ${res.status}`);
  const data: RawRecipe = await res.json();
  return normalizeRecipe(data);
}
