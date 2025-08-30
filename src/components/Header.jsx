import { useState, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const isActive = useCallback(
    (path) => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  return (
    <header className="bg-food-surface border-b-2 border-primary text-white shadow-food-lg sticky top-0 z-40">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-primary-light flex items-center gap-2 hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          <span className="text-3xl" role="img" aria-label="cooking">
            🍳
          </span>
          Recipe Finder
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/"
            className={`hover:text-primary-light transition-colors font-medium relative group ${
              isActive("/") ? "text-primary-light" : ""
            }`}
          >
            Home
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-primary-light transition-all ${
                isActive("/")
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none text-primary-light hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={closeMenu}
            />

            {/* Menu */}
            <div className="fixed top-full left-0 right-0 bg-food-surface border-t border-food-light md:hidden shadow-food-lg z-50">
              <div className="flex flex-col space-y-2 py-4 px-6">
                <Link
                  to="/"
                  className={`hover:text-primary-light transition-colors font-medium py-2 ${
                    isActive("/") ? "text-primary-light" : ""
                  }`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <a
                  href="https://github.com/yourusername/recipe-finder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light transition-colors font-medium py-2"
                  onClick={closeMenu}
                >
                  GitHub
                </a>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
