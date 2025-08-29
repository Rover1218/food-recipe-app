import { View, Text, ScrollView, ActivityIndicator, Image, Pressable, Dimensions, StatusBar, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { fetchRecipeById } from '../utils/api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function RecipeDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    // Animation function
    const animateContent = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            setError('');
            fetchRecipeById(id as string)
                .then(data => {
                    setRecipe(data);
                    setTimeout(() => animateContent(), 100); // Start animation after a brief delay
                })
                .catch(() => setError('Failed to fetch recipe details.'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#f8fafc',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={{ marginTop: 16, fontSize: 16, color: '#64748b' }}>Loading recipe...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                backgroundColor: '#f8fafc'
            }}>
                <Text style={{
                    fontSize: 18,
                    color: '#ef4444',
                    textAlign: 'center',
                    marginBottom: 20
                }}>{error}</Text>
                <Pressable style={{
                    backgroundColor: '#3b82f6',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5
                }} onPress={() => { }}>
                    <Text style={{ color: '#ffffff', fontWeight: '600' }}>Try Again</Text>
                </Pressable>
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                backgroundColor: '#f8fafc'
            }}>
                <Text style={{
                    fontSize: 18,
                    color: '#ef4444',
                    textAlign: 'center',
                    marginBottom: 20
                }}>Recipe not found</Text>
                <Pressable style={{
                    backgroundColor: '#3b82f6',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5
                }} onPress={() => router.back()}>
                    <Text style={{ color: '#ffffff', fontWeight: '600' }}>Return to Previous Screen</Text>
                </Pressable>
            </View>
        );
    }

    // Parse ingredients from API response
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure && measure.trim() ? measure.trim() : ''
            });
        }
    }

    // Parse instructions
    const instructions = recipe.strInstructions
        ? recipe.strInstructions.split(/\r?\n/).filter((step: string) => step.trim())
        : [];

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header with image (parallax) */}
            <View style={{ height: height * 0.35, position: 'relative', overflow: 'hidden' }}>
                <Animated.Image
                    source={{ uri: recipe.strMealThumb }}
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [-120, 0, 200],
                                    outputRange: [-36, 0, 48],
                                    extrapolate: 'clamp'
                                })
                            },
                            {
                                scale: scrollY.interpolate({
                                    inputRange: [-140, 0],
                                    outputRange: [1.15, 1],
                                    extrapolateLeft: 'extend',
                                    extrapolateRight: 'clamp'
                                })
                            }
                        ]
                    }}
                    resizeMode="cover"
                />
                {/* Gradient overlay effect */}
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.15)'
                }} />
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '70%',
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }} />

                {/* Recipe title */}
                <View style={{
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    zIndex: 10
                }}>
                    <Text style={{
                        fontSize: 28,
                        fontWeight: '800',
                        color: '#ffffff',
                        marginBottom: 16,
                        textShadowColor: 'rgba(0,0,0,0.9)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 8,
                        lineHeight: 34,
                        letterSpacing: 0.5
                    }}>{recipe.strMeal}</Text>
                    <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                        <View style={{
                            backgroundColor: getCategoryColor(recipe.strCategory),
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)'
                        }}>
                            <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 13 }}>{recipe.strCategory}</Text>
                        </View>
                        <View style={{
                            backgroundColor: getCuisineColor(recipe.strArea),
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)'
                        }}>
                            <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 13 }}>{recipe.strArea}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Animated.ScrollView
                style={{
                    flex: 1,
                    backgroundColor: '#f8fafc'
                }}
                showsVerticalScrollIndicator={false}
                bounces
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            >
                <Animated.View
                    style={[
                        {
                            flex: 1,
                            backgroundColor: '#ffffff',
                            borderTopLeftRadius: 25,
                            borderTopRightRadius: 25,
                            marginTop: -18,
                            paddingTop: 34,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 5
                        },
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {/* Top spacer to prevent the first icon/header from feeling latched to the curve */}
                    <View style={{ height: 16 }} />

                    <View style={{ marginBottom: 28, paddingHorizontal: 20 }}>
                        <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            marginBottom: 18,
                            paddingBottom: 12,
                            borderBottomWidth: 2,
                            borderBottomColor: '#e2e8f0'
                        }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#3b82f6',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                                shadowColor: '#3b82f6',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 3
                            }}>
                                <FontAwesome name="list" size={18} color="#ffffff" />
                            </View>
                            <Text style={{ 
                                fontSize: 22, 
                                fontWeight: '700', 
                                color: '#0f172a',
                                letterSpacing: 0.3
                            }}>Ingredients</Text>
                        </View>
                        <View style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 16,
                            padding: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.08,
                            shadowRadius: 6,
                            elevation: 2,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            {ingredients.map((item, index) => (
                                <View key={index} style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    marginBottom: 16,
                                    paddingVertical: 4
                                }}>
                                    <View style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#3b82f6',
                                        marginTop: 8,
                                        marginRight: 12
                                    }} />
                                    <Text style={{
                                        flex: 1,
                                        fontSize: 16,
                                        lineHeight: 24,
                                        color: '#0f172a'
                                    }}>
                                        <Text style={{ fontWeight: '600' }}>{item.ingredient}</Text>
                                        {item.measure && <Text style={{ color: '#64748b', fontWeight: '400' }}> - {item.measure}</Text>}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginBottom: 28, paddingHorizontal: 20 }}>
                        <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            marginBottom: 18,
                            paddingBottom: 12,
                            borderBottomWidth: 2,
                            borderBottomColor: '#e2e8f0'
                        }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#10b981',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                                shadowColor: '#10b981',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 3
                            }}>
                                <FontAwesome name="cutlery" size={18} color="#ffffff" />
                            </View>
                            <Text style={{ 
                                fontSize: 22, 
                                fontWeight: '700', 
                                color: '#0f172a',
                                letterSpacing: 0.3
                            }}>Instructions</Text>
                        </View>
                        <View style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            padding: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            {instructions.length > 0 ? (
                                instructions.map((step: string, index: number) => (
                                    <View key={index} style={{
                                        flexDirection: 'row',
                                        marginBottom: 20,
                                        alignItems: 'flex-start'
                                    }}>
                                        <View style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 16,
                                            backgroundColor: '#3b82f6',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 16,
                                            marginTop: 2
                                        }}>
                                            <Text style={{
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                fontSize: 14
                                            }}>{index + 1}</Text>
                                        </View>
                                        <Text style={{
                                            flex: 1,
                                            fontSize: 16,
                                            lineHeight: 24,
                                            color: '#0f172a'
                                        }}>{step.trim()}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={{
                                    fontSize: 16,
                                    color: '#64748b',
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    padding: 20
                                }}>No instructions available for this recipe.</Text>
                            )}
                        </View>
                    </View>

                    {/* Additional Info Section */}
                    <View style={{ marginBottom: 28, paddingHorizontal: 20 }}>
                        <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            marginBottom: 18,
                            paddingBottom: 12,
                            borderBottomWidth: 2,
                            borderBottomColor: '#e2e8f0'
                        }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#8b5cf6',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                                shadowColor: '#8b5cf6',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 3
                            }}>
                                <FontAwesome name="info-circle" size={18} color="#ffffff" />
                            </View>
                            <Text style={{ 
                                fontSize: 22, 
                                fontWeight: '700', 
                                color: '#0f172a',
                                letterSpacing: 0.3
                            }}>Additional Info</Text>
                        </View>
                        <View style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            padding: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                                paddingBottom: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f1f5f9'
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>Preparation Time:</Text>
                                <Text style={{ fontSize: 16, color: '#3b82f6', fontWeight: '500' }}>30-40 minutes</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                                paddingBottom: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f1f5f9'
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>Cooking Time:</Text>
                                <Text style={{ fontSize: 16, color: '#3b82f6', fontWeight: '500' }}>45-60 minutes</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                                paddingBottom: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: '#f1f5f9'
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>Servings:</Text>
                                <Text style={{ fontSize: 16, color: '#3b82f6', fontWeight: '500' }}>4 people</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>Difficulty:</Text>
                                <Text style={{ fontSize: 16, color: '#3b82f6', fontWeight: '500' }}>Medium</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </Animated.View>
            </Animated.ScrollView>
        </View>
    );
}

// Helper function to get color for category tag
function getCategoryColor(category: string): string {
    const categoryMap: { [key: string]: string } = {
        'Beef': 'rgba(245, 101, 101, 0.9)', // red
        'Chicken': 'rgba(246, 173, 85, 0.9)', // orange
        'Dessert': 'rgba(237, 100, 166, 0.9)', // pink
        'Lamb': 'rgba(252, 129, 129, 0.9)', // light red
        'Miscellaneous': 'rgba(160, 174, 192, 0.9)', // gray
        'Pasta': 'rgba(159, 122, 234, 0.9)', // purple
        'Pork': 'rgba(246, 135, 179, 0.9)', // light pink
        'Seafood': 'rgba(56, 178, 172, 0.9)', // teal
        'Side': 'rgba(104, 211, 145, 0.9)', // green
        'Starter': 'rgba(99, 179, 237, 0.9)', // blue
        'Vegan': 'rgba(104, 211, 145, 0.9)', // green
        'Vegetarian': 'rgba(72, 187, 120, 0.9)', // darker green
        'Breakfast': 'rgba(246, 173, 85, 0.9)', // orange
        'Goat': 'rgba(237, 137, 54, 0.9)', // darker orange
    };

    return categoryMap[category] || 'rgba(108, 92, 231, 0.9)'; // default to purple
}

// Helper function to get color for cuisine tag
function getCuisineColor(cuisine: string): string {
    const cuisineMap: { [key: string]: string } = {
        'American': 'rgba(159, 122, 234, 0.9)', // purple
        'British': 'rgba(99, 179, 237, 0.9)', // blue
        'Canadian': 'rgba(237, 100, 166, 0.9)', // pink
        'Chinese': 'rgba(246, 135, 179, 0.9)', // light pink
        'Dutch': 'rgba(246, 173, 85, 0.9)', // orange
        'Egyptian': 'rgba(252, 129, 129, 0.9)', // light red
        'French': 'rgba(159, 122, 234, 0.9)', // purple
        'Greek': 'rgba(79, 209, 197, 0.9)', // turquoise
        'Indian': 'rgba(252, 129, 129, 0.9)', // light red
        'Irish': 'rgba(72, 187, 120, 0.9)', // green
        'Italian': 'rgba(160, 174, 192, 0.9)', // gray
        'Jamaican': 'rgba(246, 173, 85, 0.9)', // orange
        'Japanese': 'rgba(99, 179, 237, 0.9)', // blue
        'Kenyan': 'rgba(104, 211, 145, 0.9)', // light green
        'Malaysian': 'rgba(245, 101, 101, 0.9)', // red
        'Mexican': 'rgba(246, 173, 85, 0.9)', // orange
        'Moroccan': 'rgba(237, 137, 54, 0.9)', // darker orange
        'Russian': 'rgba(99, 179, 237, 0.9)', // blue
        'Spanish': 'rgba(246, 173, 85, 0.9)', // orange
        'Thai': 'rgba(104, 211, 145, 0.9)', // light green
        'Tunisian': 'rgba(252, 129, 129, 0.9)', // light red
        'Turkish': 'rgba(237, 137, 54, 0.9)', // darker orange
        'Vietnamese': 'rgba(104, 211, 145, 0.9)', // light green
        'Unknown': 'rgba(160, 174, 192, 0.9)', // gray
    };

    return cuisineMap[cuisine] || 'rgba(237, 137, 54, 0.9)'; // default to orange
}
