import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ setRecipes }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      setRecipes(response.data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-3 my-6 justify-center px-4"
    >
      <input
        type="text"
        placeholder="Search recipe..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 max-w-md p-3 rounded-xl bg-gray-900 text-white border border-gray-700 placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow-lg"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
