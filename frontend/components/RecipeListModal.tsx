import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { fetchRecipes, Recipe } from '../api/recipes';

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.cardBody}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.prepTime}>Prep: {recipe.prep_time} min</Text>
        <View style={styles.ingredientsBlock}>
          <Text style={styles.ingredientsHeader}>Ingredients:</Text>
          {recipe.ingredientsText ? (
            <Text style={styles.ingredientLine}>{recipe.ingredientsText}</Text>
          ) : recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ing) => (
              <Text key={`${ing.name}-${ing.unit}`} style={styles.ingredientLine}>
                • {ing.name} — {ing.weight}
                {ing.unit}
              </Text>
            ))
          ) : (
            <Text style={styles.ingredientLine}>No ingredients listed.</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function RecipeListModal() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes()
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, []);

  const renderItem: ListRenderItem<Recipe> = ({ item }) => <RecipeCard recipe={item} />;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#cc0000',
    padding: 20,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    backgroundColor: '#d0d0d0',
  },
  cardBody: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  prepTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  ingredientsBlock: {
    marginTop: 4,
  },
  ingredientsHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  ingredientLine: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
});
