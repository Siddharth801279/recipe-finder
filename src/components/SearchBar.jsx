import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { getMealsBySearch } from "../utils/api";
import axios from "axios";

const SearchBar = memo(({ setRecipes }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const performSearch = useCallback(
    async (searchQuery) => {
      if (!searchQuery?.trim()) {
        setRecipes([]);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const results = await getMealsBySearch(
          searchQuery.trim(),
          abortControllerRef.current.signal
        );

        setRecipes(results);

        if (results.length === 0) {
          setError(
            `No recipes found for "${searchQuery}". Try a different search term.`
          );
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Search error:", err);
          setError("Failed to search recipes. Please try again.");
          setRecipes([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [setRecipes]
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      setError(null);

      // Clear previous debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Debounce search - search automatically after user stops typing
      if (value.trim()) {
        debounceTimeoutRef.current = setTimeout(() => {
          performSearch(value);
        }, 500); // 500ms debounce
      } else {
        setRecipes([]);
      }
    },
    [performSearch, setRecipes]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Clear debounce timeout and search immediately
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      performSearch(query);
    },
    [query, performSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setError(null);
    setRecipes([]);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [setRecipes]);

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center px-4"
        role="search"
        aria-label="Recipe search"
      >
        <div className="relative flex-1">
          <span
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl"
            aria-hidden="true"
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for delicious recipes..."
            value={query}
            onChange={handleInputChange}
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-food-surface text-white border-2 border-food placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-food transition-all"
            aria-label="Search recipes"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
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
          aria-label={loading ? "Searching..." : "Search recipes"}
        >
          {loading ? (
            <>
              <span className="animate-spin" aria-hidden="true">
                ⏳
              </span>
              Searching...
            </>
          ) : (
            <>
              <span aria-hidden="true">🍳</span>
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
