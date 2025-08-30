import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const RecipeDetails = lazy(() => import("./pages/RecipeDetails"));

export default function App() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-gray-800 text-white">
        {/* Header always on top */}
        <Header />

        {/* Main content grows and pushes footer down */}
        <main className="flex-grow bg-food-gradient-subtle">
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader /></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="*" element={<div className="text-center py-20"><h1 className="text-2xl text-primary-light">Page Not Found</h1><p className="text-gray-400 mt-2">The recipe you're looking for doesn't exist.</p></div>} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer always sticks at bottom */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
