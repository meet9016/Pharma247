import { useEffect } from 'react';

/**
 * A custom hook to trigger a submit function when Alt + S is pressed.
 * 
 * @param {Function} onSubmit - The function to call on form submission.
 * @param {boolean} isActive - Whether the shortcut should be active (useful for modals/popups).
 */
const useSubmitShortcut = (onSubmit, isActive = true) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Alt (or Option on Mac) and S are pressed
      if (event.altKey && event.key.toLowerCase() === 's') {
        if (isActive && typeof onSubmit === 'function') {
          event.preventDefault(); // Prevent default browser behavior (e.g. save dialog)
          onSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSubmit, isActive]);
};

export default useSubmitShortcut;


































