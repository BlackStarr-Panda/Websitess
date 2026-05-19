/**
 * app.js
 * Main application controller.
 * Handles: initialization, search, filter, modal open/close, and rendering.
 */

// ─────────────────────────────────────────────
// App State
// ─────────────────────────────────────────────
const state = {
  allRecipes: [],         // All recipes loaded from JSON
  filtered: [],           // Currently visible recipes after filter/search
  activeCategory: 'All',  // Currently selected category
  searchQuery: '',        // Current search input
};

// ─────────────────────────────────────────────
// DOM References
// ─────────────────────────────────────────────
const recipesGrid    = document.getElementById('recipes-grid');
const searchInput    = document.getElementById('search-input');
const filterContainer = document.getElementById('filter-container');
const resultsCount   = document.getElementById('results-count');
const modal          = document.getElementById('recipe-modal');
const modalBody      = document.getElementById('modal-body');
const modalClose     = document.getElementById('modal-close');

// ─────────────────────────────────────────────
// Initialize App
// ─────────────────────────────────────────────
async function init() {
  // Load recipe data from JSON via data.js
  state.allRecipes = await loadRecipes();
  state.filtered = [...state.allRecipes];

  if (state.allRecipes.length === 0) {
    recipesGrid.innerHTML = renderEmptyState();
    return;
  }

  // Extract unique categories from the recipes
  const categories = [...new Set(state.allRecipes.map(r => r.category))];

  // Render category filters and recipe cards
  renderFilters(categories);
  renderRecipes();
  bindEvents();
}

// ─────────────────────────────────────────────
// Render Functions
// ─────────────────────────────────────────────

/** Renders recipe cards into the grid */
function renderRecipes() {
  if (state.filtered.length === 0) {
    recipesGrid.innerHTML = renderEmptyState(state.searchQuery);
  } else {
    recipesGrid.innerHTML = state.filtered
      .map(recipe => renderRecipeCard(recipe))
      .join('');
  }

  // Update the results count display
  updateResultsCount();
}

/** Renders the category filter buttons */
function renderFilters(categories) {
  filterContainer.innerHTML = renderCategoryFilters(categories, state.activeCategory);
}

/** Updates the "Showing X recipes" text */
function updateResultsCount() {
  const count = state.filtered.length;
  resultsCount.textContent = `${count} recipe${count !== 1 ? 's' : ''} found`;
}

// ─────────────────────────────────────────────
// Filtering & Search Logic
// ─────────────────────────────────────────────

/** 
 * Central filter function — applies both search and category filters.
 * Called whenever search input or category changes.
 */
function applyFilters() {
  const query = state.searchQuery.toLowerCase().trim();
  const category = state.activeCategory;

  state.filtered = state.allRecipes.filter(recipe => {
    // Check if recipe matches the search query (by name)
    const matchesSearch = query === '' || recipe.name.toLowerCase().includes(query);

    // Check if recipe matches the active category
    const matchesCategory = category === 'All' || recipe.category === category;

    return matchesSearch && matchesCategory;
  });

  renderRecipes();
}

// ─────────────────────────────────────────────
// Modal Functions
// ─────────────────────────────────────────────

/** Opens the recipe detail modal for a given recipe ID */
function openModal(recipeId) {
  const recipe = state.allRecipes.find(r => r.id === recipeId);
  if (!recipe) return;

  // Render modal content using the component function
  modalBody.innerHTML = renderRecipeModal(recipe);

  // Show modal and prevent background scroll
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Move focus to the close button for accessibility
  modalClose.focus();
}

/** Closes the recipe detail modal */
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────────
// Event Binding
// ─────────────────────────────────────────────
function bindEvents() {

  // Search input — filter as user types
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    applyFilters();
  });

  // Category filter buttons — event delegation on the container
  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // Update active state
    state.activeCategory = btn.dataset.category;

    // Re-render filter buttons to reflect new active state
    const categories = [...new Set(state.allRecipes.map(r => r.category))];
    renderFilters(categories);

    applyFilters();
  });

  // Recipe card clicks — event delegation on the grid
  recipesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.recipe-card');
    if (!card) return;
    openModal(Number(card.dataset.id));
  });

  // Keyboard support for recipe cards (Enter / Space)
  recipesGrid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.recipe-card');
      if (!card) return;
      e.preventDefault();
      openModal(Number(card.dataset.id));
    }
  });

  // Close modal via close button
  modalClose.addEventListener('click', closeModal);

  // Close modal when clicking the backdrop (outside the modal box)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

// ─────────────────────────────────────────────
// Start the app when DOM is ready
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
