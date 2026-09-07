import { useEffect, useRef } from "react";

// Minimal accessibility behavior shared by the app's hand-rolled bottom
// sheets (ProductQuickPreview, BundleCard): Escape closes the sheet while
// it's open, and focus moves onto the panel on open and back to whatever
// triggered it on close. Not a full focus trap — Tab can still leave the
// sheet — but it gives keyboard users a reliable way in and out.
export function useDialogA11y<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
) {
  const panelRef = useRef<T>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen]);

  return panelRef;
}
