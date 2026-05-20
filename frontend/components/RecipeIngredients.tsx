import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Recipe } from '../api/recipes';
import { getIngredientLines } from '../utils/ingredients';

type Props = {
  recipe: Recipe;
};

export function RecipeIngredients({ recipe }: Props) {
  const lines = getIngredientLines(recipe);

  return (
    <View style={styles.block}>
      <Text style={styles.header}>Ingredients</Text>
      {lines.length > 0 ? (
        lines.map((line, index) => (
          <Text key={`${recipe.id}-${index}-${line}`} style={styles.line}>
            • {line}
          </Text>
        ))
      ) : (
        <Text style={styles.empty}>Ingredients unavailable</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 4,
  },
  header: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  line: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
    marginBottom: 2,
  },
  empty: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
