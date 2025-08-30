import React, { useState, memo } from "react";
import { getMealsBySearch } from "../utils/api";

const SearchBar = memo(({ setRecipes }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (searchQuery) => {
    if (!searchQuery?.trim()) {
      setRecipes([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await getMealsBySearch(searchQuery.trim());
      setRecipes(results);
      if (results.length === 0) {
        setError(
          `No recipes found for "${searchQuery}". Try a different search term.`
        );
      }
    } catch {
      setError("Failed to search recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    performSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    setError(null);
    setRecipes([]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center px-4"
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for delicious recipes..."
            value={query}
            onChange={handleInputChange}
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-food-surface text-white border-2 border-food placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-food transition-all"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all shadow-food
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center min-w-[120px]"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Searching...
            </>
          ) : (
            <>
              <span>🍳</span>
              Search
            </>
          )}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div className="mt-3 text-center text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Search hint */}
      {!query && !loading && (
        <div className="mt-3 text-center text-gray-400 text-sm">
          Try searching for ingredients like "chicken", "pasta", or dish names like
          "pizza"
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
