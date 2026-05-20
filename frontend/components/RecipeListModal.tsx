import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ListRenderItem,
} from 'react-native';
import { fetchRecipes, Recipe } from '../api/recipes';
import { RecipeImage } from './RecipeImage';
import { RecipeIngredients } from './RecipeIngredients';

type Props = {
  onSelectRecipe: (id: number) => void;
};

function RecipeCard({
  recipe,
  onPress,
}: {
  recipe: Recipe;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <RecipeImage imageUrl={recipe.image} height={140} />
      <View style={styles.cardBody}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.prepTime}>Prep: {recipe.prep_time} min</Text>
        <RecipeIngredients recipe={recipe} />
      </View>
    </TouchableOpacity>
  );
}

function filterRecipesByTitle(recipes: Recipe[], query: string): Recipe[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return recipes;
  return recipes.filter((recipe) => recipe.title.toLowerCase().includes(trimmed));
}

export function RecipeListModal({ onSelectRecipe }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredRecipes = useMemo(
    () => filterRecipesByTitle(recipes, searchQuery),
    [recipes, searchQuery]
  );

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

  const renderItem: ListRenderItem<Recipe> = ({ item }) => (
    <RecipeCard recipe={item} onPress={() => onSelectRecipe(item.id)} />
  );

  const listEmpty = () => {
    if (recipes.length === 0) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No recipes found</Text>
        <Text style={styles.emptyBody}>
          No recipes match &quot;{searchQuery.trim()}&quot;. Try a different search.
        </Text>
      </View>
    );
  };

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
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes by name..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={
          filteredRecipes.length === 0 ? styles.listContentEmpty : styles.listContent
        }
        ListEmptyComponent={listEmpty}
        keyboardShouldPersistTaps="handled"
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
  searchRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#111',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  listContentEmpty: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  emptyState: {
    paddingHorizontal: 32,
    paddingTop: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
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
