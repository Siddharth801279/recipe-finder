import { Link } from "react-router-dom";

export default function RecipeList({ recipes }) {
  if (!recipes || recipes.length === 0)
    return <p className="text-center text-gray-400 mt-6">No recipes found</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.idMeal}
          className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-transform duration-300"
        >
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">{recipe.strMeal}</h3>

            <div className="flex gap-2">
              {/* View Details Button */}
              <Link to={`/recipe/${recipe.idMeal}`} className="flex-1">
                <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 font-semibold">
                  View Details
                </button>
              </Link>

              {/* Watch Recipe Button */}
              {recipe.strYoutube && (
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold">
                    Watch Recipe
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
