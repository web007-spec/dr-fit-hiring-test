import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  fetchRecipe,
  isRecipeNotFoundError,
  Recipe,
} from '../api/recipes';
import { RecipeImage } from './RecipeImage';
import { RecipeIngredients } from './RecipeIngredients';

type Props = {
  recipeId: number;
  onBack: () => void;
};

export function RecipeDetailScreen({ recipeId, onBack }: Props) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError(null);
    setRecipe(null);

    fetchRecipe(recipeId)
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((e) => {
        if (isRecipeNotFoundError(e)) {
          setNotFound(true);
        } else {
          setError(String(e));
        }
        setLoading(false);
      });
  }, [recipeId]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && notFound && (
        <View style={styles.center}>
          <Text style={styles.notFoundTitle}>Recipe not found</Text>
          <Text style={styles.notFoundBody}>
            Recipe #{recipeId} does not exist or may have been removed.
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      {!loading && recipe && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <RecipeImage imageUrl={recipe.image} height={220} />
          <View style={styles.body}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.prepTime}>Prep: {recipe.prep_time} min</Text>
            <RecipeIngredients recipe={recipe} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingRight: 12,
  },
  backText: {
    fontSize: 16,
    color: '#007aff',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  notFoundBody: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    color: '#cc0000',
    textAlign: 'center',
    fontSize: 15,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
  },
  prepTime: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
});
