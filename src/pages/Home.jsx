import { useState, useEffect, useCallback, useMemo, memo } from "react";
import SearchBar from "../components/SearchBar";
import RecipeList from "../components/RecipeList";
import Loader from "../components/Loader";
import { getRandomMeals } from "../utils/api";

const Home = memo(() => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchMode, setSearchMode] = useState(false);
  const [error, setError] = useState(null);

  const maxPages = 5;

  // Fetch random meals function with improved error handling
  const fetchRandomMeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const randomMeals = await getRandomMeals(8);

      if (randomMeals.length === 0) {
        setError("Unable to load recipes. Please try again.");
      } else {
        setRecipes(randomMeals);
      }
    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error("Error fetching random meals:", err);
        setError("Failed to load recipes. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for fetching random meals
  useEffect(() => {
    if (!searchMode) {
      fetchRandomMeals();
    }
  }, [currentPage, searchMode, fetchRandomMeals]);

  // Pagination controls with validation
  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > maxPages || page === currentPage || searchMode || loading) {
      return;
    }

    setCurrentPage(page);

    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage, searchMode, loading, maxPages]);

  // Handle search with proper state management
  const handleSearch = useCallback((searchRecipes) => {
    setRecipes(searchRecipes);
    setSearchMode(true);
    setCurrentPage(1);
    setError(null);
  }, []);

  // Reset to random recipes
  const resetToRandom = useCallback(() => {
    setSearchMode(false);
    setCurrentPage(1);
    setError(null);
  }, []);

  // Retry function for error recovery
  const retryFetch = useCallback(() => {
    if (!searchMode) {
      fetchRandomMeals();
    }
  }, [searchMode, fetchRandomMeals]);

  // Memoized pagination buttons
  const paginationButtons = useMemo(() => {
    return Array.from({ length: maxPages }, (_, idx) => {
      const page = idx + 1;
      return (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          disabled={loading}
          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
            currentPage === page
              ? 'bg-primary text-white shadow-food border-2 border-primary-light'
              : 'bg-food-surface text-gray-300 border border-food hover:bg-primary/20 hover:text-white disabled:opacity-50'
          }`}
        >
          {page}
        </button>
      );
    });
  }, [currentPage, handlePageChange, loading, maxPages]);

  return (
    <div className="min-h-screen text-white p-6">
      <div className="container mx-auto">
        {/* Hero Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-light mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">👨‍🍳</span>
            Discover Amazing Recipes
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Explore thousands of delicious recipes from around the world. From quick snacks to gourmet meals, find your next culinary adventure here!
          </p>
        </header>

        {/* Search Bar with Back Button */}
        <div className="max-w-2xl mx-auto">
          <SearchBar setRecipes={handleSearch} />

          {/* Back to Featured Recipes Button */}
          {searchMode && (
            <div className="flex justify-center mt-4">
              <button
                onClick={resetToRandom}
                className="px-6 py-2 bg-secondary hover:bg-secondary-light text-white rounded-lg font-medium transition-all shadow-food flex items-center gap-2"
              >
                <span>🔄</span>
                Back to Featured Recipes
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto mt-8 text-center">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <span className="text-4xl block mb-3">⚠️</span>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={retryFetch}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        )}

        {/* Content Section */}
        {!loading && !error && (
          <>
            {/* Recipes List */}
            <section className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-primary-light flex items-center gap-2">
                  <span className="text-2xl">🍽️</span>
                  {searchMode ? 'Search Results' : `Featured Recipes - Page ${currentPage}`}
                </h2>
                <p className="text-gray-400 mt-1">
                  {searchMode
                    ? 'Found recipes matching your search'
                    : 'Handpicked delicious recipes just for you'
                  }
                </p>
              </div>
              <RecipeList recipes={recipes} />
            </section>

            {/* Pagination Controls - Only show for random recipes */}
            {!searchMode && recipes.length > 0 && (
              <nav
                className="flex justify-center items-center mt-12 mb-8"
              >
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 rounded-lg bg-food-surface border border-primary text-white font-medium transition-all
                               hover:bg-primary hover:border-primary-light disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:bg-food-surface disabled:hover:border-primary flex items-center gap-2"
                  >
                    <span>⬅️</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-4">
                    {paginationButtons}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === maxPages || loading}
                    className="px-4 py-2 rounded-lg bg-food-surface border border-primary text-white font-medium transition-all
                               hover:bg-primary hover:border-primary-light disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:bg-food-surface disabled:hover:border-primary flex items-center gap-2"
                  >
                    <span>➡️</span>
                  </button>
                </div>
              </nav>
            )}

            {/* Page Info */}
            {!searchMode && recipes.length > 0 && (
              <div className="text-center text-gray-400 text-sm mb-4">
                Page {currentPage} of {maxPages} • Discover new recipes on each page
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
