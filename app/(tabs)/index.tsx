import React, { useState, useEffect } from 'react';

import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Image,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { fetchRandomRecipe } from '../../utils/api';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
}

const getCategoryColor = (category: string) => {
  const categoryColors: { [key: string]: string } = {
    'Beef': '#E53E3E',
    'Chicken': '#F56500',
    'Dessert': '#D53F8C',
    'Lamb': '#C53030',
    'Miscellaneous': Colors.accent1,
    'Pasta': '#38A169',
    'Pork': '#C53030',
    'Seafood': '#3182CE',
    'Side': '#805AD5',
    'Starter': '#DD6B20',
    'Vegan': '#38A169',
    'Vegetarian': '#68D391',
    'Breakfast': '#F6AD55',
  };
  return categoryColors[category] || Colors.primary;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good Morning! 👋";
  } else if (hour >= 12 && hour < 18) {
    return "Good Afternoon! 👋";
  } else {
    return "Good Evening! 👋";
  }
};

export default function TabOneScreen() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState(getGreeting());

  const loadRandomRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const randomRecipe = await fetchRandomRecipe();
      setRecipe(randomRecipe);
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomRecipe();

    // Update greeting if the user keeps the app open across time boundaries
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>{greeting}</Text>
          <Text style={styles.headerTitle}>What's cooking today?</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Categories</Text>
          <View style={styles.categoriesGrid}>
            {['chicken', 'beef', 'pasta', 'salmon', 'rice', 'vegetarian', 'dessert'].map((cat, i) => (
              <Link key={`${cat}-${i}`} href={{ pathname: '/(tabs)/two', params: { q: cat } }} asChild>
                <Pressable style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{cat}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        {/* Daily Inspiration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Inspiration</Text>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Finding something delicious...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorIcon}>😔</Text>
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={loadRandomRecipe}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>
            </View>
          ) : recipe ? (
            <View style={styles.recipeCard}>
              <Image
                source={{ uri: recipe.strMealThumb }}
                style={styles.recipeImage}
                resizeMode="cover"
              />
              <View style={styles.recipeOverlay} />

              {/* Recipe Info Overlay */}
              <View style={styles.recipeInfo}>
                <View style={styles.recipeBadges}>
                  <View style={[styles.badge, { backgroundColor: getCategoryColor(recipe.strCategory) }]}>
                    <Text style={styles.badgeText}>{recipe.strCategory}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <FontAwesome name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>

                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {recipe.strMeal}
                </Text>

                <View style={styles.recipeMetadata}>
                  <View style={styles.metadataItem}>
                    <FontAwesome name="clock-o" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.metadataText}>30 min</Text>
                  </View>
                  <View style={styles.metadataItem}>
                    <FontAwesome name="users" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.metadataText}>4 servings</Text>
                  </View>
                  <View style={styles.metadataItem}>
                    <FontAwesome name="globe" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.metadataText}>{recipe.strArea}</Text>
                  </View>
                </View>

                <Link href={`/recipe-details?id=${recipe.idMeal}`} asChild>
                  <Pressable style={styles.viewRecipeButton}>
                    <Text style={styles.viewRecipeText}>View Recipe</Text>
                    <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
                  </Pressable>
                </Link>
              </View>
            </View>
          ) : (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>No recipe available</Text>
              <Pressable style={styles.retryButton} onPress={loadRandomRecipe}>
                <Text style={styles.retryButtonText}>Find Recipe</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Link href="/two" asChild>
              <Pressable style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
                  <FontAwesome name="search" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.actionTitle}>Search Recipes</Text>
                <Text style={styles.actionSubtitle}>By ingredients</Text>
              </Pressable>
            </Link>

            <Pressable style={styles.actionCard} onPress={loadRandomRecipe}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.secondary }]}>
                <FontAwesome name="random" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Surprise Me</Text>
              <Text style={styles.actionSubtitle}>Random recipe</Text>
            </Pressable>
          </View>
        </View>

        {/* Bottom spacing to avoid gesture bar overlap */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  searchRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
  },
  searchButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipText: {
    textTransform: 'capitalize',
    color: Colors.textDark,
    fontWeight: '600',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  recipeImage: {
    width: '100%',
    height: 240,
  },
  recipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  recipeInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  recipeBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  recipeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginLeft: 6,
  },
  viewRecipeButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  viewRecipeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 140 : 120, // Extra space for iOS devices with home indicator
  },
});