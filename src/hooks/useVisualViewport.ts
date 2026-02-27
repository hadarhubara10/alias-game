import { useEffect } from 'react';

/**
 * Syncs the actual visible viewport height (excluding browser navigation bars,
 * address bar, and on-screen keyboard) into the CSS variable `--vvh`.
 *
 * Use `height: var(--vvh, 100svh)` in CSS / inline styles instead of `100vh`
 * or `fixed inset-0` to get a layout that exactly fills the visible screen.
 *
 * Uses requestAnimationFrame to batch rapid resize events.
 */
export function useVisualViewport(): void {
  useEffect(() => {
    let scheduled = false;

    function update(): void {
      const vv = window.visualViewport;
      const h = vv ? Math.round(vv.height) : window.innerHeight;
      document.documentElement.style.setProperty('--vvh', `${h}px`);
    }

    function schedule(): void {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        update();
      });
    }

    update();

    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);
    window.addEventListener('resize', schedule);

    return () => {
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
}
