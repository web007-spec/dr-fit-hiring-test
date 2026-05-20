import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
  imageUrl: string | null;
  height?: number;
};

export function RecipeImage({ imageUrl, height = 160 }: Props) {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { height }]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.image, styles.placeholder, { height }]}>
      <Text style={styles.placeholderText}>No photo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    backgroundColor: '#d0d0d0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  placeholderText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
});
