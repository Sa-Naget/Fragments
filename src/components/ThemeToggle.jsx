import { useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';
import './ThemeToggle.css';

const MAX_PULL = 22;
const TRIGGER_THRESHOLD = 14;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [pull, setPull] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const draggedRef = useRef(false);

  const handlePointerDown = (e) => {
    startYRef.current = e.clientY;
    draggedRef.current = false;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientY - startYRef.current;
    if (delta > 3) draggedRef.current = true;
    setPull(Math.min(Math.max(delta, 0), MAX_PULL));
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (pull >= TRIGGER_THRESHOLD) {
      toggleTheme();
    }
    setPull(0);
  };

  const handleClick = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    toggleTheme();
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label={`Switch to ${theme === 'morning' ? 'night' : 'morning'} mode`}
      title={theme === 'morning' ? 'My star! Is it night, already?' : 'My sun! Is it morning, already?'}
    >
      <svg viewBox="0 0 40 70" width="28" height="49" aria-hidden="true">
        <g
          className={isDragging ? 'toggle-pull-group dragging' : 'toggle-pull-group'}
          style={{ transform: `translateY(${pull}px)` }}
        >
          <line x1="20" y1="0" x2="20" y2="22" stroke="var(--accent-gold)" strokeWidth="1.5" />
          <circle cx="20" cy="25" r="3.5" fill="var(--accent-gold)" />
        </g>
        <circle
          cx="20"
          cy="42"
          r="14"
          fill={theme === 'morning' ? 'var(--accent-gold)' : 'var(--surface-muted)'}
          stroke="var(--accent-gold)"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}