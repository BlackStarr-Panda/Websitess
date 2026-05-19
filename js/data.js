/**
 * data.js
 * Responsible for fetching recipe data from the JSON file.
 * Exposes a single async function: loadRecipes()
 */

/**
 * Fetches all recipes from the local JSON file.
 * @returns {Promise<Array>} Array of recipe objects
 */
async function loadRecipes() {
  try {
    const response = await fetch('./data/recipes.json');

    if (!response.ok) {
      throw new Error(`Failed to load recipes: ${response.status}`);
    }

    const recipes = await response.json();
    return recipes;
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
}
