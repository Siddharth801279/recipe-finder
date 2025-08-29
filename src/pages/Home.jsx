import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecipeList from "../components/RecipeList";
import axios from "axios";

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  // Random recipes load karne ke liye useEffect
  useEffect(() => {
    async function fetchRandomRecipes() {
      try {
        const res = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );

        // 8 random recipes le aate hain loop chala ke
        let randomMeals = [];

        async function fetchRandomMeals() {
          const requests = Array.from({ length: 8 }, () =>
            axios.get("https://www.themealdb.com/api/json/v1/1/random.php")
          );

          try {
            const responses = await Promise.all(requests); // Run all requests in parallel
            const randomMeals = responses.map((res) => res.data.meals[0]);
            setRecipes(randomMeals);
          } catch (error) {
            console.error("Error fetching meals:", error);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchRandomRecipes();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* Search Bar */}
      <SearchBar setRecipes={setRecipes} />

      {/* Recipes List niche hi dikhegi */}
      <div className="mt-6">
        <RecipeList recipes={recipes} />
      </div>
    </div>
  );
}
