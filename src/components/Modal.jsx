import { useEffect, useRef, useCallback, memo } from "react";
import { createPortal } from "react-dom";

const Modal = memo(({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  initialFocusRef,
  containerClassName = "",
  overlayClassName = "",
}) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const titleId = useRef(`modal-title-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // Memoized event handlers
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose?.();
      return;
    }

    if (e.key === "Tab") {
      // Focus trap within modal
      const focusables = contentRef.current?.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );

      if (!focusables || focusables.length === 0) return;

      const list = Array.from(focusables).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
      );

      if (list.length === 0) return;

      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  }, [onClose]);

  // Modal lifecycle management
  useEffect(() => {
    if (!isOpen) return;

    // Save last focused element and lock scroll
    lastFocusedRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus management with timeout for better reliability
    const focusTimeout = setTimeout(() => {
      const focusTarget = initialFocusRef?.current ||
        contentRef.current?.querySelector(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
      focusTarget?.focus();
    }, 100);

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus with timeout to ensure modal is unmounted
      setTimeout(() => {
        if (lastFocusedRef.current && typeof lastFocusedRef.current.focus === 'function') {
          try {
            lastFocusedRef.current.focus();
          } catch (error) {
            // Fallback if focus restoration fails
            document.body.focus();
          }
        }
      }, 100);
    };
  }, [isOpen, handleKeyDown, initialFocusRef]);

  // Don't render if not open
  if (!isOpen) return null;

  // Default classes with better performance
  const overlayClasses = overlayClassName ||
    "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";
  const contentClasses = containerClassName ||
    "relative bg-food-surface rounded-xl shadow-food-lg border-2 border-primary p-4 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-2";

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={overlayClasses}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId.current : undefined}
      aria-describedby={title ? undefined : "modal-content"}
    >
      <div
        ref={contentRef}
        className={contentClasses}
        role="document"
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white bg-accent hover:bg-accent-light rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-food z-10"
            aria-label="Close modal"
            type="button"
          >
            <span className="text-xl" aria-hidden="true">✕</span>
          </button>
        )}

        {title && (
          <h2
            id={titleId.current}
            className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary-light pr-8"
          >
            {title}
          </h2>
        )}

        <div id="modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
});

Modal.displayName = 'Modal';

export default Modal;
