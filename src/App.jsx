import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Header always on top */}
      <Header />

      {/* Main content grows and pushes footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
      </main>

      {/* Footer always sticks at bottom */}
      <Footer />
    </div>
  );
}
