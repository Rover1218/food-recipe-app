// Utility to fetch recipes from TheMealDB API
export async function fetchRandomRecipe() {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
}

export async function fetchRecipesByIngredient(ingredient: string) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await res.json();
    return data.meals || [];
}

export async function fetchRecipeById(id: string) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
}
