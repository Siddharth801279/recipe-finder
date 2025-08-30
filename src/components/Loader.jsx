import { memo } from "react";

const Loader = memo(({
  size = "default",
  message = "Cooking up something delicious...",
  showMessage = true
}) => {
  // Size variants for flexibility
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-16 h-16",
    large: "w-24 h-24"
  };

  const containerClasses = {
    small: "h-16",
    default: "h-32",
    large: "h-40"
  };

  const emojiClasses = {
    small: "text-lg",
    default: "text-2xl",
    large: "text-4xl"
  };

  return (
    <div
      className={`flex flex-col justify-center items-center ${containerClasses[size]}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`${emojiClasses[size]} animate-pulse`}
            role="img"
            aria-label="cooking"
            aria-hidden="true"
          >
            🍳
          </span>
        </div>
      </div>
      {showMessage && (
        <p className="mt-4 text-primary-light font-medium animate-pulse text-center">
          {message}
        </p>
      )}
    </div>
  );
});

Loader.displayName = 'Loader';

export default Loader;
