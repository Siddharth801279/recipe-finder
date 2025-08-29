// src/pages/RecipeDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMealById } from "../utils/api";

export default function RecipeDetails() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getMealById(id);
      setMeal(data || null);
      setLoading(false);
    })();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );

  if (!meal)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p className="text-lg">Recipe not found ❌</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">{meal.strMeal}</h2>

        {/* Flex container: Image left, Ingredients right */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Image + Watch Tutorial button */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full md:w-80 rounded-xl shadow-lg border border-gray-700"
            />
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                Watch Tutorial
              </a>
            )}
          </div>

          {/* Ingredients */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-3 border-b border-gray-700 pb-2">
              Ingredients
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
                const ing = meal[`strIngredient${n}`];
                const mea = meal[`strMeasure${n}`];
                return ing && ing.trim() ? (
                  <li key={n}>
                    <span className="text-white">{ing}</span> — {mea}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-2xl font-semibold mb-3 border-b border-gray-700 pb-2">
            Instructions
          </h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {meal.strInstructions}
          </p>
        </div>
      </div>
    </div>
  );
}
