document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const limitInput = document.getElementById("limit-input");
  const searchButton = document.getElementById("search-button");
  const resultsContainer = document.getElementById("results-container");
  const loader = document.getElementById("loader");
  let overlay;

  // Create overlay element
  function createOverlay() {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);

    // Close expanded card when clicking overlay
    overlay.addEventListener("click", () => {
      const expandedCard = document.querySelector(".recipe-card.expanded");
      if (expandedCard) {
        expandedCard.classList.remove("expanded");
        overlay.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Create overlay on page load
  createOverlay();

  // Add event listeners
  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Event delegation for recipe cards
  resultsContainer.addEventListener("click", (e) => {
    // Handle close button click
    if (e.target.classList.contains("close-button")) {
      const card = e.target.closest(".recipe-card");
      if (card) {
        card.classList.remove("expanded");
        overlay.classList.remove("active");
        document.body.style.overflow = "auto";
        e.stopPropagation();
      }
      return;
    }

    // Handle card click
    const card = e.target.closest(".recipe-card");
    if (card) {
      // If clicking on an already expanded card, do nothing
      if (card.classList.contains("expanded")) {
        return;
      }

      // Close any currently expanded card
      const expandedCard = resultsContainer.querySelector(
        ".recipe-card.expanded"
      );
      if (expandedCard) {
        expandedCard.classList.remove("expanded");
      }

      // Expand the clicked card
      card.classList.add("expanded");

      // Show overlay
      overlay.classList.add("active");

      // Prevent body scrolling when card is expanded
      document.body.style.overflow = "hidden";

      // Store original position for animation reference
      card.setAttribute("data-original-scroll", window.scrollY);
    }
  });

  // Handle escape key to close expanded card
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const expandedCard = document.querySelector(".recipe-card.expanded");
      if (expandedCard) {
        expandedCard.classList.remove("expanded");
        overlay.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    }
  });

  async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Please enter a search query");
      return;
    }

    const limit = parseInt(limitInput.value) || 5;

    // Show loader, hide results
    loader.style.display = "block";
    resultsContainer.innerHTML = "";

    try {
      const response = await fetch("/recipes/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, limit }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const recipes = await response.json();
      displayResults(recipes);
    } catch (error) {
      console.error("Search error:", error);
      resultsContainer.innerHTML = `
                <div class="error">
                    <p>Error performing search: ${error.message}</p>
                </div>
            `;
    } finally {
      loader.style.display = "none";
    }
  }

  function displayResults(recipes) {
    if (!recipes || recipes.length === 0) {
      resultsContainer.innerHTML =
        '<div class="recipe-grid"><p class="no-results">No recipes found matching your search.</p></div>';
      return;
    }

    // Create a grid container
    const gridHtml = '<div class="recipe-grid"></div>';
    resultsContainer.innerHTML = gridHtml;
    const grid = resultsContainer.querySelector(".recipe-grid");

    recipes.forEach((recipe) => {
      const recipeCard = document.createElement("div");
      recipeCard.className = "recipe-card";

      recipeCard.innerHTML = `
        <button class="close-button">✕</button>
        <div class="recipe-content">
          <h2 class="recipe-title">${escapeHtml(recipe.title)}</h2>
          ${recipe.description ? `<p class="recipe-description">${escapeHtml(recipe.description)}</p>` : ""}
          
          <div class="recipe-details">
            <span class="recipe-detail">Prep: ${recipe.prepTime} min</span>
            <span class="recipe-detail">Cook: ${recipe.cookTime} min</span>
            <span class="recipe-detail">Servings: ${recipe.servings}</span>
            ${recipe.difficulty ? `<span class="recipe-detail">Difficulty: ${escapeHtml(recipe.difficulty)}</span>` : ""}
            ${recipe.cuisine ? `<span class="recipe-detail">Cuisine: ${escapeHtml(recipe.cuisine)}</span>` : ""}
          </div>
          
          <div class="recipe-ingredients">
            <h3>Ingredients</h3>
            <ul class="ingredient-list">
              ${recipe.ingredients.map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`).join("")}
            </ul>
          </div>
          
          <div class="recipe-instructions">
            <h3>Instructions</h3>
            <p>${escapeHtml(recipe.instructions)}</p>
          </div>
          
          <div class="expand-indicator">Click to expand</div>
        </div>
      `;

      grid.appendChild(recipeCard);
    });
  }

  // Helper function to escape HTML to prevent XSS
  function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
