import { useEffect, useRef, useState, useCallback } from 'react';

const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 100;
// Safety margin so text never touches the card edge
const SAFETY_MARGIN = 80;

function measureBestFontSize(
  text: string,
  maxWidth: number,
  maxHeight: number
): number {
  const span = document.createElement('span');
  span.style.cssText = [
    'position: absolute',
    'visibility: hidden',
    'top: -9999px',
    'left: -9999px',
    'font-weight: 900',
    'font-family: Heebo, Rubik, system-ui, sans-serif',
    'line-height: 1.25',
    'white-space: normal',
    'word-break: break-word',
    'overflow-wrap: break-word',
    'text-align: center',
    `max-width: ${maxWidth}px`,
  ].join(';');
  span.textContent = text;
  document.body.appendChild(span);

  let lo = MIN_FONT_SIZE;
  let hi = MAX_FONT_SIZE;
  let best = MIN_FONT_SIZE;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    span.style.fontSize = `${mid}px`;

    if (span.offsetWidth <= maxWidth && span.offsetHeight <= maxHeight) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  document.body.removeChild(span);
  return best;
}

export function useFitText(text: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Start small — no overflow flash before effect runs
  const [fontSize, setFontSize] = useState(MIN_FONT_SIZE);

  const compute = useCallback(() => {
    const container = containerRef.current;
    if (!container || !text) return;

    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const best = measureBestFontSize(
      text,
      width - SAFETY_MARGIN,
      height - SAFETY_MARGIN
    );
    setFontSize(best);
  }, [text]);

  useEffect(() => {
    // Compute immediately, then again once fonts are ready
    compute();
    document.fonts.ready.then(compute);

    const observer = new ResizeObserver(compute);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [compute]);

  return { containerRef, fontSize };
}
