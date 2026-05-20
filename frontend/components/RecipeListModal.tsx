import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { fetchRecipes, Recipe } from '../api/recipes';
import { RecipeImage } from './RecipeImage';
import { RecipeIngredients } from './RecipeIngredients';

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <RecipeImage imageUrl={recipe.image} />
      <View style={styles.cardBody}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.prepTime}>Prep: {recipe.prep_time} min</Text>
        <RecipeIngredients recipe={recipe} />
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
});
