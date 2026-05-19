/**
 * components.js
 * Contains reusable HTML-generating functions (components).
 * Each function returns an HTML string to be injected into the DOM.
 */

/**
 * Renders a single recipe card.
 * @param {Object} recipe - A recipe object from the JSON data
 * @returns {string} HTML string for the recipe card
 */
function renderRecipeCard(recipe) {
  return `
    <article class="recipe-card" data-id="${recipe.id}" role="button" tabindex="0" aria-label="View ${recipe.name} recipe">
      <div class="card-image-wrapper">
        <img 
          src="${recipe.image}" 
          alt="${recipe.name}" 
          class="card-image"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'"
        />
        <span class="card-category">${recipe.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${recipe.name}</h3>
        <p class="card-description">${recipe.description}</p>
        <div class="card-footer">
          <span class="card-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            ${recipe.cookingTime}
          </span>
          <span class="card-ingredients-count">${recipe.ingredients.length} ingredients</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renders the full recipe detail modal content.
 * @param {Object} recipe - A recipe object from the JSON data
 * @returns {string} HTML string for the modal body
 */
function renderRecipeModal(recipe) {
  // Build the ingredients list HTML
  const ingredientsList = recipe.ingredients
    .map(ing => `<li class="ingredient-item"><span class="ingredient-dot"></span>${ing}</li>`)
    .join('');

  // Build the steps list HTML
  const stepsList = recipe.steps
    .map((step, index) => `
      <li class="step-item">
        <span class="step-number">${index + 1}</span>
        <p class="step-text">${step}</p>
      </li>
    `)
    .join('');

  return `
    <div class="modal-image-wrapper">
      <img 
        src="${recipe.image}" 
        alt="${recipe.name}" 
        class="modal-image"
        onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'"
      />
      <div class="modal-image-overlay">
        <span class="modal-category-badge">${recipe.category}</span>
        <h2 class="modal-title">${recipe.name}</h2>
        <div class="modal-meta">
          <span class="modal-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            ${recipe.cookingTime}
          </span>
          <span class="modal-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            ${recipe.ingredients.length} ingredients
          </span>
        </div>
      </div>
    </div>

    <div class="modal-content-body">
      <p class="modal-description">${recipe.description}</p>

      <section class="recipe-section">
        <h3 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2l1.5 15.5L12 22l7.5-4.5L21 2"/></svg>
          Ingredients
        </h3>
        <ul class="ingredients-list">
          ${ingredientsList}
        </ul>
      </section>

      <section class="recipe-section">
        <h3 class="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
          Steps
        </h3>
        <ol class="steps-list">
          ${stepsList}
        </ol>
      </section>
    </div>
  `;
}

/**
 * Renders the category filter buttons.
 * @param {Array<string>} categories - Array of unique category strings
 * @param {string} activeCategory - Currently selected category
 * @returns {string} HTML string of filter buttons
 */
function renderCategoryFilters(categories, activeCategory = 'All') {
  // Always include "All" as the first option
  const allCategories = ['All', ...categories];

  return allCategories
    .map(cat => `
      <button 
        class="filter-btn ${cat === activeCategory ? 'active' : ''}" 
        data-category="${cat}"
        aria-pressed="${cat === activeCategory}"
      >
        ${cat}
      </button>
    `)
    .join('');
}

/**
 * Renders a "no results" empty state message.
 * @param {string} query - The search term that returned no results
 * @returns {string} HTML string for the empty state
 */
function renderEmptyState(query = '') {
  return `
    <div class="empty-state">
      <div class="empty-icon">🍽️</div>
      <h3 class="empty-title">No recipes found</h3>
      <p class="empty-message">
        ${query
          ? `We couldn't find any recipes matching "<strong>${query}</strong>". Try a different keyword or category.`
          : 'No recipes available in this category.'
        }
      </p>
    </div>
  `;
}
