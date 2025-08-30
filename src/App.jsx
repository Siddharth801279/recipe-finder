import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";

export default function App() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-800 text-white">
            <Header />
            <main className="flex-grow bg-food-gradient-subtle">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipe/:id" element={<RecipeDetails />} />
                    <Route path="*" element={<div className="text-center py-20"><h1 className="text-2xl text-primary-light">Page Not Found</h1><p className="text-gray-400 mt-2">The recipe you're looking for doesn't exist.</p></div>} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
