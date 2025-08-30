import { memo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

const Modal = memo(({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  containerClassName = "",
  overlayClassName = "",
}) => {
  const overlayRef = useRef(null);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  }, [onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  const overlayClasses = overlayClassName ||
    "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";
  const contentClasses = containerClassName ||
    "relative bg-food-surface rounded-xl shadow-food-lg border-2 border-primary p-4 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2";

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={overlayClasses}
    >
      <div className={contentClasses}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white bg-accent hover:bg-accent-light rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-food z-10"
            type="button"
          >
            <span className="text-xl">✕</span>
          </button>
        )}
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary-light pr-8">
            {title}
          </h2>
        )}
        <div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
});

Modal.displayName = 'Modal';

export default Modal;
