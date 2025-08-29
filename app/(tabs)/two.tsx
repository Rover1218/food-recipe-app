import React, { useState, useEffect } from 'react';
import {
    TextInput,
    Pressable,
    ActivityIndicator,
    FlatList,
    Image,
    Dimensions,
    ScrollView,
    RefreshControl
} from 'react-native';
import { Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { fetchRecipesByIngredient } from '../../utils/api';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
// Calculate card width for 2-column grid with proper spacing
const CARD_WIDTH = Math.floor((width - 80) / 2); // More conservative width calculation

interface Recipe {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory?: string;
    strArea?: string;
}

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ q?: string }>();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const search = async (ingredient: string) => {
        if (!ingredient.trim()) return;

        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const data = await fetchRecipesByIngredient(ingredient);
            setResults(data);
        } catch (e) {
            setError('Failed to fetch recipes.');
        } finally {
            setLoading(false);
        }
    };

    // Handle route params
    useEffect(() => {
        const initial = (params?.q || '').toString();
        if (initial && !searched && query === '') {
            setQuery(initial);
            setTimeout(() => search(initial), 0);
        }
    }, []);

    // React to param changes
    useEffect(() => {
        const incoming = (params?.q || '').toString();
        if (incoming && incoming !== query) {
        
            setQuery(incoming);
            setSearched(false);
            setResults([]);
            setError(null);
        }
        if (!incoming && query) {
            setQuery('');
            setSearched(false);
            setResults([]);
            setError(null);
        }
    }, [params?.q]);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setSearched(false);
            setResults([]);
            setError(null);
            return;
        }
        const id = setTimeout(() => {
            search(query);
        }, 400);
        return () => clearTimeout(id);
    }, [query]);

    const onRefresh = async () => {
        if (!query.trim()) return;
        setRefreshing(true);
        try {
            await search(query);
        } finally {
            setRefreshing(false);
        }
    };

    const renderRecipeItem = ({ item, index }: { item: Recipe; index: number }) => (
        <Link href={{ pathname: '/recipe-details', params: { id: item.idMeal } }} asChild>
            <Pressable
                style={{
                    width: CARD_WIDTH,
                    maxWidth: CARD_WIDTH,
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    overflow: 'hidden',
                    marginBottom: 20,
                    marginHorizontal: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 4,
                    borderWidth: 1,
                    borderColor: '#f1f5f9'
                }}
            >
                {/* Image */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: item.strMealThumb }}
                        style={{ width: '100%', aspectRatio: 1 }}
                        resizeMode="cover"
                    />
                </View>
                
                {/* Content */}
                <View style={{ padding: 16, minHeight: 100 }}>
                    <Text 
                        style={{
                            color: '#0f172a',
                            fontWeight: '700',
                            fontSize: 15,
                            lineHeight: 20,
                            marginBottom: 12,
                            minHeight: 40
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item.strMeal}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View style={{
                            backgroundColor: '#dbeafe',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 20
                        }}>
                            <Text style={{ color: '#1d4ed8', fontWeight: '600', fontSize: 12 }}>
                                {item.strCategory || 'Main Course'}
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </Link>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={{ 
                backgroundColor: '#ffffff', 
                alignItems: 'center', 
                borderBottomWidth: 1, 
                borderBottomColor: '#f1f5f9', 
                paddingHorizontal: 24,
                paddingTop: insets.top + 16, 
                paddingBottom: 32 
            }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 4 }}>Recipe Search</Text>
                <Text style={{ fontSize: 16, color: '#64748b' }}>Find recipes by ingredients</Text>
            </View>

            <ScrollView
                style={{ flex: 1, backgroundColor: '#f8fafc' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 56 }}
                bounces={false}
                overScrollMode="never"
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3B82F6']}
                        tintColor="#3B82F6"
                    />
                }
            >
                {/* Search Section */}
                <View style={{ paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#f8fafc' }}>
                    <View style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: '#e2e8f0',
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3
                    }}>
                        <View style={{ marginRight: 16 }}>
                            <FontAwesome name="search" size={18} color="#6B7280" />
                        </View>
                        <TextInput
                            placeholder="Search by ingredient..."
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={() => search(query)}
                            style={{ flex: 1, fontSize: 16, color: '#0f172a', fontWeight: '500' }}
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {query.length > 0 && (
                            <Pressable
                                onPress={() => {
                                    setQuery('');
                                    setSearched(false);
                                    setResults([]);
                                    setError(null);
                                }}
                                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            >
                                <FontAwesome name="times" size={16} color="#9CA3AF" />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Popular Ingredients */}
                {!searched && (
                    <View style={{ paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#f8fafc' }}>
                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#0f172a', marginBottom: 20 }}>Popular Ingredients</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                            {['chicken', 'beef', 'pasta', 'salmon', 'rice', 'tomato'].map((ingredient) => (
                                <Pressable
                                    key={ingredient}
                                    style={{
                                        backgroundColor: '#f1f5f9',
                                        borderWidth: 1,
                                        borderColor: '#cbd5e1',
                                        paddingHorizontal: 20,
                                        paddingVertical: 12,
                                        borderRadius: 25,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 2
                                    }}
                                    onPress={() => {
                                        setQuery(ingredient);
                                        search(ingredient);
                                    }}
                                >
                                    <Text style={{ color: '#475569', fontWeight: '600', textTransform: 'capitalize', fontSize: 14 }}>{ingredient}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* Results Section */}
                <View style={{ paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#f8fafc' }}>
                    {loading ? (
                        <View style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 16,
                            padding: 60,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 2,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text style={{ color: '#64748b', marginTop: 16, fontWeight: '500', fontSize: 16 }}>Finding recipes...</Text>
                        </View>
                    ) : error ? (
                        <View style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 16,
                            padding: 60,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 2,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            <Text style={{ fontSize: 48, marginBottom: 16 }}>😞</Text>
                            <Text style={{ color: '#0f172a', fontWeight: '700', fontSize: 18, marginBottom: 8 }}>Something went wrong</Text>
                            <Text style={{ color: '#64748b', textAlign: 'center', marginBottom: 24, fontSize: 14 }}>{error}</Text>
                            <Pressable 
                                style={{
                                    backgroundColor: '#3b82f6',
                                    paddingHorizontal: 24,
                                    paddingVertical: 12,
                                    borderRadius: 12
                                }}
                                onPress={() => search(query)}
                            >
                                <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>Try Again</Text>
                            </Pressable>
                        </View>
                    ) : searched && results.length > 0 ? (
                        <>
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ color: '#0f172a', fontWeight: '800', fontSize: 24, marginBottom: 4 }}>
                                    Found {results.length} recipes
                                </Text>
                                <Text style={{ color: '#64748b', fontWeight: '500', fontSize: 16 }}>
                                    with "{query}"
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: 4 }}>
                                <FlatList
                                    data={results}
                                    renderItem={renderRecipeItem}
                                    keyExtractor={(item) => item.idMeal}
                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                    removeClippedSubviews={false}
                                    initialNumToRender={results.length}
                                    windowSize={results.length > 0 ? Math.max(5, results.length) : 5}
                                    contentContainerStyle={{ paddingTop: 16 }}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                />
                            </View>
                        </>
                    ) : searched && results.length === 0 ? (
                        <View style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 16,
                            padding: 80,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 2,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
                            <Text style={{ color: '#0f172a', fontWeight: '700', fontSize: 20, marginBottom: 12, textAlign: 'center' }}>No recipes found</Text>
                            <Text style={{ color: '#64748b', textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
                                Try searching with a different ingredient.
                            </Text>
                        </View>
                    ) : (
                        <View style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 16,
                            padding: 80,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 2,
                            borderWidth: 1,
                            borderColor: '#f1f5f9'
                        }}>
                            <Text style={{ fontSize: 48, marginBottom: 16 }}>🍳</Text>
                            <Text style={{ color: '#0f172a', fontWeight: '700', fontSize: 20, marginBottom: 12, textAlign: 'center' }}>Ready to cook?</Text>
                            <Text style={{ color: '#64748b', textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
                                Search for recipes using your favorite ingredients.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
