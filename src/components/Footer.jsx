import { memo } from "react";

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-food-gradient border-t-2 border-primary py-6 text-center shadow-food-lg">
      <div className="container mx-auto px-6">
        <p className="text-white text-sm mb-2">
          © {currentYear}{" "}
          <span className="font-bold text-primary-light">🍳 Recipe Finder</span> | Made with ❤️ for food lovers
        </p>
        <p className="text-gray-200 text-xs">
          Discover delicious recipes from around the world
        </p>
        <div className="mt-3 text-xs text-gray-300">
          Powered by{" "}
          <a
            href="https://www.themealdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-light hover:text-primary transition-colors underline"
          >
            TheMealDB API
          </a>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
