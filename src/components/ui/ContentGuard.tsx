"use client";

import { useEffect } from "react";

/**
 * ContentGuard — Comprehensive Content Protection
 *
 * Prevents casual and semi-advanced content scraping by:
 *
 *  1. Blocking right-click context menu
 *  2. Blocking text selection (CSS + JS selectstart)
 *  3. Blocking copy / cut / paste-as-extraction events
 *  4. Blocking drag-start on images and text
 *  5. Blocking ALL keyboard shortcuts that expose content:
 *       - Ctrl/Cmd + C (copy)
 *       - Ctrl/Cmd + A (select all)
 *       - Ctrl/Cmd + U (view source)
 *       - Ctrl/Cmd + S (save page)
 *       - Ctrl/Cmd + P (print / save-as-PDF)
 *       - Ctrl/Cmd + Shift + I (DevTools)
 *       - Ctrl/Cmd + Shift + J (Console)
 *       - Ctrl/Cmd + Shift + C (Inspect element)
 *       - F12 (DevTools)
 *       - PrintScreen
 *  6. Blanking body during print (beforeprint / afterprint)
 *  7. Iframe-busting — prevents embedding the site in a frame
 *
 * Note: This is a deterrent layer, not DRM. Determined users with
 * technical skills can still read source HTML. The goal is to prevent
 * casual copy-paste, save-as, and print workflows.
 */
export function ContentGuard() {
  useEffect(() => {
    // ── Helpers ───────────────────────────────────────────────────────
    const prevent = (e: Event) => e.preventDefault();

    // ── 1. Context menu (right-click) ────────────────────────────────
    document.addEventListener("contextmenu", prevent);

    // ── 2. Copy & Cut ────────────────────────────────────────────────
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);

    // ── 3. Text selection via mouse ──────────────────────────────────
    document.addEventListener("selectstart", prevent);

    // ── 4. Image / link drag ─────────────────────────────────────────
    document.addEventListener("dragstart", prevent);

    // ── 5. Keyboard shortcuts ────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // F12 — DevTools
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        return;
      }

      if (!ctrl) return;

      // Ctrl+Shift combos (DevTools)
      if (ctrl && shift) {
        const shiftBlocked = ["I", "i", "J", "j", "C", "c"];
        if (shiftBlocked.includes(e.key)) {
          e.preventDefault();
          return;
        }
      }

      // Ctrl/Cmd single-key combos
      const blocked = [
        "c", "C", // copy
        "a", "A", // select all
        "u", "U", // view source
        "s", "S", // save
        "p", "P", // print
      ];
      if (blocked.includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // ── 6. Print protection (beforeprint / afterprint) ───────────────
    // Even though CSS @media print hides the body, some browsers
    // render before applying the print stylesheet. This JS layer
    // ensures the body is hidden before the print dialog opens.
    let originalVisibility = "";

    const handleBeforePrint = () => {
      originalVisibility = document.body.style.visibility;
      document.body.style.visibility = "hidden";
    };

    const handleAfterPrint = () => {
      document.body.style.visibility = originalVisibility;
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    // ── 7. Iframe-busting ────────────────────────────────────────────
    // If someone embeds our site in an iframe, break out.
    if (window.top !== window.self) {
      try {
        if (window.top) {
          window.top.location.href = window.self.location.href;
        }
      } catch {
        // Cross-origin frame — can't redirect, but we can blank ourselves
        document.body.innerHTML = "";
      }
    }

    // ── Cleanup ──────────────────────────────────────────────────────
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return null;
}
