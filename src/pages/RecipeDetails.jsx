// src/pages/RecipeDetails.jsx
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMealById } from "../utils/api";
import Modal from "../components/Modal";
import Loader from "../components/Loader";

const RecipeDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized ingredients processing
  const ingredients = useMemo(() => {
    if (!meal) return [];

    return Array.from({ length: 20 }, (_, i) => i + 1)
      .map(num => {
        const ingredient = meal[`strIngredient${num}`];
        const measure = meal[`strMeasure${num}`];
        return ingredient?.trim() ? {
          id: num,
          ingredient: ingredient.trim(),
          measure: measure?.trim() || ''
        } : null;
      })
      .filter(Boolean);
  }, [meal]);

  // Memoized tags processing
  const tags = useMemo(() => {
    return meal?.strTags
      ? meal.strTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
  }, [meal?.strTags]);

  // Close handler
  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Fetch meal data with improved error handling
  useEffect(() => {
    if (!id) {
      setError("Invalid recipe ID");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchMeal = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMealById(id, controller.signal);

        if (!data) {
          setError("Recipe not found");
        } else {
          setMeal(data);
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error("Failed to load recipe:", err);
          setError("Failed to load recipe. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();

    return () => {
      controller.abort();
    };
  }, [id]);

  // Retry function
  const retryFetch = useCallback(() => {
    if (id) {
      const controller = new AbortController();
      const fetchMeal = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getMealById(id, controller.signal);
          setMeal(data || null);
        } catch (err) {
          if (err.name !== 'CanceledError') {
            setError("Failed to load recipe. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchMeal();
    }
  }, [id]);

  // Modal content based on state
  const modalContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      );
    }

    if (error || !meal) {
      return (
        <div className="text-center py-8">
          <span className="text-6xl block mb-4" role="img" aria-label="error">😔</span>
          <p className="text-lg text-white mb-4">
            {error || "Recipe not found"}
          </p>
          {error && (
            <button
              onClick={retryFetch}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all shadow-food"
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    return (
      <>
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {meal.strCategory && (
            <span className="px-3 py-1 rounded-full text-sm bg-secondary text-white border border-secondary-light flex items-center gap-1">
              <span role="img" aria-label="category">🏷️</span>
              {meal.strCategory}
            </span>
          )}
          {meal.strArea && (
            <span className="px-3 py-1 rounded-full text-sm bg-primary text-white border border-primary-light flex items-center gap-1">
              <span role="img" aria-label="region">🌍</span>
              {meal.strArea}
            </span>
          )}
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full text-xs bg-food-surface-light text-gray-300 border border-food"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Image and Action Buttons */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={meal.strMealThumb}
              alt={`${meal.strMeal} recipe`}
              className="w-full max-w-md rounded-xl shadow-food-lg border-2 border-primary object-cover mb-4"
              loading="eager"
            />
            <div className="absolute -top-2 -right-2 bg-accent text-white p-2 rounded-full shadow-food">
              <span className="text-2xl" role="img" aria-label="meal">🍽️</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-all text-sm shadow-food flex items-center gap-2"
                aria-label={`Watch ${meal.strMeal} video tutorial`}
              >
                <span role="img" aria-hidden="true">🎥</span>
                Watch Tutorial
              </a>
            )}
            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary hover:bg-secondary-light text-white rounded-lg font-medium transition-all text-sm shadow-food flex items-center gap-2"
                aria-label={`View ${meal.strMeal} source`}
              >
                <span role="img" aria-hidden="true">🔗</span>
                Source
              </a>
            )}
          </div>
        </div>

        {/* Ingredients Section */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-light">
            <span className="text-2xl" role="img" aria-label="ingredients">🥘</span>
            Ingredients ({ingredients.length})
          </h3>
          {ingredients.length === 0 ? (
            <p className="text-gray-400 italic text-sm">No ingredients listed.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ingredients.map(({ id, ingredient, measure }) => (
                <div
                  key={id}
                  className="bg-food-surface-light border border-primary/30 rounded-lg px-3 py-2 hover:bg-primary/10 hover:border-primary/50 transition-all"
                >
                  <div className="text-white text-xs font-semibold truncate mb-1">
                    {ingredient}
                  </div>
                  {measure && (
                    <div className="text-xs text-primary-light truncate font-medium">
                      {measure}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Instructions */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary-light">
            <span className="text-2xl" role="img" aria-label="instructions">📝</span>
            Instructions
          </h3>
          <div className="bg-food-surface-light border-2 border-primary/30 rounded-xl p-6 shadow-food">
            <p className="text-sm md:text-base text-gray-200 leading-relaxed whitespace-pre-line">
              {meal.strInstructions}
            </p>
          </div>
        </section>
      </>
    );
  }, [loading, error, meal, ingredients, tags, retryFetch]);

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={meal ? meal.strMeal : "Recipe Details"}
    >
      {modalContent}
    </Modal>
  );
});

RecipeDetails.displayName = 'RecipeDetails';

export default RecipeDetails;
