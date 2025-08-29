import React from "react";

const RecipeCard = ({ recipe }) => {
  return (
    <div>
      <h3>{recipe.title || "Recipe Title"}</h3>
    </div>
  );
};

export default RecipeCard;
