import { memo, useState, useCallback } from "react";
import { Link } from "react-router-dom";

// Memoized recipe card component for better performance
const RecipeCard = memo(({ recipe }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <article
      className="bg-food-surface rounded-xl shadow-food overflow-hidden hover:shadow-food-lg hover:scale-105 transition-all duration-300 border border-food group"
      role="article"
      aria-labelledby={`recipe-title-${recipe.idMeal}`}
    >
      <div className="relative overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-48 bg-food-surface-light animate-pulse flex items-center justify-center">
            <span className="text-4xl text-gray-500">🍽️</span>
          </div>
        )}

        {!imageError ? (
          <img
            src={recipe.strMealThumb}
            alt={`${recipe.strMeal} recipe`}
            className={`w-full h-48 object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0 absolute"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-food-surface-light flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl text-gray-500 block mb-2">🍽️</span>
              <span className="text-xs text-gray-400">Image unavailable</span>
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
          🍴 Recipe
        </div>

        {/* Category badge if available */}
        {recipe.strCategory && (
          <div className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded-full text-xs font-semibold">
            {recipe.strCategory}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4">
        <h3
          id={`recipe-title-${recipe.idMeal}`}
          className="text-lg font-semibold text-white line-clamp-2 min-h-[3.5rem] group-hover:text-primary-light transition-colors"
        >
          {recipe.strMeal}
        </h3>

        {/* Recipe metadata */}
        {recipe.strArea && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>🌍</span>
            <span>{recipe.strArea} Cuisine</span>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Link
            to={`/recipe/${recipe.idMeal}`}
            className="flex-1"
            aria-label={`View ${recipe.strMeal} recipe details`}
          >
            <button className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 font-semibold flex items-center justify-center gap-1">
              <span aria-hidden="true">📖</span>
              View Recipe
            </button>
          </Link>

          {recipe.strYoutube && (
            <a
              href={recipe.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-300 font-semibold flex items-center justify-center"
              title={`Watch ${recipe.strMeal} video tutorial`}
              aria-label={`Watch ${recipe.strMeal} video tutorial`}
            >
              <span aria-hidden="true">🎥</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
});

RecipeCard.displayName = "RecipeCard";

// Main RecipeList component
const RecipeList = memo(({ recipes, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="bg-food-surface rounded-xl overflow-hidden border border-food">
            <div className="w-full h-48 bg-food-surface-light animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-food-surface-light rounded animate-pulse"></div>
              <div className="h-4 bg-food-surface-light rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-food-surface-light rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <span className="text-6xl mb-4 block" role="img" aria-label="empty plate">
          🍽️
        </span>
        <p className="text-gray-400 text-lg">No recipes found</p>
        <p className="text-gray-500 text-sm mt-2">Try searching for something delicious!</p>
      </div>
    );
  }

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6"
      role="region"
      aria-label="Recipe list"
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.idMeal} recipe={recipe} />
      ))}
    </section>
  );
});

RecipeList.displayName = "RecipeList";

export default RecipeList;

